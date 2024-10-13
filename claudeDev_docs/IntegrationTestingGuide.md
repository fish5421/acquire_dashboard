# Integration Testing Guide

Integration testing is crucial for ensuring that different components of your application work together as expected. This guide will walk you through the process of setting up and writing integration tests for your React application.

## Setup

1. Ensure you have the necessary dependencies installed:
   ```
   npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
   ```

2. Verify that your Jest configuration (jest.config.js) includes the following settings:
   ```javascript
   export default {
     testEnvironment: 'jsdom',
     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
     // ... other settings
   };
   ```

3. Make sure your jest.setup.js file includes:
   ```javascript
   import '@testing-library/jest-dom';
   ```

## Writing Integration Tests

Here's an example of how to create an integration test for the interaction between the FileUpload component and the Dashboard:

```javascript
// src/__tests__/FileUploadFilterIntegration.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock modules as needed
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

jest.mock('papaparse', () => ({
  parse: jest.fn((file, config) => {
    // Mock implementation
  }),
}));

// Custom render function
const renderApp = () => {
  return render(
    <MemoryRouter initialEntries={['/file-management']}>
      <App />
    </MemoryRouter>
  );
};

// Helper function for file upload
const uploadFile = async (fileName = 'test.csv') => {
  // Implementation
};

describe('File Upload and Filter Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('Uploading a valid file updates the Dashboard components', async () => {
    // Test implementation
  });

  // More test cases...
});
```

## Best Practices for Integration Testing

1. **Use Real Components**: Avoid mocking child components in integration tests. The goal is to test how real components interact.

2. **Minimize Mocking**: Only mock external dependencies like API calls or complex libraries (e.g., Papaparse).

3. **Test User Workflows**: Structure your tests around common user workflows rather than testing components in isolation.

4. **Use Data-testid Attributes**: Add data-testid attributes to key elements in your components to make them easier to select in tests.

5. **Async Operations**: Use `waitFor` or `findBy` queries for operations that cause asynchronous updates. Increase timeouts if necessary.

6. **Cleanup**: Ensure each test cleans up after itself, especially when dealing with global state or localStorage.

7. **Isolate Tests**: Use `beforeEach` and `afterEach` to set up and clean up the test environment for each test.

8. **Helper Functions**: Extract common setup code into helper functions to improve test readability and maintainability.

9. **Test Edge Cases**: Include tests for error scenarios, empty states, and boundary conditions.

10. **Multiple Interactions**: Test the interaction between multiple components and user actions (e.g., file upload followed by filtering).

## Advanced Testing Scenarios

1. **State Persistence**: Test if the application state (e.g., filters, uploaded data) persists correctly when navigating between different parts of the app.

2. **Error Boundaries**: Implement and test error boundaries to ensure the app gracefully handles unexpected errors.

3. **Performance Testing**: Consider adding performance tests for critical user workflows, especially for operations involving large datasets.

4. **Accessibility Testing**: Incorporate accessibility tests to ensure your application is usable by all users.

By following these guidelines and examples, you can create robust integration tests that ensure your components work together as expected, catching issues that unit tests might miss.