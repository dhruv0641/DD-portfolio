# Project Audit: 20 - Accessibility

This report evaluates compliance with WCAG design principles, keyboard navigation, focus state management, and motion reduction guidelines.

## 1. Compliance Audit Details

### 1.1 Keyboard Navigation & Focus Ring Indicators
- **Interaction Elements**: Core links and input fields support standard keyboard navigation using `Tab` key routing.
- **Focus Rings**: Standard browser outline focus rings are enabled on input components. The login view uses focus parameters that override styles on target highlights:
  ```css
  .form-input:focus {
    outline: none;
    border-color: var(--text);
  }
  ```
  While visually clean, using the border color transition as the sole focus indicator can be difficult to see for users with visual impairments.

### 1.2 Form Labels & ARIA Annotations
- **Contact Form Validation**: Form elements inside [src/components/ContactForm.tsx](file:///d:/portfolio/src/components/ContactForm.tsx) feature ARIA properties supporting screen readers:
  - Enforces `aria-invalid={true}` parameters upon validation check failure.
  - Form groups map descriptions to labels using `aria-describedby` links (e.g. `aria-describedby={errors.name ? "name-error" : undefined}`).
  - Confirmation status boxes utilize `role="status"` and `aria-live="polite"` configurations.
  - Error alert panels utilize `role="alert"` and `aria-live="assertive"` specifications.
- **Honeypot Form Fields**: The hidden `website` input field uses `tabIndex={-1}` and `aria-hidden="true"`, preventing screen readers or keyboard navigation from interacting with the honeypot.

---

## 2. Motion Reduction & Visual Variables

- **The `reduceMotion` Constraint**: When enabled, the application injects a global class `.reduce-motion` that overrides animations and smooth scrolling.
- **Image Alt Tags**: Alt attributes are declared on case study displays (e.g. `alt={\`\${project.title} Visual representation\`\}`).
- **Contrast Ratios**: The interface uses a dark gray background (`#090909`) with white text (`#F5F5F5`), which exceeds WCAG AAA contrast ratio standards for text readability.
