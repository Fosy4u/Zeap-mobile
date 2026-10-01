# TODO — Reusable collapsible vendor home header

## Goal
Extract the vendor dashboard's floating header (pinned app bar + collapsible
greeting/revenue band) into a reusable component, and make the header and hero
section blend together with matching bottom corner radii.

## Steps
- [x] 1. Create reusable header component
      `src/modules/vendor/home/components/vendorHomeHeader_component.tsx`
- [x] 2. Refactor `src/modules/vendor/home/screens/vendorDashboard_screen.tsx`
      to use the new component (remove inline header logic)
- [x] 3. Run TypeScript / lint checks to validate changes
- [x] 4. Give the hero (collapsible band) a bottom radius matching the app
      header's `rounded-b-3xl`, so both blend with the same curve when the
      hero scrolls up to meet the app header

