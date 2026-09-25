# Hospital logos and CRM sales dashboard

## Goal
Add the three supplied hospital brands to the clinic page’s scrolling trust strip, make the movement faster, and turn CRM Reports into a date-filtered sales dashboard.

## Implementation
- Remove the visible backgrounds from the three uploaded logos and add them to the existing clinic-only logo list.
- Increase the logo marquee speed while retaining continuous looping, mobile overflow protection, and reduced-motion support.
- Add an IST date-range input to the sales report using the same presets, custom dates, and URL parameters as Leads.
- Query sales metrics within the selected date range at the database level: accepted-proposal revenue, total leads, closed-won conversion rate, leads by source, and the Doctor-tagged pipeline by CRM stage.
- Present the results in the existing CRM card, chart, and table visual language without changing other CRM screens.

## Verification
- Confirm all three new logos appear in the clinic marquee and the loop moves faster on desktop and mobile.
- Confirm report values and charts update when the date range changes and persist after refresh.
- Check the latest build, browser console, and both target pages for errors.
