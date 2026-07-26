# Project Audit: 14 - Design System

This report details the design tokens, dynamic CSS variables, layout scales, and reusable components.

## 1. Core Token Mappings

The primary tokens are declared inside `@layer base` in [src/app/globals.css:L3-L17](file:///d:/portfolio/src/app/globals.css#L3-L17) and updated dynamically by the `ThemeProvider`:

### 1.1 Color Tokens
- **Background (`--bg`)**: Dark gray/black (`#090909` default).
- **Surface (`--surface`)**: Deep matte gray (`#111111` default).
- **Text (`--text`)**: High-contrast warm white (`#F5F5F5` default).
- **Muted Text (`--text-muted`)**: Mid-tone silver-gray (`#A1A1AA` default).
- **Dimmed Text (`--text-dim`)**: Dark zinc-gray (`#71717A` default).
- **Accent Color (`--accent` & `--accent-rgb`)**: Electric Blue (`#0066FF` / `0, 102, 255` default).
- **Grid Lines (`--grid-line`)**: Transparent white overlay (`rgba(255, 255, 255, 0.04)`).

### 1.2 Layout & Structural Tokens
- **Borders Radius (`--radius`)**: `8px` default (configurable via Settings console).
- **Layout Alignment Grid (`.grid-bg`)**: Fixed viewport overlay with a 4-column repeating layout grid (`grid-template-columns: repeat(4, 1fr)`) and `8%` padding.
- **Micro-Animations (`--transition-smooth`)**: Custom cubic-bezier easing curve (`cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 2. Reusable Visual Components

### 2.1 Buttons
- **Hero CTA (`.hero-cta`)**: Outlined text combined with custom vector arrows that transition color parameters on hover.
- **Form Submission Trigger (`.form-submit-btn`)**: Rounded circular button (`130px` square) featuring scaling background bubbles.

### 2.2 Form Input Fields (`.form-group`)
- **Text & Textarea Fields (`.form-input`)**: Borderless text fields with a single bottom line. Text labels transition and scale when inputs gain focus.

### 2.3 Tables & Cards
- **Tables Layout**: Minimalist data displays featuring horizontal dividers (`border-b border-[#111116]`), monospace headers, and hover animations.
- **Code Editor Blocks (`.code-display`)**: Replicates desktop code editors, complete with mock red/yellow/green system dots, syntax highlighting, and custom file labels.

---

## 3. Design System Gaps

- **Missing Components**:
  - **Select Dropdowns**: Custom select elements are not defined, forcing forms to use standard HTML select layouts.
  - **Dialogs & Drawers**: CMS views use simple browser alerts (`confirm()`) instead of custom accessible modals or drawers.
  - **Alert Banner System**: Alerts are styled individually in components rather than using a unified design class.
- **Duplicate Elements**: None. The design system is highly consolidated inside `globals.css` with minimal utility override code.
