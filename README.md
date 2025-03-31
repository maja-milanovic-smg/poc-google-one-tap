# Google One Tap Authentication POC

## Overview

This project is a Proof of Concept (POC) implementation of Google One Tap authentication in a Vue 3 application. Google One Tap provides a streamlined authentication flow that allows users to sign in with their Google account with minimal friction, enhancing the user experience by reducing sign-in barriers.

## Features

- Google One Tap authentication integration
- Automatic sign-in with previously authenticated accounts
- JWT token decoding and management
- Persistent authentication state using local storage
- User profile display with information from Google account
- TypeScript support for type safety

## System Architecture

### Technology Stack

- **Frontend Framework**: Vue 3.5.13 with Composition API
- **Build Tool**: Vite 6.2.0
- **TypeScript**: Version 5.7.2 for type checking
- **Authentication**: Google Identity Services API
- **Token Management**: jwt-decode library for JWT handling

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- A Google Developer account with OAuth 2.0 credentials

### Google API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Create OAuth 2.0 Client ID credentials
5. Configure the authorized JavaScript origins with your application URL
6. Copy the Client ID for use in the application

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd poc-google-one-tap

# Install dependencies
yarn install
```

### Configuration

Create a `.env` file in the root directory with the following content:

```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Replace `your_google_client_id_here` with the Client ID obtained from Google Cloud Console.

### Development

To start the development server:

```bash
yarn dev
```

This will launch the development server at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

```bash
yarn build
```

The build output will be in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
yarn preview
```

### Testing

Run tests with:

```bash
# Run tests once
yarn test

# Run tests in watch mode
yarn test:watch
```

## Implementation Details

### Core Components

- **GoogleOneTap.vue**: Manages the Google One Tap integration, loading the Google Identity Services script, and handling authentication
- **UserProfile.vue**: Displays the authenticated user's information
- **Banner.vue**: Shows welcome messages based on authentication state
- **HelloWorld.vue**: Basic demonstration component

### Authentication Flow

1. The Google Identity Services script is loaded when the application starts
2. The One Tap UI is automatically displayed to the user
3. When a user signs in, the JWT credential is decoded to extract user information
4. User data is stored in the authentication store and persisted to localStorage
5. On page refresh or revisit, the saved authentication state is checked and restored if valid

## Dependencies

### Production Dependencies

- **vue**: Frontend framework (v3.5.13)
- **jwt-decode**: For decoding JWT tokens from Google authentication (v4.0.0)

### Development Dependencies

- **@vitejs/plugin-vue**: Vue integration for Vite
- **@vue/tsconfig**: TypeScript configuration for Vue
- **typescript**: Type checking support
- **vite**: Build tool
- **vue-tsc**: TypeScript compiler for Vue components
- **vitest**: Testing framework
- **@testing-library/vue**: Testing utilities for Vue components
- **@vue/test-utils**: Vue testing utilities
- **happy-dom**: DOM environment for testing

## Security Considerations

- Token expiration is checked on application initialization
- Expired tokens are automatically invalidated
- Authentication state is securely stored in localStorage
- HTTPS should be used in production to secure the authentication process

## Browser Compatibility

Google One Tap is supported in most modern browsers. For optimal user experience, ensure that:

- Cookies are enabled in the browser
- Third-party cookies are allowed (required for some Google authentication features)
- JavaScript is enabled

## Troubleshooting

### Common Google One Tap Issues

1. **"The given origin is not allowed for the given client ID"**
   - Solution: Go to Google Cloud Console > APIs & Services > Credentials
   - Edit your OAuth 2.0 Client ID
   - Add `http://localhost:5173` and `https://localhost:5173` to the authorized JavaScript origins
   - For production, add your domain (e.g., `https://yourdomain.com`)

2. **FedCM Errors (Federated Credential Management)**
   - Google is transitioning to FedCM, which requires updates to authentication code
   - Ensure your implementation includes `use_fedcm_for_prompt: true` in the initialization options
   - See [Google's FedCM Migration Guide](https://developers.google.com/identity/gsi/web/guides/fedcm-migration)

3. **"Only one navigator.credentials.get request may be outstanding at one time"**
   - This occurs when multiple authentication prompts are triggered simultaneously
   - Solution: Implement a debounce/delay mechanism for the prompt method
   - Clear existing prompt requests before starting new ones

4. **"The fetch of the id assertion endpoint resulted in a network error: ERR_FAILED"**
   - This can occur due to cross-origin issues or browser security settings
   - Enable third-party cookies in your browser
   - Check if any browser extensions are blocking the authentication requests
   - Try a different browser to isolate the issue

5. **TypeErrors in Console**
   - If encountering TypeScript errors, add proper type declarations as shown in the GoogleOneTap component

### Browser Requirements

- Ensure cookies are enabled (especially third-party cookies)
- Disable or configure privacy-blocking extensions that might interfere with Google authentication
- For testing with Chrome, you may need to enable "Allow third-party cookies" temporarily

## License

[Your License Information]

## Acknowledgements

- [Vue.js](https://vuejs.org/)
- [Google Identity Services](https://developers.google.com/identity)


## TO DO:
Stop loop after logout - dead-loop UX
Customizations