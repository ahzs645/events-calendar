# UNBC Campus Events Calendar

A standalone React/Next.js application for displaying UNBC campus events with multiple view modes and filtering capabilities.

## Features

- **Multiple Views**: Month, Week, Day, and List views
- **Event Filtering**: Filter by category, organization, or search terms
- **Event Statistics**: Quick overview of total events, weekly events, free events, and events requiring registration
- **Responsive Design**: Works on desktop and mobile devices
- **Category Color Coding**: Visual distinction between different event types

## Event Categories

- **Academic** (Green): Lectures, workshops, study groups
- **Social** (Orange): Parties, mixers, social events
- **Cultural** (Purple): Cultural celebrations, diversity events
- **Sports & Recreation** (Red): Athletic events, outdoor activities
- **Professional** (Teal): Career fairs, networking events
- **Health & Wellness** (Blue): Mental health, fitness, yoga
- **Volunteer** (Yellow): Community service, volunteer opportunities
- **Arts & Creative** (Pink): Art exhibitions, creative workshops

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or extract the calendar directory
2. Install dependencies:

```bash
npm install
# or
yarn install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
unbc-events-calendar/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   ├── ui/              # Basic UI components
│   │   └── unbc-calendar.tsx # Main calendar component
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── styles/
│   │   └── globals.css      # Global styles
│   └── types/
│       └── index.ts         # TypeScript types
├── package.json
└── README.md
```

## Customization

### Adding Events

Events are currently defined in the `unbcEvents` array in `src/components/unbc-calendar.tsx`. To add new events:

```typescript
{
  id: "unique-id",
  title: "Event Title",
  description: "Event description",
  startDate: new Date(year, month, day, hour, minute),
  endDate: new Date(year, month, day, hour, minute),
  variant: "success" | "primary" | "default" | "warning" | "danger"
}
```

Don't forget to add corresponding metadata in the `eventMetadata` object:

```typescript
"unique-id": {
  category: "academic",
  organization: "Organization Name",
  location: "Event Location",
  cost: "Free" | "$X",
  registrationRequired: true | false,
  posterUrl: "optional-image-url"
}
```

### Modifying Categories

To add or modify event categories:

1. Update the `EventCategory` type in `src/types/index.ts`
2. Add color mappings in the component's `categoryColors` objects
3. Update the legend in the main component

### Styling

The application uses Tailwind CSS for styling. Modify styles in:
- `src/styles/globals.css` for global styles
- Component files for component-specific styles
- `tailwind.config.js` for theme customization

## Technologies Used

- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **date-fns** - Date utilities

## Integration with WordPress

This standalone version can be integrated with WordPress by:

1. Creating a WordPress plugin that provides event data via REST API
2. Replacing the static `unbcEvents` array with API calls
3. Adding authentication for event management
4. Creating custom post types for events with the required fields

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is intended for UNBC internal use.