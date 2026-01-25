// file: scripts/ingest.ts
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { DistroSchema } from '../src/types/distro.schema';

const DISTROS_DIR = path.join(process.cwd(), 'data', 'distros');
const VERIFY_ONLY = process.argv.includes('--verify-only');

interface VerificationResult {
  file: string;
  status: 'ok' | 'error';
  errors?: string[];
}

async function verifyDistroFile(filePath: string): Promise<VerificationResult> {
  const errors: string[] = [];
  const fileName = path.basename(filePath);

  try {
    // Read and parse JSON
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Validate with Zod schema
    try {
      DistroSchema.parse(data);
    } catch (zodError: any) {
      errors.push(`Schema validation failed: ${zodError.message}`);
    }

    // Verify ISO checksums format
    if (data.iso_files) {
      for (const iso of data.iso_files) {
        if (!/^[a-fA-F0-9]{64}$/.test(iso.sha256)) {
          errors.push(`Invalid SHA256 format for ISO: ${iso.filename}`);
        }
      }
    }

    // Check date formats
    if (data.release_date && !/^\d{4}-\d{2}-\d{2}$/.test(data.release_date)) {
      errors.push(`Invalid release_date format: ${data.release_date}`);
    }

    if (data.last_verified && !/^\d{4}-\d{2}-\d{2}$/.test(data.last_verified)) {
      errors.push(`Invalid last_verified format: ${data.last_verified}`);
    }

    // Check URLs
    const urlFields = ['official_docs_url', ...((data.screenshots || []) as string[])];
    for (const url of urlFields) {
      if (url && !isValidURL(url)) {
        errors.push(`Invalid URL: ${url}`);
      }
    }

    if (errors.length > 0) {
      return { file: fileName, status: 'error', errors };
    }

    return { file: fileName, status: 'ok' };
  } catch (error: any) {
    return {
      file: fileName,
      status: 'error',
      errors: [`Failed to process file: ${error.message}`],
    };
  }
}

function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function streamVerifyChecksum(url: string, expectedHash: string): Promise<boolean> {
  // In a real implementation, this would stream download and verify
  // For now, we'll simulate success
  console.log(`  Verifying checksum for ${url}...`);
  // const response = await fetch(url);
  // const arrayBuffer = await response.arrayBuffer();
  // const hash = crypto.createHash('sha256').update(Buffer.from(arrayBuffer)).digest('hex');
  // return hash === expectedHash.toLowerCase();
  return true; // Simulated
}

async function main() {
  console.log('Starting distro data ingestion...\n');

  // Ensure distros directory exists
  try {
    await fs.access(DISTROS_DIR);
  } catch {
    console.error(`Error: Distros directory not found: ${DISTROS_DIR}`);
    process.exit(1);
  }

  // Get all JSON files
  const files = await fs.readdir(DISTROS_DIR);
  const jsonFiles = files.filter((f) => f.endsWith('.json'));

  console.log(`Found ${jsonFiles.length} distro files to process\n`);

  const results: VerificationResult[] = [];
  let successCount = 0;
  let errorCount = 0;

  for (const file of jsonFiles) {
    const filePath = path.join(DISTROS_DIR, file);
    console.log(`Processing: ${file}`);

    const result = await verifyDistroFile(filePath);
    results.push(result);

    if (result.status === 'ok') {
      console.log(`  ✓ Valid`);
      successCount++;

      // If not verify-only, could perform additional actions here
      if (!VERIFY_ONLY) {
        // e.g., verify ISO checksums by streaming
        // const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        // for (const iso of data.iso_files || []) {
        //   await streamVerifyChecksum(iso.url, iso.sha256);
        // }
      }
    } else {
      console.log(`  ✗ Errors found:`);
      result.errors?.forEach((err) => console.log(`    - ${err}`));
      errorCount++;
    }
    console.log('');
  }

  // Summary
  console.log('='.repeat(60));
  console.log('Ingestion Summary:');
  console.log(`  Total files: ${jsonFiles.length}`);
  console.log(`  Successful: ${successCount}`);
  console.log(`  Errors: ${errorCount}`);
  console.log('='.repeat(60));

  // Write verification report
  const reportPath = path.join(process.cwd(), 'verification-report.json');
  await fs.writeFile(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        results,
        summary: {
          total: jsonFiles.length,
          successful: successCount,
          errors: errorCount,
        },
      },
      null,
      2
    )
  );

  console.log(`\nVerification report saved to: ${reportPath}`);

  // Exit with error code if any failures
  if (errorCount > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
