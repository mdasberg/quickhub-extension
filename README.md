# QuickHub - Brave Browser Extension

A beautiful browser extension for organizing your links in customizable groups on your new tab page, with integrated search and usage statistics.

## Features

- 🔍 **Integrated Search** - Search the web directly from your new tab
- 📊 **Usage Statistics** - Track sites visited today, total links, and groups
- 🖼️ **Auto-rotating Backgrounds** - Beautiful daily photos or upload your own
- 🔄 **Cross-device Sync** - Sync your links across all Brave browsers (when logged in)
- 💾 **Backup & Restore** - Export/import your configuration as JSON
- 📁 **Organized Groups** - Create custom groups to categorize your links
- 🎯 **Drag & Drop** - Reorder both groups and links within groups
- 🎨 **Beautiful Design** - Refined dark theme with smooth animations
- ⚡ **Fast Access** - All your important links on your new tab page
- 🎯 **Simple Interface** - Clean, intuitive UI for managing links

## Installation

### Load Unpacked Extension (Development)

1. Open Brave browser
2. Navigate to `brave://extensions/`
3. Enable **Developer mode** (toggle in the top right corner)
4. Click **Load unpacked**
5. Select the `quickhub-extension` folder
6. The extension is now installed!

### Using the Extension

The extension will automatically replace your new tab page. Open a new tab to see it in action.

## Usage

### Web Search

Simply type your search query in the search bar at the top and press **Enter** to search the web using Google.

### Statistics

The stats appear in the bottom-right corner (similar to the default new tab), displaying:
- **Sites Visited** - Number of links you've clicked today
- **Links** - Total number of links across all groups
- **Groups** - Total number of groups you've created

### Creating Groups

1. Click the **"New Group"** button in the top right
2. Enter a name for your group
3. Click **Save**

### Reordering Groups

1. Hover over a group to see the drag handle (⋮⋮)
2. Click and drag the group to reorder it
3. Drop it in the desired position

### Reordering Links Within a Group

1. Hover over a link to see the drag handle (⋮⋮) on the left
2. Click and drag the link to reorder it within the group
3. Drop it in the desired position
4. Links can only be moved within their own group

### Setting a Background

1. Click the **Settings** button (⚙️) in the top right
2. **Auto-rotating backgrounds**: 
   - Toggle on to get beautiful high-quality photos that change daily
   - Click **"Get New Background"** to instantly load a different random image
   - Each day automatically loads a fresh image
3. **Custom image**: Toggle off auto-backgrounds, then click **Upload Image** to select your own
4. Click **Remove** to restore the default background

**Note:** Custom images are limited to 5MB. Auto-backgrounds change daily and are cached locally.

### Syncing Across Devices

1. Click the **Settings** button (⚙️)
2. Toggle **"Sync across devices"** on
3. Make sure you're logged into Brave on all your devices
4. Your links will automatically sync everywhere!

**Note:** Brave's sync has storage limits. If you have many groups, consider using Export/Import instead.

### Backup and Restore

**To backup your data:**
1. Click the **Settings** button (⚙️)
2. Click **Export Data**
3. Save the JSON file to a safe location

**To restore from backup:**
1. Click the **Settings** button (⚙️)
2. Click **Import Data**
3. Select your backup JSON file
4. Confirm the import

**Tip:** Export your data regularly as a backup, especially before making major changes!

### Adding Links

1. Hover over a group to reveal the action buttons
2. Click the **"+"** button (or click "Add Link" at the bottom of the group)
3. Enter:
   - **Link title** - A friendly name for your link
   - **Link URL** - The full URL (e.g., https://example.com)
4. Click **Save**

### Managing Groups

- **Edit Group Name** - Click the pencil icon when hovering over a group
- **Delete Group** - Click the trash icon when hovering over a group
- **Delete Link** - Hover over a link and click the X button

### Keyboard Shortcuts

- **Enter** - Save when in modal dialogs or perform search
- **Escape** - Close modal dialogs

## Customization

You can customize the appearance by editing `styles.css`:

### Color Scheme

The extension uses CSS variables for easy theming. Edit these in `styles.css`:

```css
:root {
  --bg-primary: #0a0e14;      /* Main background */
  --bg-secondary: #141920;    /* Secondary background */
  --bg-tertiary: #1c2229;     /* Card backgrounds */
  --text-primary: #e6e9ef;    /* Primary text */
  --text-secondary: #9da3b0;  /* Secondary text */
  --accent: #f0c674;          /* Accent color */
  --accent-secondary: #6eb9d4; /* Secondary accent */
  --border: #2a3039;          /* Border color */
}
```

### Fonts

The extension uses:
- **Crimson Pro** - For headings (serif)
- **DM Sans** - For body text (sans-serif)

You can change these by editing the Google Fonts import in `newtab.html`.

## Development

### File Structure

```
quickhub-extension/
├── manifest.json       # Extension configuration
├── newtab.html        # New tab page HTML
├── styles.css         # Styling and animations
├── script.js          # Functionality and storage
├── icon16.png         # 16x16 icon
├── icon48.png         # 48x48 icon
├── icon128.png        # 128x128 icon
└── README.md          # This file
```

### Storage

Data can be stored locally or synced across devices using Chrome's storage APIs:

**Local Storage (`chrome.storage.local`):**
```javascript
{
  linkGroups: [...],           // Your groups and links
  dailyVisits: {...},          // Daily visit statistics
  backgroundImage: "...",      // Custom background (base64)
  unsplashBackground: "...",   // Cached daily background
  unsplashDate: "...",        // Last fetch date
  autoBackground: true/false,  // Auto-background setting
  useSync: true/false         // Sync preference
}
```

**Sync Storage (`chrome.storage.sync`):**
```javascript
{
  linkGroups: [...]  // Synced when "Sync across devices" is enabled
}
```

## Privacy

This extension respects your privacy:
- ✅ All data stored locally or in your Brave sync (end-to-end encrypted)
- ✅ No analytics or tracking
- ✅ No data sent to external servers (except fetching daily backgrounds when enabled)
- ✅ Open source - you can verify the code
- ✅ Minimal permissions required

**Permissions:**
- `storage` - To save your link groups and settings

**Note:** When using auto-backgrounds, one image is fetched daily from Picsum Photos. No personal data is sent or collected.

## Browser Compatibility

This extension is built for Chromium-based browsers using Manifest V3:
- ✅ Brave
- ✅ Chrome
- ✅ Edge
- ✅ Opera

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

- 🐛 Found a bug? [Open an issue](../../issues)
- 💡 Have a feature idea? [Open an issue](../../issues)
- 🔧 Want to contribute code? [Submit a pull request](../../pulls)

§**Automated Releases:** This repository uses GitHub Actions to automatically create releases. See [.github/RELEASE_GUIDE.md](.github/RELEASE_GUIDE.md) for details.

## License

MIT License - See [LICENSE](LICENSE) for full details.

**Copyright (c) 2025 Mischa Dasberg**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software to use, modify, and distribute it. This software is provided "as is", without warranty of any kind.

## Support

If you find this extension helpful, consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🔧 Contributing code

## Changelog

### Version 1.0.0
- Initial release
- QuickHub groups with drag & drop reordering
- Auto-rotating backgrounds with manual refresh
- Cross-device sync via browser sync
- Export/Import functionality
- Integrated web search
- Usage statistics
- Custom background upload

---

**Made with ❤️ for productivity enthusiasts**

