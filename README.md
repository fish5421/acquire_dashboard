## Running React on Replit

[React](https://reactjs.org/) is a popular JavaScript library for building user interfaces.

[Vite](https://vitejs.dev/) is a blazing fast frontend build tool that includes features like Hot Module Reloading (HMR), optimized builds, and TypeScript support out of the box.

Using the two in conjunction is one of the fastest ways to build a web app.

### Getting Started
- Hit run
- Edit [App.jsx](#src/App.jsx) and watch it live update!

By default, Replit runs the `dev` script, but you can configure it by changing the `run` field in the [configuration file](#.replit). Here are the vite docs for [serving production websites](https://vitejs.dev/guide/build.html)

### Typescript

Just rename any file from `.jsx` to `.tsx`. You can also try our [TypeScript Template](https://replit.com/@replit/React-TypeScript)

## New Features and Improvements

### Running Tests

We've added Jest and React Testing Library for unit testing. To run the tests:

1. In the terminal, run `npm test` to run all tests once.
2. To run tests in watch mode (tests re-run on file changes), use `npm run test:watch`.

### Error Handling Improvements

We've implemented a robust error handling system:

1. An ErrorBoundary component has been added to catch and display any unhandled errors in the React component tree.
2. The Dashboard component now includes more comprehensive error handling and logging.

### Logging System

A new logging system has been implemented:

1. The `errorLogger.js` file in the `src/lib` directory provides a centralized way to log errors.
2. In development, errors are logged to the console.
3. In production, the logging system is prepared to integrate with external error tracking services.

To use the logging system in your components:

```javascript
import logError from '@/lib/errorLogger';

// ... in your component
try {
  // Some operation that might throw an error
} catch (error) {
  logError(error, { component: 'YourComponentName', additionalInfo: 'Any relevant info' });
}
```

These improvements enhance the application's robustness and make it easier to diagnose and fix issues in both development and production environments.# acquire_dashboard
