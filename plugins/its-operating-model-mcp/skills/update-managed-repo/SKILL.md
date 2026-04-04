---
name: update-managed-repo
description: Refresh the plugin-managed ITS Operating Model clone after confirming that the user wants to apply available upstream updates.
---

# Update Managed Repo

1. Run `bun run check-updates` from the plugin root.
2. If no updates are available, tell the user the managed repository is already current.
3. If updates are available, ask whether to apply them now.
4. Only after confirmation, run `bun run update-repo`.
5. Report the new managed revision and remind the user that authoritative content may have changed.
