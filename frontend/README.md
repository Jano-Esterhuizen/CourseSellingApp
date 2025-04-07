# CourseSelling Frontend

A modern React frontend for the CourseSelling application, built with Vite, Tailwind CSS, and Shadcn UI components.

## Features

- User authentication (login/signup)
- Course browsing
- Admin dashboard with CRUD operations
- Responsive design
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory and add your backend API URL:
```
VITE_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

```
src/
├── api/           # API service functions
├── components/    # Reusable UI components
├── contexts/      # React contexts (Auth, etc.)
├── pages/         # Page components
└── routes/        # Route configurations
```

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Zod
