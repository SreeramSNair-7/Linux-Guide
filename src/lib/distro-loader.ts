// file: src/lib/distro-loader.ts
import fs from 'fs';
import path from 'path';
import { Distro, DistroSchema } from '@/types/distro.schema';

const DISTROS_DIR = path.join(process.cwd(), 'data', 'distros');

/**
 * Load and validate a single distro JSON file
 */
export async function loadDistro(id: string): Promise<Distro | null> {
  try {
    const filePath = path.join(DISTROS_DIR, `${id}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Validate with Zod schema
    const validated = DistroSchema.parse(data);
    return validated;
  } catch (error) {
    console.error(`Failed to load distro ${id}:`, error);
    return null;
  }
}

/**
 * Load all distro JSON files from data directory
 */
export async function loadAllDistros(): Promise<Distro[]> {
  try {
    if (!fs.existsSync(DISTROS_DIR)) {
      console.error('Distros directory not found:', DISTROS_DIR);
      return [];
    }

    const files = fs.readdirSync(DISTROS_DIR).filter((file) => file.endsWith('.json'));
    const distros: Distro[] = [];

    for (const file of files) {
      const filePath = path.join(DISTROS_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent);

      try {
        const validated = DistroSchema.parse(data);
        distros.push(validated);
      } catch (validationError) {
        const message = validationError instanceof Error ? validationError.message : String(validationError);
        console.error(`Validation error for ${file}:`, message);
      }
    }

    // Sort by popularity rank (lower is better)
    return distros.sort((a, b) => {
      const rankA = a.popularity_rank ?? 9999;
      const rankB = b.popularity_rank ?? 9999;
      return rankA - rankB;
    });
  } catch (error) {
    console.error('Failed to load distros:', error);
    return [];
  }
}

/**
 * Get distros filtered by criteria
 */
export async function filterDistros(filters: {
  family?: string;
  targetUser?: string;
  tags?: string[];
  minRamMb?: number;
}): Promise<Distro[]> {
  const allDistros = await loadAllDistros();

  return allDistros.filter((distro) => {
    if (filters.family && distro.family !== filters.family) {
      return false;
    }
    if (filters.targetUser && !distro.target_users.includes(filters.targetUser as any)) {
      return false;
    }
    if (filters.tags && !filters.tags.some((tag) => distro.tags.includes(tag))) {
      return false;
    }
    if (filters.minRamMb && distro.min_ram_mb > filters.minRamMb) {
      return false;
    }
    return true;
  });
}

/**
 * Search distros by keyword
 */
export async function searchDistros(query: string): Promise<Distro[]> {
  const allDistros = await loadAllDistros();
  const lowerQuery = query.toLowerCase();

  return allDistros.filter((distro) => {
    return (
      distro.name.toLowerCase().includes(lowerQuery) ||
      distro.id.toLowerCase().includes(lowerQuery) ||
      distro.family.toLowerCase().includes(lowerQuery) ||
      distro.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      distro.desktop_environments.some((de) => de.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Get recommended distros for skill level
 */
export async function getRecommendedDistros(
  skillLevel: 'beginner' | 'intermediate' | 'advanced',
  limit = 5
): Promise<Distro[]> {
  const allDistros = await loadAllDistros();

  return allDistros
    .filter((distro) => distro.target_users.includes(skillLevel))
    .slice(0, limit);
}
