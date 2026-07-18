# Animation & Transition System

## Overview
This document specifies the micro-interaction and motion design guidelines applied to the portfolio page.

## Motion Guidelines

### 1. Zero Cognitive Distraction
- Motion exists to support storytelling, not to look flashy. Transitions use smooth easing keys (`cubic-bezier(0.2, 0.8, 0.2, 1)`) and minimal translate distances (less than `20px`).

### 2. Micro-interactions
- **Links**: Custom underline expansions.
- **Cards**: Hover transitions scaling to `1.01` and lighting borders.
- **Inputs**: Text label shifts when focused.

### 3. Reduced Motion Support
- Integrates the `.reduce-motion` helper class to disable transitions and animations for users with motion sensitivity settings.
