declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (a: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          onPromptNotification?: (notification: any) => void;
        };
      };
    };
  }
}

export const getGoogleIdToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if Google Identity Services is loaded
    if (!window.google?.accounts?.id) {
      reject(new Error('Google Identity Services not loaded'));
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      reject('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable');
    }
    console.log("Runtime origin:", window.location.origin);

    // Initialize Google Identity Services
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential: string }) => {
        resolve(response.credential);
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Prompt for Google Sign-In
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        reject(new Error('Google Sign-In not available'));
      }
    });
  });
}; 