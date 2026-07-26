# Future Roadmap & Enhancement Opportunities

## Overview
This roadmap outlines potential features to expand the portfolio as the owner's career grows.

## Enhancement Opportunities

### 1. Multi-Language (Internationalization)
- **Goal**: Support multiple languages (e.g. English, Japanese, German).
- **Implementation**: Set up Next.js `next-intl` dynamic routing and update database tables to support translations.

### 2. Dark/Light Theme Customization
- **Goal**: Allow users to toggle between dark and light modes.
- **Implementation**: Extend [ThemeProvider.tsx](file:///d:/portfolio/src/components/ThemeProvider.tsx) to map dynamic CSS variables for a light theme.

### 3. Analytics Dashboard
- **Goal**: View traffic statistics directly in the Admin CMS.
- **Implementation**: Build a page inside `/admin/analytics` that displays visitor metrics using the Umami or Plausible API.

### 4. Interactive Case Study Playground
- **Goal**: Allow recruiters to test dynamic AI workflows in real-time.
- **Implementation**: Integrate a sandboxed client interface using Vercel AI SDK streams.
