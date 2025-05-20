# Mahardika Healthcare Management System

A modern healthcare management system built with React and Firebase.

## Features

- 🔐 Authentication with Firebase
- ⚡ Progressive Web App (PWA) support
- 🎨 Styled with Tailwind CSS and NiceAdmin template
- 📊 Interactive dashboard with charts and data tables
- 🚀 Automated deployments with GitHub Actions

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/amirulirfn1/Mahardika.git
cd Mahardika-2/react-pwa
```

### 2. Configure Environment Variables

Create a `.env` file in the `react-pwa` directory with your Firebase configuration:

```
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID

# Application Environment
NODE_ENV=development
REACT_APP_ENV=development
```

Replace the placeholder values with your actual Firebase configuration. You can obtain these from your Firebase project settings.

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm start
```

The application should now be running on [http://localhost:3000](http://localhost:3000).

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production to the `build` folder
- `npm test`: Launches the test runner
- `npm run deploy`: Deploys the application to Firebase Hosting

## Project Structure

```
react-pwa/
│
├── public/              # Static files
│   ├── assets/          # CSS, images, and other assets
│   ├── env-config.js    # Environment variables for production builds
│   └── index.html       # Main HTML file
│
├── scripts/             # Build and utility scripts
│
├── src/                 # Source code
│   ├── assets/          # Project-specific assets
│   ├── components/      # Reusable components
│   ├── firebase/        # Firebase configuration and services
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Layout components
│   ├── lib/             # Utility libraries
│   └── ui/              # UI components organized by feature
│       ├── dashboard/   # Dashboard-related components
│       ├── portal/      # Portal-related components
│       └── shared/      # Shared UI components
│
└── .env                 # Environment variables for development
```

## Authentication

The application uses Firebase Authentication with the following features:

- Email/Password authentication
- Google sign-in
- Role-based access control

## Firebase Configuration

This project uses Firebase for:

- Authentication
- Cloud Firestore
- Storage
- Analytics

## Troubleshooting

If you encounter issues with Firebase configuration:

1. Make sure your `.env` file has all required Firebase variables
2. Check if the Firebase project is correctly set up with authentication methods enabled
3. Verify that your Firebase project has appropriate Firestore rules

## License

MIT
