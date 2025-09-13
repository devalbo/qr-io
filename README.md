# QR IO

A React Native/Expo app for QR code scanning and data transmission.

## Development

### Prerequisites
- Node.js 20+
- npm or yarn
- Expo CLI

### Setup
```bash
npm install
```

### Running the app
```bash
# Start development server
npm start

# Run on specific platforms
npm run android
npm run ios
npm run web
```

### Building for production
```bash
# Build web version
npm run build:web

# Preview web build locally
npm run preview:web
```

## Compile Protobufs

```bash
npx protoc --ts_out protobufs/protofiles-out --proto_path protobufs/protofiles-in protobufs/protofiles-in/*.proto
```

## Deployment

### GitHub Pages (Web)

The web version of this app is automatically deployed to GitHub Pages when changes are pushed to the main branch.

#### Setup Instructions:

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

2. **The deployment workflow** (`.github/workflows/deploy.yml`) will automatically:
   - Build the web app using Expo
   - Deploy to GitHub Pages
   - Handle client-side routing with the included `404.html`

3. **Your app will be available at:**
   ```
   https://yourusername.github.io/qr-io/
   ```

#### Manual Deployment:

If you need to deploy manually or test locally:

```bash
# Build the web app
npm run build:web

# The built files will be in the `dist` directory
# You can serve them locally with:
npx serve dist
```

#### Notes:

- The app is configured with `baseUrl: "/qr-io"` for GitHub Pages deployment
- Client-side routing is handled by the `404.html` file
- The deployment uses GitHub Actions for automatic builds
- Static files are served from the `dist` directory after build

### Mobile Deployment

For iOS and Android deployment, use Expo's build services:

```bash
# Build for iOS
npx expo build:ios

# Build for Android  
npx expo build:android
```
