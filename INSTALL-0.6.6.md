# Install Billy 0.6.6

Replace the existing `custom_components/bill_tracker` directory with the one from this archive and restart Home Assistant.

The Lovelace dashboard remains the complete 0.5.2-based UI. Parser management is now available from **Settings → Devices & services → Bill Tracker → Configure → Automatic parsing → Parser management**, which links to the dedicated `/billy-parser` page.

After upgrading, hard-refresh the browser once so Home Assistant loads `billy-parser-manager.js?v=0.6.6`.
