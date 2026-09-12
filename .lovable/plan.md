# Clinic trusted-logo marquee

## Goal
Add a polished, continuously scrolling “Trusted by” logo section only to `/clinic-marketing-software` using the nine supplied hospital and clinic logos.

## Implementation
- Store the uploaded logos through the project asset system with descriptive filenames.
- Add an optional trusted-logo list to the shared industry page configuration.
- Render a seamless, accessible two-copy logo marquee when that list is present, positioned directly below the clinic page’s opening section.
- Keep every other industry page unchanged.
- Pause motion for visitors who prefer reduced motion and ensure the strip fits mobile screens without horizontal page overflow.

## Verification
- Confirm the clinic page displays all supplied logos and loops smoothly on desktop and mobile.
- Confirm another industry page has no new logo section.
- Check the latest build and browser console for errors.
