# UNBC Events Calendar - ReactPress Version

This is a ReactPress-compatible version of the UNBC Events Calendar that can be easily integrated into WordPress using the ReactPress plugin.

## Features

✅ **Full React Calendar**: All features from your original calendar
✅ **ReactPress Compatible**: Works seamlessly with ReactPress plugin
✅ **WordPress Integration**: Can optionally fetch events from WordPress REST API
✅ **Vite Build System**: Fast development with HMR
✅ **Tailwind CSS**: Modern styling with dark mode
✅ **TypeScript Ready**: Full type support

## Installation with ReactPress

### 1. Install ReactPress Plugin

1. In WordPress admin, go to Plugins → Add New
2. Search for "ReactPress"
3. Install and activate the plugin

### 2. Add Your Calendar App

1. Copy this folder to:
   ```
   /wp-content/reactpress/apps/unbc-calendar/
   ```

2. Install dependencies:
   ```bash
   cd /wp-content/reactpress/apps/unbc-calendar
   npm install
   ```

3. Go to ReactPress admin page in WordPress
4. You should see "unbc-calendar" in the apps list
5. Select a target page or create a new one
6. Click "Update Dev-Environment"

### 3. Development

```bash
npm run dev
```

Visit http://localhost:5173 to see your calendar with WordPress theme.

### 4. Build for Production

```bash
npm run build
```

The calendar will now be visible on your WordPress page.

## Using WordPress Data

To use events from WordPress instead of demo data:

1. Edit `src/App.jsx`:
   ```jsx
   import UNBCCalendarWordPress from './components/unbc-calendar-wordpress'
   
   function App() {
     return (
       <div className="container mx-auto px-4">
         <UNBCCalendarWordPress />
       </div>
     )
   }
   ```

2. Edit `src/components/unbc-calendar-wordpress.jsx`:
   ```jsx
   const USE_WORDPRESS_DATA = true; // Enable WordPress data
   ```

3. Make sure you have events custom post type with these meta fields:
   - `event_date`
   - `event_time`
   - `event_end_date`
   - `event_location`
   - `event_category`
   - `event_organization`
   - `event_registration_url`

## Customization

### Styling
- Edit `src/index.css` for global styles
- Components use Tailwind CSS classes
- Dark mode is fully supported

### Components
- All components are in `src/components/`
- Calendar views are in `src/components/calendar-views/`
- UI components use Radix UI primitives

## Deployment

1. Build the app:
   ```bash
   npm run build
   ```

2. On your production server:
   - Install ReactPress
   - Create the same app folder structure
   - Upload only the `build` folder
   - Configure the same page in ReactPress admin

## Benefits over Custom Plugin

- ✅ No WordPress plugin development needed
- ✅ Standard React development workflow
- ✅ Automatic WordPress theme integration
- ✅ Easy deployment process
- ✅ Full control over React app
- ✅ Works with any WordPress theme