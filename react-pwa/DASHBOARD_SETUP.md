# Dashboard Setup Instructions

This guide will help you set up the dashboard for the Mahardika Healthcare Management System.

## Prerequisites

1. Node.js (v14 or later)
2. npm (v6 or later) or yarn
3. NiceAdmin template files

## Setup Steps

### 1. Copy Template Files

The dashboard is built using the NiceAdmin template. You'll need to copy the necessary files from the template to the project.

1. Locate your NiceAdmin template directory on your computer
2. Run the following command from the project root:

   ```bash
   node scripts/copy-template.js "path/to/your/niceadmin/template"
   ```

   Or on Windows, you can double-click the `scripts/copy-template.bat` file and follow the prompts.

3. The script will copy all necessary files to `public/assets/dashboard/`

### 2. Start the Development Server

```bash
npm start
```

Or if you're using yarn:

```bash
yarn start
```

This will start the development server at http://localhost:3000

### 3. Access the Dashboard

Navigate to http://localhost:3000/dashboard to access the admin dashboard.

## Troubleshooting

### If you see "Unexpected token <" errors

This usually means that some JavaScript files are not being loaded correctly. Make sure:

1. The template files were copied correctly to `public/assets/dashboard/`
2. All required vendor files are present in `public/assets/dashboard/vendor/`
3. The browser's developer console doesn't show any 404 errors for missing files

### If the dashboard layout looks broken

1. Make sure all CSS files were copied correctly
2. Check the browser's developer console for any CSS-related errors
3. Ensure that the template's main CSS file is being loaded

## Deployment

When building for production, the dashboard assets will be included in the build output. The build process will handle optimizing and bundling all the necessary files.

```bash
npm run build
```

## Customization

To customize the dashboard's appearance:

1. Edit the CSS files in `public/assets/dashboard/css/`
2. For theme colors, modify the SCSS variables in the template's SCSS files
3. To add new pages or modify the layout, update the React components in `src/ui/dashboard/`

## License

The NiceAdmin template is licensed under the [BootstrapMade License](https://bootstrapmade.com/license/). Please ensure you comply with the license terms when using this template in your project.
