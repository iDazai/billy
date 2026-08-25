# Billy 0.6.1 installation

This is a complete integration source package, not an overlay.

1. Stop Home Assistant or make a backup of the current integration folder.
2. Replace `/config/custom_components/bill_tracker` with `custom_components/bill_tracker` from this archive.
3. Start/restart Home Assistant.
4. Billy will register/update the Lovelace resource to `/bill_tracker/bill-tracker-card.js?v=0.6.1`.
5. Hard-refresh the browser once if an older frontend asset is still cached.

The existing Billy storage is not removed by replacing the integration directory.
