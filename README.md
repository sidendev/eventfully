<div align="center">
  <h1>Eventfully</h1>
  <p>A modern event management platform built with Next.js and Supabase</p>
  <img src="public/images/hero-image.png" alt="Eventfully Preview" width="800px" />
</div>

<div align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#testing">Testing</a>
</div>

## Features

🎫 **Event Management**
- Create and manage events with rich details
- Upload event images with UploadThing integration
- Set event capacity and ticket types
- Track bookings and attendees

👤 **User Roles**
- Public viewing of events without authentication
- User registration and authentication with Supabase
- Organiser profiles with enhanced capabilities
- Booking management for attendees

📅 **Calendar Integration**
- Add events to Google Calendar
- Automatic timezone handling
- Event reminders and updates

🎨 **Modern UI/UX**
- Responsive design for all devices
- Light and Dark mode support
- Accessible components with ARIA labels
- Loading states and error handling

## Tech Stack

### Core
- [Next.js 15](https://nextjs.org/) - React framework with App Router and Server Actions
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Supabase](https://supabase.com/) - Backend and Authentication
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Vercel](https://vercel.com/) - Deployment
- [UploadThing](https://uploadthing.com/) - Media File Uploads adn Storage

### Key Packages

📦 **Core Dependencies**
- `@supabase/ssr` - Supabase Server-Side Rendering utilities
- `@supabase/supabase-js` - Supabase JavaScript client
- `@uploadthing/react` - File upload integration
- `next-themes` - Dark mode support
- `sonner` - Toast notifications
- `add-to-calendar-button-react` - Calendar integration

🎨 **UI and Styling**
- `@radix-ui/react-*` - Headless UI components
- `class-variance-authority` - Dynamic class composition
- `tailwind-merge` - Smart class merging
- `lucide-react` - Icon library
- `tailwindcss-animate` - Animation utilities

## Getting Started

### Test Account Credentials:

**Regular User:**
Email: test@example.com
Password: test123456

**Event Organiser:**
Email: organiser@example.com
Password: test123456

### Local Development Setup

1. Clone the repository:
  ```bash
  git clone https://github.com/sidendev/eventfully.git
  cd eventfully
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

3. Set up your environment variables:
  ```bash
  cp .env.example .env
  ```

4. Update `.env.local` with your credentials:  
  ```bash
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  UPLOADTHING_SECRET=your_uploadthing_secret
  UPLOADTHING_APP_ID=your_uploadthing_app_id
  ```

### Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Open the SQL editor panel on your Supabase project.

3. Copy the contents of database/schema.sql into your Supabase SQL editor.

4. Enable Row Level Security (RLS) policies as defined in the schema if they have not already been enabled.

## Customization

### Styling with shadcn/ui

#### Theme Customization
You can modify the theme in `app/globals.css`:
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    /* ... other variables ... */
  }
}
```

#### Changing Fonts
1. Import your preferred font from `next/font/google` in `app/layout.tsx`:
```typescript
import { Inter, Roboto, Open_Sans } from 'next/font/google';

// Example with Inter font
const inter = Inter({ subsets: ['latin'] });

// Or use a different font
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});
```

2. Apply the font to your application:
```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

3. For local fonts, place them in the `public/fonts` directory and use `next/font/local`.

## Testing

🔍 **Accessibility Testing**


📱 **Device Testing**


🚦 **Performance Testing**

## Deployment with Vercel

1. Push your code to GitHub on the main branch.
2. Set up a new project on Vercel.
3. Connect your GitHub repository to Vercel in the Vercel dashboard.
4. Add your supabase and uploadthing environment variables in Vercel dashboard.
5. Deploy with Vercel.

## Media Sources and Credits

- UI Components: [shadcn/ui](https://ui.shadcn.com)
- Icons: [Lucide Icons](https://lucide.dev)
- Website Images: [Unsplash](https://unsplash.com)
- Favicon Logo: [Canva](https://canva.com)

## Future Roadmap

🚀 **Planned Features**

1. **Enhanced Event Management**
   - Multiple ticket tiers
   - Event series management

2. **Payment Integration**
   - Stripe payment processing
   - Refund handling
   - Payment analytics

3. **Social Features**
   - Event sharing on social media
   - Organiser networking, allowing other users to organise same events
   - Event comments and ratings
   - Social media account login (Google, Twitter, Facebook, etc.)

4. **Advanced Organiser Analytics**
   - Attendance tracking
   - Revenue reporting

5. **Mobile Experience**
   - Mobile app version with Expo / React Native
   - Push notifications
   - QR code check-in

6. **Email Integration**
   - Send email notifications to attendees
   - QR code tickets via email

<!-- ## License -->

