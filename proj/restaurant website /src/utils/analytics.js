import * as amplitude from '@amplitude/analytics-browser';

// Initialize Amplitude with default tracking configuration
amplitude.init(import.meta.env.VITE_AMPLITUDE_API_KEY || '', {
  defaultTracking: {
    sessions: true,
    pageViews: true,
    formInteractions: true,
    fileDownloads: true
  }
});

export const trackEvent = (eventName, eventProperties = {}) => {
  amplitude.track(eventName, eventProperties);
};

export const identifyUser = (userId, userProperties = {}) => {
  amplitude.identify(userId, userProperties);
};

export const resetUser = () => {
  amplitude.reset();
};

export default amplitude; 