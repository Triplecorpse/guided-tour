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
      
      // Check if user suppressed the prompt and redirect to classic OAuth
      if (notification.isSuppressedByUser()) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        
        if (!clientId) {
          reject(new Error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable'));
          return;
        }
        
        const redirectUri = `${window.location.origin}/social/google/redirect`;
        const scope = 'email profile';
        const responseType = 'code';
        
        const classicOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${encodeURIComponent(clientId)}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `scope=${encodeURIComponent(scope)}&` +
          `response_type=${responseType}&` +
          `access_type=offline&` +
          `prompt=consent`;
        
        window.location.href = classicOAuthUrl;
        return;
      }
    });
  });
}; 
