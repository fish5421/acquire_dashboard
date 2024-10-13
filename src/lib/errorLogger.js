// This is a basic error logging service that can be extended in the future
// to send errors to a backend service or third-party error tracking tool

const logError = (error, context = {}) => {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
    console.error('Context:', context);
  }

  // In production, you might want to send this to a logging service
  // This is where you'd integrate with services like Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // Example: send to a hypothetical error tracking service
    // errorTrackingService.log(error, context);

    // For now, we'll just log to console in production as well
    console.error('Error:', error);
    console.error('Context:', context);
  }
};

export default logError;