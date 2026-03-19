

## Plan: Add Edit & Delete Buttons to Event Cards

### What Changes

1. **EventCard.tsx** — Add an edit button (pencil icon) next to the existing delete button in the top-right corner. Both show on hover. Add an `onEdit` callback prop.

2. **CreateEventDialog.tsx** — Refactor to support both "create" and "edit" modes. Accept an optional `editEvent` prop that pre-fills all form fields. Change the submit button text and dialog title based on mode.

3. **Index.tsx** — Add state for the event being edited. Wire up `onEdit` from EventCard to open the dialog in edit mode. On submit in edit mode, call `store.updateEvent` instead of `store.addEvent`.

4. **WeekView.tsx & DayView.tsx** — Pass the new `onEdit` callback through to EventCard components.

### Technical Details

- `EventCard` gets a new prop: `onEdit?: (event: ScheduleEvent) => void`
- Both edit and delete buttons render in a small `flex gap-1` container at `top-2 right-2`, visible on hover
- `CreateEventDialog` gets optional `editEvent?: ScheduleEvent` prop; when set, fields initialize from it, title becomes "Edit Entry", button becomes "Save Changes"
- `useEffect` in the dialog resets form fields when `editEvent` changes or dialog opens

