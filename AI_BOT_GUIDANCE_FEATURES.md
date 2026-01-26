# AI Bot Guidance Features

This document describes the 4 guidance features added to the AI bot to help users navigate the Linux Finder website.

## 1. Onboarding Tour (Interactive First-Visit Experience)

**File:** `src/components/onboarding-tour.tsx`

### Purpose
Provides a guided walkthrough for first-time visitors to understand the website's main features.

### Features
- 6-step interactive tour
- Progress bar showing current step
- Covers: Home page, Browse, Quiz, Search, Compare, AI Assistant
- Remembered via localStorage (won't show again after completion)
- Can be manually triggered by adding a "Help Tour" button

### How It Works
1. Tour appears automatically on first visit
2. User can navigate forward/backward
3. Each step highlights a website feature
4. Completion is saved to prevent showing on subsequent visits

### Quick Actions
Users can skip directly to relevant features from any step.

---

## 2. Contextual Help (Page-Specific Guidance)

**File:** `src/components/contextual-help.tsx`

### Purpose
Provides page-specific tips and guidance based on the current section of the website.

### Features
- Help button on major pages (Home, Distros, Detail, Compare, Quiz, Submit)
- Page-specific tips with practical advice
- Quick link to open the AI Assistant
- Dialog-based UI for clean information display

### Pages Covered
- **Home:** Getting started overview
- **Distros:** Browsing and filtering tips
- **Distro Detail:** Understanding distribution information
- **Compare:** Using comparison features effectively
- **Quiz:** How the recommendation quiz works
- **Submit:** Contributing to the catalog

### How It Works
1. User clicks "Help" button on a page
2. Dialog opens with page-specific tips
3. User can choose to "Ask AI Assistant" for more detailed help
4. AI Assistant opens with the page context

---

## 3. Welcome Message & Quick Actions (In-Chat Guidance)

**File:** `src/components/chat-widget.tsx` (Enhanced)

### Purpose
Greets users and provides smart quick-action suggestions based on their skill level.

### Features
- Personalized welcome message
- Skill-level-aware quick actions:
  - **Beginner:** First-time setup, choosing distros, general help
  - **Intermediate:** Dual boot, recommendations, troubleshooting
  - **Advanced:** Server setup, advanced config, performance optimization
- One-click suggestions to quickly ask common questions
- Health status indicator for Ollama connection

### How It Works
1. Chat widget opens
2. Welcome message displays with 3 quick-action buttons
3. User can click a button to instantly ask a pre-formatted question
4. Selected action populates the input and can be modified before sending

### Props
- `skillLevel`: 'beginner' | 'intermediate' | 'advanced' (default: 'beginner')
- `distro`: Optional Distro object for context

---

## 4. Setup Guides (Structured Installation Workflows)

**File:** `src/lib/setup-guide.ts` and `src/components/setup-guide-display.tsx`

### Purpose
Provides structured, step-by-step guides for common Linux installation and configuration scenarios.

### Available Guides

1. **First Time Linux User** (60 min, Beginner)
   - Steps: Choose distro → Download ISO → Verify checksum → Create USB → Install → Post-install setup

2. **Dual Boot Setup** (90 min, Intermediate)
   - Steps: Backup data → Partition disk → Create bootable media → Install Linux → Configure bootloader

3. **WSL2 Setup** (40 min, Beginner/Intermediate)
   - Steps: Enable WSL → Install kernel → Choose distro → Initial setup → Install development tools

4. **Linux Server Setup** (120 min, Intermediate/Advanced)
   - Steps: Choose distro → Install → Configure network → Secure server → Install services

### Setup Guide Display Component
- Progress tracking with visual progress bar
- Expandable steps with descriptions
- Difficulty badges (easy/medium/hard)
- Time estimates for each step
- Checkbox to mark steps complete
- "Get Help" button to ask AI assistant for specific step

### How It Works
1. AI assistant detects user is looking for setup guidance
2. Recommends relevant guide based on skill level
3. Displays interactive guide with progress tracking
4. User can click "Get Help with This Step" to ask detailed questions
5. AI provides specific guidance for that step

### Quick Action
From chat widget, users can ask: "Show me the first-time Linux setup guide"

---

## Enhanced System Prompt

**File:** `tools/ai/system_prompt.txt`

### New Behaviors
1. **Guidance-Focused:** Always asks about skill level and use case
2. **Welcome Detection:** Recognizes first-time users and provides warm welcome
3. **Setup Guide Integration:** Recommends and explains setup guides
4. **Skill-Appropriate Responses:** Adjusts explanation depth based on skill level
5. **Next Steps:** Always provides follow-up actions or questions

### Key Improvements
- Added GUIDANCE FOCUSED behavior rule
- Added WELCOME & ONBOARDING detection
- Added SKILL-APPROPRIATE response adjustment
- Enhanced troubleshooting with clarity
- Better next steps guidance

---

## Usage Examples

### For New Users
1. Visit the site → See onboarding tour
2. Click "Help" on any page → Get page-specific tips
3. Open chat → See skill-level-appropriate quick actions
4. Ask "Show me setup guide" → Get interactive step-by-step guide

### For Intermediate Users
1. Visit distros page → Click Help for filtering tips
2. Open chat → See dual-boot and comparison suggestions
3. Ask "Help me with dual boot" → Get detailed guidance with AI support
4. Use setup guide to track progress through installation

### For Advanced Users
1. Skip tour (can be dismissed)
2. Open chat → See server setup and advanced configuration options
3. Ask specific technical questions → Get detailed technical responses
4. Use help system for unfamiliar distro-specific information

---

## Integration Points

### Component Integration
```tsx
// In main layout or app
import { OnboardingTour } from '@/components/onboarding-tour';
import { ContextualHelp } from '@/components/contextual-help';
import { ChatWidget } from '@/components/chat-widget';

// Use in pages
<OnboardingTour isFirstVisit={isFirstVisit} onClose={onTourComplete} />
<ContextualHelp pageType="home" onOpenChat={handleOpenChat} />
<ChatWidget skillLevel="beginner" distro={currentDistro} />
```

### API Integration
- AI endpoint respects `skill_level` in requests
- Returns structured responses with setup guides
- Supports referencing guides in conversational context

---

## Future Enhancements

1. **Video Tutorials:** Link to video guides for visual learners
2. **Community Contributions:** Allow users to submit their own setup guides
3. **Offline Support:** Cache guides for offline access
4. **Customizable Tours:** Let users create custom guided tours
5. **Analytics:** Track which guides are most helpful
6. **Language Support:** Multi-language setup guides

---

## Technical Notes

### localStorage Keys
- `tour-completed`: Set when user completes onboarding tour

### Performance Considerations
- Tour component mounts only on first visit
- Help components are dialog-based (lazy loaded)
- Setup guides are data-driven (easy to add new guides)
- No additional API calls for static content

### Accessibility
- All interactive elements have proper aria-labels
- Dialog components follow WCAG guidelines
- Keyboard navigation supported
- Progress indicators for all multi-step processes
