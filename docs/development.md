# Development Guide

## Prerequisites
- Node.js 18+
- npm 9+
- Firebase project with Firestore enabled
- Service account credentials stored locally and referenced by `GOOGLE_APPLICATION_CREDENTIALS`

## Environment Variables
Create a `.env` file (or set variables in your shell) with the following keys:

```
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
FIREBASE_PROJECT_ID=<your-project-id>
GOOGLE_APPLICATION_CREDENTIALS=<absolute-path-to-service-account.json>
JWT_SECRET=<long-random-string>
```

You can start with the provided `env.example` as a template.

## Installing Dependencies
```bash
npm install
```

## Running Locally
```bash
npm run dev
```

This command runs the Express server with hot-reload using `ts-node-dev`. The server listens on `http://localhost:3000` by default.

## Testing
```bash
npm test
```

Jest loads `src/tests/setup.ts` to initialise the testing environment.

## Linting and Formatting
```bash
npm run lint
npm run format
```

These commands run ESLint and Prettier using the configurations defined in `package.json` and `.eslintrc.js`.

## Firebase Emulators (Optional)
If you prefer a fully sandboxed environment:
1. Install the Firebase CLI: `npm install -g firebase-tools`.
2. Log in: `firebase login`.
3. Start emulators: `firebase emulators:start --only functions,firestore`.

Update `GOOGLE_APPLICATION_CREDENTIALS` to point at a locally generated service account credential compatible with the emulator.

## Deployment Notes
- `src/index.ts` exports the Express app as a Firebase HTTPS function named `api`.
- Deploy using the top-level `deploy.sh` for Unix or `deploy.ps1` for Windows.
- Ensure Firestore indexes in `firestore.indexes.json` are deployed to avoid query failures.
