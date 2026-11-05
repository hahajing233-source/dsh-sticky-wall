# Screenshots

Storefront pictures for the plugin catalog. The catalog reads them from
**`screenshots.json` in the repository root** (next to `package.json`), 1–8 paths
relative to that file. Images are what people judge before installing, so this is
worth doing properly.

| File | What it shows | Why |
| --- | --- | --- |
| `wall.png` | The panel with a wall of notes, mixed stocks, at least one taped and one pinned note | This is the first thing anyone sees; it has to show the range in one frame |
| `variety.png` | Four or five notes side by side, two tapes visible | Shows the paper stocks read differently at a glance |
| `note.png` | One note, hovered, so its footer shows the four dropdowns and the bin | Shows the per-note controls without a wall of text |

Still worth adding when you get a chance: **`appearance.png`** — the appearance panel
open (paper / fastening / font / size). Drop it in this folder, append it to
`screenshots.json`, and it appears in the carousel; no pull request needed.

## How to take them

- **Window width:** wide enough that the wall has two or three columns. A narrow
  window makes it look like a list.
- **Dark theme first.** That is the harness default and the harder case to get
  right; if it reads well in dark it reads well in light.
- **Hover off the wall** for `wall.png` — the note controls fade in on hover and
  would clutter the shot. Hover *on a note* for `note.png`, deliberately.
- **No personal content.** Use placeholder text ("周五之前把方案定下来"), not
  anything you actually need to keep.
- Crop out the OS chrome; only the harness panel should be in frame.

## Turn it on once the files exist

Create `screenshots.json` in the repository root — the paths are relative to *that*
file, and a typo renders as a broken image, so add it only after the PNGs are
committed:

```json
[
  "docs/screenshots/wall.png",
  "docs/screenshots/appearance.png",
  "docs/screenshots/note.png"
]
```

`{ "screenshots": [...] }` is accepted too. Declaring them is optional: without the
file, storefronts fall back to pulling images out of the README — which is why
`README.md` also carries a commented-out `## Screenshots` section pointing at the
same three files.

## Rules that matter for the catalog

- 1–8 images; **GitHub-hosted only** if you use absolute URLs (`raw.githubusercontent.com`,
  `user-images.githubusercontent.com`, `camo.githubusercontent.com`, GitHub attachments).
  Third-party image hosts are rejected for privacy reasons.
- Relative paths must stay inside the repository: no leading `/`, no `..`.
- PNG, under ~400 KB each.
- Commit them — `.gitignore` does not exclude this folder, and they are not part of
  the npm package (`files` whitelists only the runtime files).
- Updating screenshots later needs no pull request to the catalog: push to this
  repository and the next build picks it up.
