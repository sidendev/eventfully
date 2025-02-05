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
- Dark mode support
- Accessible components with ARIA labels
- Loading states and error handling

## Tech Stack

### Core
- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Supabase](https://supabase.com/) - Backend and Authentication
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components

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

### Test Account Credentials

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

4. Run the development server:
   ```bash
   npm run dev