# Accessibility Compliance Audit

## Overview
This document evaluates the portfolio's accessibility (a11y) features against WCAG 2.1 AA requirements.

## Accessibility Review

### 1. Color Contrast
- Text elements (`#fafafa` and `#a0a0a5`) checked against the `#030303` background. Contrast ratio exceeds **7:1**, passing WCAG AAA standards for readability.

### 2. Tab Keyboard Navigation
- All interactive links, buttons, and inputs feature clear focus states, allowing users to navigate the entire site using only the keyboard.

### 3. Screen Readers Compatibility
- Structural elements use semantic HTML5 tags (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Custom inputs, icons, and buttons include descriptive `aria-label` tags.

### 4. Reduced Motion Support
- CSS styles integrate standard transition classes, disabling animations for users with motion sensitivity settings enabled.
