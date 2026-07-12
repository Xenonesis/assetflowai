# AssetFlow AI Design System

This design system is based on the UI/UX Pro Max skill, focusing on a minimal and professional aesthetic suitable for an enterprise SaaS dashboard.

## Core Principles

- **Clean Minimalism**: Eliminate unnecessary borders, backgrounds, and shadows. Focus on content.
- **Professional Accents**: Use subtle color accents to guide the user's attention.
- **Micro-interactions**: Use fast, subtle animations to provide feedback and improve perceived performance.
- **High Contrast**: Ensure text is readable and interactive elements are clearly distinguishable.

## Semantic Tokens

### Colors

*   **Background**: `--background` (`#FAFAFA` light, `#0A0A0B` dark) - Main page background.
*   **Surface**: `--surface` (`#FFFFFF` light, `#111113` dark) - Primary component background (cards, panels).
*   **Surface Elevated**: `--surface-elevated` (`#FFFFFF` light, `#18181B` dark) - Elevated components (modals, dropdowns).
*   **Border**: `--border` (`#E4E4E7` light, `#27272A` dark) - Standard borders and dividers.
*   **Border Subtle**: `--border-subtle` (`#F0F0F2` light, `#1C1C1F` dark) - Subtle separators.
*   **Text Primary**: `--text-primary` (`#09090B` light, `#FAFAFA` dark) - Headlines, primary body text.
*   **Text Secondary**: `--text-secondary` (`#71717A` light, `#A1A1AA` dark) - Secondary text, labels, captions.
*   **Text Muted**: `--text-muted` (`#A1A1AA` light, `#52525B` dark) - Placeholders, disabled text.
*   **Primary**: `--primary` (`#2563EB` light, `#3B82F6` dark) - Primary CTAs, active states, key links.
*   **Primary Hover**: `--primary-hover` (`#1D4ED8` light, `#60A5FA` dark) - Hover state for primary actions.
*   **Success**: `--success` (`#16A34A` light, `#22C55E` dark) - Positive feedback, success states.
*   **Warning**: `--warning` (`#CA8A04` light, `#EAB308` dark) - Cautionary feedback, warnings.
*   **Danger**: `--danger` (`#DC2626` light, `#EF4444` dark) - Destructive actions, errors.
*   **Info**: `--info` (`#0284C7` light, `#38BDF8` dark) - Informational messages.

### Typography

*   **Font Family**: Geist Sans (sans-serif), Geist Mono (monospace).
*   **Display**: 36px, Weight 600, Line Height 1.2
*   **H1**: 30px, Weight 600, Line Height 1.25
*   **H2**: 24px, Weight 600, Line Height 1.3
*   **H3**: 20px, Weight 500, Line Height 1.35
*   **Body**: 14px, Weight 400, Line Height 1.6
*   **Small**: 13px, Weight 400, Line Height 1.5
*   **Caption**: 12px, Weight 400, Line Height 1.5
*   **Code**: 13px, Weight 400, Line Height 1.5

### Spacing & Sizing

*   **Base Spacing**: 4px scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96).
*   **Border Radius**:
    *   `6px` for inputs, standard buttons, and small cards.
    *   `8px` for larger cards, modals, and panels.
    *   `9999px` (full) for pills, badges, and avatars.
*   **Icon Sizes**: 16px (sm), 20px (md), 24px (lg). Use Lucide React (no emojis).

### Shadows & Elevation

*   **Minimal Shadow**: `0 1px 2px rgba(0,0,0,0.05)` - Used sparingly for cards and inputs to provide subtle depth without clutter.
*   **Elevated Shadow**: `0 10px 15px -3px rgba(0,0,0,0.1)` - Used for modals, dropdowns, and popovers to separate them from the background.

### Animation

*   **Micro-interactions**: Duration 150-200ms, Easing `ease-out`. Used for button hovers, state changes.
*   **Page/Component Transitions**: Duration 200-300ms, Easing `ease-in-out`. Used for entering/exiting elements (modals, route changes).
*   **Exit Animations**: Should be slightly faster than enter animations (approx. 60% duration).
*   **Accessibility**: Always respect `prefers-reduced-motion`.

## Interaction Patterns

*   **Focus States**: Provide visible focus rings on all interactive elements (e.g., 2px offset ring using the primary color) for keyboard navigation.
*   **Loading States**: Use subtle spinners or skeleton screens for async operations. Disable buttons during submission.
*   **Error Feedback**: Display clear, contextual error messages near the relevant input field. Avoid placing errors only at the top of the form.
*   **Empty States**: Provide helpful messaging and a clear CTA when no content is available.

## Anti-Patterns

*   **Avoid overusing borders**: Use spacing and subtle background color differences to separate sections where possible.
*   **Avoid heavy shadows**: Rely on elevation and subtle depth instead of thick, dark shadows.
*   **No emojis as icons**: Stick consistently to the Lucide icon set.
*   **Avoid generic colors for states**: Use defined semantic colors (e.g., `--danger`, `--success`) to convey meaning.
