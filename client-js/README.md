# Doctor Search - Client

This is the client-side application for the Doctor Search platform, which allows users to search for doctors and book appointments.

## Features

- User authentication (login/register)
- Doctor search with filters
- Doctor profiles
- Appointment booking
- Appointment management

## Technologies Used

- React
- React Router
- Axios for API requests
- Tailwind CSS for styling
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the client-js directory
3. Install dependencies:

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

This will start the application on http://localhost:5173

### Building for Production

To build the application for production:

```bash
npm run build
```

## API Connection

The application connects to a backend API running on http://localhost:3000. Make sure the server is running before using the application.

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components
- `/src/context` - React context providers
- `/src/services` - API services
