# Project Audit: 15 - Component Audits

This report reviews the imports, exports, functions, hooks, complexity, and risk levels of all shared client components.

## 1. Shared Components Directory Overview

All components are located in [src/components/](file:///d:/portfolio/src/components/).

### 1.1 `Certifications.tsx`
- **Purpose**: Displays technical statistics and credentials using an animated counter.
- **Exports**: `default function Certifications`
- **Imports**: `React`, `useEffect`, `useRef`, `useState`, `useThemeSettings`
- **Functions**:
  - `CounterItem({ target, label, suffix, isFloat })`: Uses an `IntersectionObserver` to trigger a tick counter when the element scrolls into view.
- **Complexity**: Low-Medium (Contains state updates and mathematical increments).
- **Risk**: Low. Bypasses calculations when `reduceMotion` is active.

### 1.2 `CodeComparer.tsx`
- **Purpose**: Explains systems engineering practices by letting users toggle between raw LLM scripts and structured validation pipelines.
- **Exports**: `default function CodeComparer`
- **Imports**: `React`, `useState`
- **Complexity**: Low. Uses basic state triggers to map active tabs to pre-defined JSX templates.
- **Risk**: Low.

### 1.3 `ContactForm.tsx`
- **Purpose**: Interactive client form with custom validation and honeypot protection.
- **Exports**: `default function ContactForm`
- **Imports**: `React`, `useState`, `useRef`, `submitContactForm` Server Action
- **Functions**:
  - `validate(data)`: Validates formatting rules (character minimums, email regex matching).
  - `handleSubmit(e)`: Prevents default actions, checks honeypots, runs validations, dispatches Server Actions, and handles loading animations.
- **Complexity**: Medium. Manages form validation, focus states, and async request states.
- **Risk**: Low-Medium. Enforces schema constraints parallel to server validations.

### 1.4 `LightProbe.tsx`
- **Purpose**: Dynamic cursor-spotlight effect component.
- **Exports**: `default function LightProbe`
- **Imports**: `React`, `useEffect`, `useRef`, `useThemeSettings`
- **Complexity**: Medium (Utilizes linear interpolation for smooth tracking).
- **Risk**: Low. Safely returns `null` if animations are disabled.

### 1.5 `ThemeProvider.tsx`
- **Purpose**: Context provider that maps database configurations to local theme states and CSS properties.
- **Exports**: `default function ThemeProvider`, `useThemeSettings` hook
- **Interfaces**: `ThemeConfig`
- **Complexity**: Low-Medium (Handles side-effects to modify DOM variables on document root).
- **Risk**: Low.

### 1.6 `ThoughtWave.tsx`
- **Purpose**: Renders animated mathematical wave patterns on an HTML5 canvas.
- **Exports**: `default function ThoughtWave`
- **Imports**: `React`, `useEffect`, `useRef`, `useThemeSettings`
- **Complexity**: Medium-High (Requires viewport calculations and canvas rendering loops).
- **Risk**: Low. Automatically detaches event listeners on dismount to prevent memory leaks.

### 1.7 `LenisProvider.tsx`
- **Purpose**: Initializer for smooth-scroll physics.
- **Exports**: `default function LenisProvider`
- **Imports**: `React`, `useEffect`, `Lenis`, `useThemeSettings`
- **Complexity**: Low-Medium (Integrates custom cubic-bezier math for scroll easing).
- **Risk**: Low. Bypassed if `reduceMotion` is enabled.
