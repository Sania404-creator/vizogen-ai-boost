# CRM Page Transition Loading Indicator

## Goal
Whenever a user navigates between pages inside the CRM, show a centered Vizogen logo loading indicator so the page transition feels intentional and the user knows the app is working.

## What we'll build

1. **New component: `src/components/crm/page-loading-overlay.tsx`**
   - Watches TanStack Router navigation state via `useRouterState({ select: (s) => s.isLoading })`.
   - Renders a full-screen or in-layout overlay centered on the screen.
   - Shows the Vizogen mark (`VizogenMark`) with a gentle pulse/spin animation.
   - Includes a small "Loading..." label beneath the logo.
   - Debounces visibility slightly (e.g. 120–150 ms) so fast navigations don't flicker.

2. **Integrate into CRM shell**
   - Import and render the overlay inside `src/components/crm/shell.tsx` so it applies to every CRM page that uses the shell.
   - Keep the overlay above page content (`z-50`) but below the sidebar/header (`z-20`) so it appears inside the main viewport without covering the global navigation.

3. **Styling**
   - Backdrop: subtle `bg-background/70` with `backdrop-blur-sm`.
   - Logo: 48–64 px mark with a CSS keyframe pulse (scale + opacity).
   - No hardcoded colors; use design tokens.

4. **Verify**
   - Typecheck passes.
   - Build passes.
   - Confirm the overlay appears on simulated slow navigation between CRM pages.
