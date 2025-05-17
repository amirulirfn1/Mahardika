# Mahardika Web Portal

[![CI/CD](https://github.com/amirulirfn1/Mahardika/actions/workflows/firebase-hosting-merge.yml/badge.svg?branch=main)](https://github.com/amirulirfn1/Mahardika/actions/workflows/firebase-hosting-merge.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

A modern web portal built with React, Firebase, and Material-UI.

## Project Structure

```
Mahardika/
├── .github/                  # GitHub workflows and templates
│   └── workflows/            # CI/CD workflows
├── react-pwa/                # React application
│   ├── public/               # Static files
│   └── src/                  # Source code
└── README.md                 # This file
```

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 8.x or later
- Firebase CLI (for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amirulirfn1/Mahardika.git
   cd Mahardika
   ```

2. Install dependencies:
   ```bash
   cd react-pwa
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `react-pwa` directory with the following variables:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### Development

1. Start the development server:
   ```bash
   npm start
   ```

2. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Testing

Run the test suite:
```bash
npm test
```

### Building for Production

```bash
npm run build
```

## Deployment

This project is set up for automatic deployment to Firebase Hosting when changes are pushed to the `main` branch.

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy --only hosting
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Material-UI](https://mui.com/)
