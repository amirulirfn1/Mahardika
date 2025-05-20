# Mahardika PWA

A Progressive Web Application built with React, Firebase, and Tailwind CSS.

## Features

- 🔐 Authentication with Firebase
- ⚡ Progressive Web App (PWA) support
- 🎨 Styled with Tailwind CSS and NiceAdmin template
- 📊 Interactive dashboard with charts and data tables
- 🚀 Automated deployments with GitHub Actions

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- NiceAdmin template files (for dashboard)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the dashboard template (see [Dashboard Setup](#dashboard-setup))

4. Start the development server:
   ```bash
   npm start
   ```

## Available Scripts

- `npm start`: Start the development server
- `npm test`: Run tests
- `npm run build`: Build for production
- `npm run eject`: Eject from Create React App

## Authentication

The application uses Firebase Authentication with the following demo accounts:

- **Admin**: admin@example.com / password123
- **User**: user@example.com / password123

## Dashboard Setup

The admin dashboard is built using the NiceAdmin template. Before running the application, you'll need to set up the dashboard template files.

1. Locate your NiceAdmin template directory
2. Run the template copy script:
   ```bash
   node scripts/copy-template.js "path/to/your/niceadmin/template"
   ```
   Or on Windows, double-click `scripts/copy-template.bat` and follow the prompts.

3. The dashboard will be available at `/dashboard` after authentication

For more detailed instructions, see [DASHBOARD_SETUP.md](./DASHBOARD_SETUP.md).

## Deployment

To deploy the application:

1. Make sure all template files are copied (see [Dashboard Setup](#dashboard-setup))
2. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the contents of the `build` directory to your hosting service.

## License

MIT © 2025 Amirul Irfan