// file: scripts/index-search.ts
import fs from 'fs/promises';
import path from 'path';
import { MeiliSearch } from 'meilisearch';

const DISTROS_DIR = path.join(process.cwd(), 'data', 'distros');
const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || 'http://localhost:7700';
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || '';

async function main() {
  console.log('Indexing distros for MeiliSearch...\n');

  // Connect to MeiliSearch
  const client = new MeiliSearch({
    host: MEILISEARCH_HOST,
    apiKey: MEILISEARCH_API_KEY,
  });

  // Get or create index
  const index = client.index('distros');

  // Configure index settings
  await index.updateSettings({
    searchableAttributes: [
      'name',
      'family',
      'tags',
      'desktop_environments',
      'package_manager',
      'target_users',
      'codename',
    ],
    filterableAttributes: ['family', 'target_users', 'tags', 'min_ram_mb'],
    sortableAttributes: ['popularity_rank', 'release_date'],
    displayedAttributes: [
      'id',
      'name',
      'family',
      'latest_version',
      'release_date',
      'target_users',
      'tags',
      'popularity_rank',
    ],
  });

  // Read all distro files
  const files = await fs.readdir(DISTROS_DIR);
  const jsonFiles = files.filter((f) => f.endsWith('.json'));

  console.log(`Found ${jsonFiles.length} distro files\n`);

  const documents = [];

  for (const file of jsonFiles) {
    try {
      const content = await fs.readFile(path.join(DISTROS_DIR, file), 'utf-8');
      const data = JSON.parse(content);
      documents.push(data);
    } catch (error) {
      console.error(`Error reading ${file}:`, error);
    }
  }

  // Add documents to index
  console.log(`Indexing ${documents.length} documents...`);
  const result = await index.addDocuments(documents, { primaryKey: 'id' });

  console.log(`Task enqueued: ${result.taskUid}`);
  console.log('Waiting for indexing to complete...');

  // Wait for task to complete
  await client.waitForTask(result.taskUid);

  console.log('\n✓ Indexing complete!');

  // Get index stats
  const stats = await index.getStats();
  console.log(`\nIndex statistics:`);
  console.log(`  Total documents: ${stats.numberOfDocuments}`);
  console.log(`  Index size: ${Math.round(stats.indexSize / 1024)} KB`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
