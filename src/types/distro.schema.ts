// file: src/types/distro.schema.ts
import { z } from 'zod';

/**
 * ISO File schema - represents a downloadable ISO image
 */
export const IsoFileSchema = z.object({
  id: z.string().describe('Unique identifier for this ISO file'),
  url: z.string().url().describe('Direct download URL for the ISO'),
  filename: z.string().describe('Filename of the ISO'),
  size_mb: z.number().positive().describe('Size in megabytes'),
  sha256: z.string().length(64).describe('SHA256 checksum for verification'),
  region: z.string().optional().describe('Geographic region or mirror location'),
  protocol: z.enum(['http', 'https', 'torrent', 'ftp']).default('https'),
  hosted: z.boolean().default(false).describe('Whether hosted on our infrastructure'),
});

export type IsoFile = z.infer<typeof IsoFileSchema>;

/**
 * Install Step schema - represents a single installation step
 */
export const InstallStepSchema = z.object({
  id: z.string().describe('Unique step identifier'),
  title: z.string().describe('Step title'),
  detail_md: z.string().describe('Markdown content with detailed instructions'),
  estimated_minutes: z.number().int().positive().describe('Estimated time in minutes'),
  risk: z.enum(['low', 'medium', 'high']).default('low').describe('Risk level of this step'),
  commands: z
    .array(
      z.object({
        command: z.string(),
        platform: z.enum(['windows', 'linux', 'macos', 'wsl']),
        explanation: z.string(),
      })
    )
    .optional()
    .describe('Optional commands to execute'),
});

export type InstallStep = z.infer<typeof InstallStepSchema>;

/**
 * Maintainer schema
 */
export const MaintainerSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  url: z.string().url().optional(),
});

export type Maintainer = z.infer<typeof MaintainerSchema>;

/**
 * Main Distro schema - comprehensive Linux distribution metadata
 */
export const DistroSchema = z.object({
  // Core identification
  id: z.string().describe('Unique distro identifier (slug)'),
  name: z.string().min(1).describe('Display name'),
  family: z
    .enum([
      'Debian',
      'Arch',
      'Red Hat',
      'SUSE',
      'Gentoo',
      'Slackware',
      'Independent',
      'Android',
      'Other',
    ])
    .describe('Distribution family/lineage'),

  // Version information
  latest_version: z.string().describe('Latest stable version number'),
  codename: z.string().optional().describe('Version codename'),
  release_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('ISO 8601 date (YYYY-MM-DD)'),

  // Target audience and use cases
  target_users: z
    .array(z.enum(['beginner', 'intermediate', 'advanced', 'enterprise', 'developer', 'server']))
    .min(1)
    .describe('Intended user types'),

  // Technical specifications
  desktop_environments: z
    .array(z.string())
    .describe('Available desktop environments (GNOME, KDE, XFCE, etc.)'),
  package_manager: z.string().describe('Primary package manager (apt, pacman, dnf, etc.)'),
  kernel: z.string().describe('Kernel version or type'),
  min_ram_mb: z.number().int().positive().describe('Minimum RAM in megabytes'),
  min_storage_mb: z.number().int().positive().describe('Minimum storage in megabytes'),

  // ISO files and downloads
  iso_files: z.array(IsoFileSchema).min(1).describe('Available ISO files'),
  iso_sizes_mb: z
    .array(z.number())
    .optional()
    .describe('Array of ISO sizes for quick reference'),
  sha256_checksums: z.array(z.string()).optional().describe('All SHA256 checksums'),

  // Installation guidance
  install_guide_markdown: z.string().optional().describe('Full installation guide in Markdown'),
  install_steps: z.array(InstallStepSchema).describe('Structured installation steps'),

  // Documentation and resources
  official_docs_url: z.string().url().describe('Official documentation URL'),
  screenshots: z.array(z.string().url()).optional().describe('Screenshot URLs'),

  // Legal and privacy
  license: z.string().describe('Software license (GPL, MIT, proprietary, etc.)'),
  privacy_notes: z.string().optional().describe('Privacy considerations and data collection info'),

  // Metadata
  popularity_rank: z.number().int().positive().optional().describe('Ranking based on usage/popularity'),
  tags: z.array(z.string()).describe('Searchable tags'),
  last_verified: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .describe('Date checksums/data last verified'),
  maintainers: z.array(MaintainerSchema).optional().describe('Project maintainers'),
  notes: z.string().optional().describe('Additional notes or special information'),
});

export type Distro = z.infer<typeof DistroSchema>;

/**
 * User profile schema for AI queries
 */
export const UserProfileSchema = z.object({
  skill_level: z.enum(['beginner', 'intermediate', 'advanced']),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

/**
 * AI Query context schema
 */
export const AIQueryContextSchema = z.object({
  distro: DistroSchema.optional(),
  distros: z.array(DistroSchema).optional(),
  platform: z.enum(['windows', 'wsl', 'macos', 'linux']),
  user_profile: UserProfileSchema,
  allow_hosted_iso: z.boolean().default(false),
});

export type AIQueryContext = z.infer<typeof AIQueryContextSchema>;

/**
 * AI Response schema - structured response from AI assistant
 */
export const AIResponseSchema = z.object({
  answer_md: z.string().describe('Markdown formatted answer'),
  steps: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        detail_md: z.string(),
        estimated_minutes: z.number().int(),
        risk: z.enum(['low', 'medium', 'high']),
      })
    )
    .default([]),
  commands: z
    .array(
      z.object({
        command: z.string(),
        platform: z.string(),
        explanation: z.string(),
        confirm_required: z.boolean().default(false),
      })
    )
    .default([]),
  sources: z
    .array(
      z.object({
        label: z.string(),
        url: z.string().url(),
      })
    )
    .default([]),
  followup: z.string().nullable().default(null),
  verification: z
    .object({
      checksum: z.string().nullable(),
      iso_url: z.string().url().nullable(),
      last_verified: z.string().nullable(),
    })
    .nullable()
    .default(null),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

/**
 * Simple submission schema for user suggestions
 */
export const SimpleDistroSubmissionSchema = z.object({
  osName: z.string().min(2).max(100),
  submitterName: z.string().min(2).max(100),
  submitterEmail: z.string().email(),
  submitterPhone: z.string().optional(),
  submitterMessage: z.string().optional(),
});

export type SimpleDistroSubmission = z.infer<typeof SimpleDistroSubmissionSchema>;

/**
 * Submission schema for user-contributed distros
 */
export const DistroSubmissionSchema = DistroSchema.omit({
  last_verified: true,
  popularity_rank: true,
}).extend({
  submitter_email: z.string().email().optional(),
  submitter_notes: z.string().optional(),
});

export type DistroSubmission = z.infer<typeof DistroSubmissionSchema>;
