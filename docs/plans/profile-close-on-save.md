# Plan — Close profile panel on Save

> Status: **done** (implemented on `cursor/rovo-toolkit-ia-de27`)

Small UX fix on the Rovo Catalog header profile form.

## Problem

After clicking **Save profile**, values persist in `localStorage` and the status shows “Saved”, but `#profile-panel` stays open. Expected: save, then collapse the panel (same close path as the Profile toggle).

## Scope

In scope:

- Close `#profile-panel` on successful Save
- Sync Profile button `aria-expanded="false"`
- Clear the “Saved” status when the panel is reopened (so stale status doesn’t linger)

Out of scope (separate follow-ups if wanted):

- Close panel on Clear (keep open so emptied fields stay visible)
- Pager auto-scroll / disabled ← clicks
- Logo / hero wordmark redesign

## Implementation

**File:** [`site/assets/js/profile.js`](../../site/assets/js/profile.js)

1. Extract a small `closePanel()` helper (set `hidden` on panel, `aria-expanded="false"` on toggle) — reuse the toggle’s close path.
2. In the form `submit` handler, after `writeProfile` + dispatch `rovo-profile-updated`, call `closePanel()`.
3. When opening the panel via the Profile toggle, call `setStatus("")` so a previous “Saved” / “Cleared” message doesn’t reappear.

No template or CSS changes required.

## Verify

```bash
npm run build
python3 -m http.server 8765 --directory site/dist
```

1. Open Profile → fill PROJECT / YOUR-USER → **Save profile**
2. Panel collapses; Profile button `aria-expanded` is `false`
3. Reopen Profile → fields still filled from `localStorage`; status is empty
4. **Clear** still clears fields and leaves the panel open

## Ship

- Commit on `cursor/rovo-toolkit-ia-de27`
- Push and update PR #18
