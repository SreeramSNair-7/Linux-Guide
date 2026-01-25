// file: src/tests/distro.schema.test.ts
import { describe, it, expect } from 'vitest';
import { DistroSchema, IsoFileSchema, InstallStepSchema } from '@/types/distro.schema';

describe('Distro Schema Validation', () => {
  it('should validate a valid ISO file', () => {
    const validIso = {
      id: 'test-iso',
      url: 'https://example.com/test.iso',
      filename: 'test.iso',
      size_mb: 4096,
      sha256: 'a'.repeat(64),
      region: 'Global',
      protocol: 'https' as const,
      hosted: false,
    };

    const result = IsoFileSchema.safeParse(validIso);
    expect(result.success).toBe(true);
  });

  it('should reject invalid SHA256 checksum', () => {
    const invalidIso = {
      id: 'test-iso',
      url: 'https://example.com/test.iso',
      filename: 'test.iso',
      size_mb: 4096,
      sha256: 'invalid',
      protocol: 'https' as const,
    };

    const result = IsoFileSchema.safeParse(invalidIso);
    expect(result.success).toBe(false);
  });

  it('should validate a valid install step', () => {
    const validStep = {
      id: 'step-1',
      title: 'Download ISO',
      detail_md: 'Download the ISO file from official source',
      estimated_minutes: 30,
      risk: 'low' as const,
    };

    const result = InstallStepSchema.safeParse(validStep);
    expect(result.success).toBe(true);
  });

  it('should validate a complete distro', () => {
    const validDistro = {
      id: 'test-distro',
      name: 'Test Linux',
      family: 'Debian' as const,
      latest_version: '1.0',
      release_date: '2024-01-01',
      target_users: ['beginner' as const],
      desktop_environments: ['GNOME'],
      package_manager: 'apt',
      kernel: '6.5',
      min_ram_mb: 2048,
      min_storage_mb: 20480,
      iso_files: [
        {
          id: 'iso-1',
          url: 'https://example.com/test.iso',
          filename: 'test.iso',
          size_mb: 2048,
          sha256: 'a'.repeat(64),
          protocol: 'https' as const,
          hosted: false,
        },
      ],
      install_steps: [
        {
          id: 'step-1',
          title: 'Install',
          detail_md: 'Install the OS',
          estimated_minutes: 30,
          risk: 'low' as const,
        },
      ],
      official_docs_url: 'https://example.com/docs',
      license: 'GPL',
      tags: ['test'],
      last_verified: '2024-01-01',
    };

    const result = DistroSchema.safeParse(validDistro);
    expect(result.success).toBe(true);
  });

  it('should reject distro with invalid date format', () => {
    const invalidDistro = {
      id: 'test-distro',
      name: 'Test Linux',
      family: 'Debian' as const,
      latest_version: '1.0',
      release_date: '01-01-2024', // Invalid format
      target_users: ['beginner' as const],
      desktop_environments: ['GNOME'],
      package_manager: 'apt',
      kernel: '6.5',
      min_ram_mb: 2048,
      min_storage_mb: 20480,
      iso_files: [],
      install_steps: [],
      official_docs_url: 'https://example.com/docs',
      license: 'GPL',
      tags: ['test'],
      last_verified: '2024-01-01',
    };

    const result = DistroSchema.safeParse(invalidDistro);
    expect(result.success).toBe(false);
  });
});
