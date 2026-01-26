// file: src/lib/setup-guide.ts

export interface SetupGuideStep {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SetupGuide {
  id: string;
  title: string;
  description: string;
  targetUsers: string[];
  totalDuration: number;
  steps: SetupGuideStep[];
}

export const SETUP_GUIDES: Record<string, SetupGuide> = {
  'first-time-linux': {
    id: 'first-time-linux',
    title: 'First Time Linux User',
    description: 'A comprehensive guide for anyone trying Linux for the first time',
    targetUsers: ['beginner'],
    totalDuration: 60,
    steps: [
      {
        id: 'choose-distro',
        title: 'Choose a Distribution',
        description: 'Select a beginner-friendly distro like Ubuntu, Linux Mint, or Elementary OS',
        duration_minutes: 10,
        difficulty: 'easy',
      },
      {
        id: 'download-iso',
        title: 'Download ISO File',
        description: 'Download the distribution ISO file from the official website',
        duration_minutes: 5,
        difficulty: 'easy',
      },
      {
        id: 'verify-checksum',
        title: 'Verify Checksum',
        description: 'Verify the ISO integrity using SHA256 checksum',
        duration_minutes: 5,
        difficulty: 'medium',
      },
      {
        id: 'create-usb',
        title: 'Create Bootable USB',
        description: 'Use tools like Rufus, Etcher, or Ventoy to create a bootable USB drive',
        duration_minutes: 15,
        difficulty: 'easy',
      },
      {
        id: 'install-distro',
        title: 'Install Distribution',
        description: 'Follow the graphical installer to install Linux on your system',
        duration_minutes: 20,
        difficulty: 'medium',
      },
      {
        id: 'post-install',
        title: 'Post-Installation Setup',
        description: 'Install software, update system, and customize your desktop',
        duration_minutes: 20,
        difficulty: 'easy',
      },
    ],
  },
  'dual-boot-setup': {
    id: 'dual-boot-setup',
    title: 'Dual Boot Setup',
    description: 'Set up dual boot with Windows and Linux on the same machine',
    targetUsers: ['intermediate'],
    totalDuration: 90,
    steps: [
      {
        id: 'backup-data',
        title: 'Backup Your Data',
        description: 'Create a complete backup of your Windows system',
        duration_minutes: 30,
        difficulty: 'easy',
      },
      {
        id: 'disk-partition',
        title: 'Partition Disk',
        description: 'Create free space for Linux using Windows Disk Management',
        duration_minutes: 15,
        difficulty: 'hard',
      },
      {
        id: 'create-bootable',
        title: 'Create Bootable Media',
        description: 'Create a bootable USB with your chosen Linux distribution',
        duration_minutes: 10,
        difficulty: 'medium',
      },
      {
        id: 'install-linux',
        title: 'Install Linux',
        description: 'Install Linux on the prepared partition without affecting Windows',
        duration_minutes: 20,
        difficulty: 'hard',
      },
      {
        id: 'configure-grub',
        title: 'Configure Boot Loader',
        description: 'Ensure GRUB bootloader properly detects both Windows and Linux',
        duration_minutes: 15,
        difficulty: 'hard',
      },
    ],
  },
  'wsl-setup': {
    id: 'wsl-setup',
    title: 'WSL2 Setup',
    description: 'Set up Windows Subsystem for Linux 2 on Windows 10/11',
    targetUsers: ['beginner', 'intermediate'],
    totalDuration: 40,
    steps: [
      {
        id: 'enable-wsl',
        title: 'Enable WSL Feature',
        description: 'Enable the Windows Subsystem for Linux feature in Windows',
        duration_minutes: 5,
        difficulty: 'easy',
      },
      {
        id: 'install-wsl2',
        title: 'Install WSL2 Kernel',
        description: 'Download and install the WSL2 Linux kernel',
        duration_minutes: 10,
        difficulty: 'easy',
      },
      {
        id: 'choose-distro-wsl',
        title: 'Choose WSL Distribution',
        description: 'Select and install a distribution from Microsoft Store',
        duration_minutes: 10,
        difficulty: 'easy',
      },
      {
        id: 'initial-setup',
        title: 'Initial Setup',
        description: 'Create user account and configure your WSL environment',
        duration_minutes: 10,
        difficulty: 'easy',
      },
      {
        id: 'install-tools',
        title: 'Install Development Tools',
        description: 'Install git, Docker, Node.js, or other development tools',
        duration_minutes: 10,
        difficulty: 'medium',
      },
    ],
  },
  'server-setup': {
    id: 'server-setup',
    title: 'Linux Server Setup',
    description: 'Set up a secure and functional Linux server',
    targetUsers: ['intermediate', 'advanced'],
    totalDuration: 120,
    steps: [
      {
        id: 'choose-server-distro',
        title: 'Choose Server Distribution',
        description: 'Select a server-optimized distro like Ubuntu Server or CentOS',
        duration_minutes: 10,
        difficulty: 'easy',
      },
      {
        id: 'install-server',
        title: 'Install Server OS',
        description: 'Perform minimal server installation without GUI',
        duration_minutes: 30,
        difficulty: 'medium',
      },
      {
        id: 'configure-network',
        title: 'Configure Network',
        description: 'Set up static IP, DNS, and firewall configuration',
        duration_minutes: 20,
        difficulty: 'hard',
      },
      {
        id: 'secure-server',
        title: 'Secure Your Server',
        description: 'Set up SSH keys, disable root login, and configure firewall rules',
        duration_minutes: 30,
        difficulty: 'hard',
      },
      {
        id: 'install-services',
        title: 'Install Services',
        description: 'Install and configure web server, database, and other services',
        duration_minutes: 30,
        difficulty: 'hard',
      },
    ],
  },
};

export function getSetupGuide(guideId: string): SetupGuide | undefined {
  return SETUP_GUIDES[guideId];
}

export function getSuggestedGuides(skillLevel: 'beginner' | 'intermediate' | 'advanced'): SetupGuide[] {
  return Object.values(SETUP_GUIDES).filter((guide) =>
    guide.targetUsers.includes(skillLevel)
  );
}
