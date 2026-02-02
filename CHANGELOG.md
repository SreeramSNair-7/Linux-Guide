# Changelog

All notable changes to the Linux Distro Catalog are documented in this file.

## [2.3.0] - 2026-02-02

### Added
- 🤖 **Hugging Face AI Integration**: Cloud-powered AI assistant (free tier)
- 📖 **HUGGINGFACE_SETUP.md**: Complete setup guide with 2-minute configuration
- 📋 **AI Provider Selection**: Auto-fallback from Hugging Face to Ollama
- 🔄 **Provider Health Checks**: Monitoring for both AI providers

### Changed
- Updated README to highlight Hugging Face as primary AI provider
- Made Hugging Face API key the primary prerequisite
- Improved setup documentation with provider options

### Security
- API key configuration with minimal required permissions
- Secure token storage in `.env.local`
- HTTPS endpoint with TLS validation

## [2.2.0] - 2026-02-01

### Added
- ✨ **Favorites Feature**: Save favorite distros with persistent localStorage
- ❤️ **Favorites Page**: View all saved distros at `/favorites`
- 🔗 **Favorites Link**: Heart icon in header navigation
- 🐧 **8 New Distributions**:
  - Raspberry Pi OS (Bookworm) - IoT/embedded systems
  - NixOS (Unstable) - Declarative/functional package management
  - openSUSE Leap 15.6 - Stable SUSE alternative
  - Fedora Server 41 - Enterprise server deployment
  - Puppy Linux 10 - Ultra-lightweight for old hardware
  - BunsenLabs Hydrogen - Minimal Openbox desktop
  - Artix Linux (OpenRC) - Arch without systemd
  - Parabola GNU/Linux-libre - Free software only distro
  - Q4OS - Trinity desktop for limited hardware
  - Kaos (KDE on Arch OS) - KDE Plasma 6 rolling release

### Changed
- Updated distro catalog from 50 to 58+ distributions
- Improved README documentation
- Removed Prisma database dependencies (switched to localStorage)

### Fixed
- Resolved Vercel deployment issues
- Fixed TypeScript/ESLint compilation errors
- Removed unused database configuration files

### Technical Details
- localStorage persists favorites across sessions
- No server-side database required
- Lightweight client-side solution
- Backwards compatible with existing features

## [2.1.0] - 2026-01-30

### Added
- Quiz feature for distro recommendations
- Compare tool for side-by-side distro analysis
- AI chat widget for installation assistance
- Dark mode support

### Fixed
- Build optimization
- Performance improvements

## [2.0.0] - 2026-01-25

### Added
- Initial public release
- 50+ Linux distributions in catalog
- Advanced search and filtering
- SHA256 checksum verification
- Desktop environment selection
- Installation guide integration

---

**Latest Commit**: `a2d94f9`  
**Last Updated**: February 1, 2026  
**Total Distributions**: 58+  
**Next.js Version**: 14.2.35
