# FaceSign Project Architecture

## General Learnings: API, Data Flow, and Integration

### 1. **Making Changes to @facesign-api**
- **@facesign-api** is the canonical SDK and type definition layer for all FaceSign applications. Any change to types, endpoints, or data contracts must be made here first.
- **Touchpoints:**
  - **@facesign-create/app** (Flow Builder UI): Uses @facesign-api types for node/flow configuration and validation.
  - **@facesign-create/functions**: Uses @facesign-api to serialize and send flow/session settings to the backend.
  - **@facesign-ff** (Backend): Uses @facesign-api types to process and validate incoming session/flow data, and to structure responses.
  - **@facesign** (Frontend): Uses @facesign-api types to interpret backend responses and drive the UI.
- **Best Practice:**
  - When making a change to @facesign-api, always update all consumers (builder, backend, frontend) to match the new contract.
  - For local development, use `yarn link` or equivalent to ensure all apps use the latest local version. For production, publish or push to the correct branch and update all consumers' dependencies.
  - Always check for type errors and runtime breakage after updating the API package.

### 2. **@facesign-create/functions vs @facesign-ff**
- **@facesign-create/functions**:
  - Backend for the Flow Builder (admin/configuration tool).
  - Handles saving/loading flow configurations, session creation, and admin utilities.
  - Communicates with @facesign-ff via the @facesign-api SDK to create sessions and push configuration.
  - Runs on a separate Firebase Functions instance (typically on a different port, e.g., 9000).
- **@facesign-ff**:
  - Main backend for end-user verification sessions.
  - Orchestrates the runtime flow, processes user input, manages session state, and returns UI/action instructions to the frontend.
  - Reads flow/session configuration from Firestore (populated by @facesign-create).
  - Runs on its own Firebase Functions instance (typically on port 5001).

### 3. **Correct Data Flow and Touchpoints**
- **Configuration Phase:**
  - User designs a flow in @facesign-create/app (Flow Builder UI).
  - @facesign-create/functions saves the flow to Firestore and uses @facesign-api to create a session in @facesign-ff.
  - All configuration (node types, settings, etc.) is serialized using @facesign-api types.
- **Runtime Phase:**
  - @facesign (frontend) starts a session by calling @facesign-ff endpoints (using @facesign-api types for requests/responses).
  - @facesign-ff processes the session, reads the configuration, and returns instructions (actions, prompts, etc.) to the frontend.
  - All data exchanged at runtime is validated and structured using @facesign-api types.

### 4. **Version Management and Local Linking**
- Always ensure all apps (builder, backend, frontend) are using the same version/branch of @facesign-api.
- For local development, use `yarn link` to avoid version drift and ensure immediate propagation of changes.
- For production, update the dependency to the correct branch or published version and run `yarn install` in all consumers.
- If you see type errors, missing fields, or runtime breakage, check that all apps are using the same @facesign-api version.

### 5. **Where to Expect Breakage or Sync Issues**
- After changing @facesign-api, if you see type errors or runtime bugs, check:
  - All apps are using the correct (and same) version of @facesign-api.
  - All relevant code paths (configuration, backend, frontend) have been updated to use the new types/fields.
  - There are no stale node_modules or lockfiles.
- If the frontend or backend is missing new settings or fields, check the serialization/deserialization logic in both @facesign-create/functions and @facesign-ff.

---

This document outlines the architecture of the FaceSign project, which is composed of several interconnected repositories.

## Overview

FaceSign provides facial recognition and verification services. The architecture follows a microservices-like approach, with distinct components for the frontend, backend logic, API, real-time communication, shared libraries, and administrative functions.

## Core Components

The project is divided into the following key repositories:

1. **`facesign`**:
    - **Purpose:** The main production-ready frontend application where end-users complete verification sessions.
    - **Technology (likely):** React (Create React App based, potentially with CRACO).
    - **Functionality:** Provides the user interface for the verification flow, including camera interactions, displaying avatar prompts, and potentially invoking the Microblink Web SDK component. Interacts with `facesign-ff` and `facesign-socket`.
    - **Deployment:** Hosted on Firebase Hosting. See [Deployment Instructions](about:blank#deployment-instructions).
2. **`facesign-ff`**:
    - **Purpose:** The primary backend logic implementation.
    - **Technology:** Firebase Functions (Serverless TypeScript).
    - **Functionality:** Orchestrates verification flows configured via `facesign-create` (specifically, `facesign-ff/src/sessions/flow/flowProcessor.ts` reads flow configurations from Firestore and processes nodes). Handles business logic, data processing, AI interactions (prompt generation, LLM calls via `facesign-ff/src/ai/`), interacts with databases (Firestore via `facesign-ff/src/db/`), provides runtime keys/config (e.g., Microblink license key via `facesign-ff/src/config.ts` from `.env.facesignai`) to the `facesign` frontend through action payloads in `PhraseObject`s, and calls external services. Manages session state and handles various client requests during a verification session (endpoints in `facesign-ff/src/sessions/clientEndpoints.ts` and `facesign-ff/src/demo2/demo2Endpoints.ts`).
    - **Deployment:** Deployed as Firebase Functions. See [Deployment Instructions](#deployment-instructions).
3. **`facesign-api`**:
    - **Purpose:** Software Development Kit (SDK) for interacting with the FaceSign backend API (likely endpoints exposed by `facesign-ff`).
    - **Technology (likely):** TypeScript/JavaScript.
    - **Functionality:** Provides a standardized way for client applications (like `facesign` or external customer apps) to communicate with the backend.
    - **Deployment:** Published as a package (e.g., to npm or used directly via Git URL).
4. **`facesign-lib`**:
    - **Purpose:** Shared library containing reusable UI components and potentially utility functions.
    - **Technology (likely):** React, TypeScript.
    - **Usage:** Linked as a Git submodule in other repositories (e.g., `facesign`, `facesign-admin`) to promote code reuse and consistency.
5. **`facesign-types`**:
    - **Purpose:** Shared library containing common TypeScript type definitions used across multiple FaceSign projects. facesign-types is a seaparte repo that is linked to `facesign/` repo as a folder.
    - **Technology:** TypeScript.
    - **Usage:** Linked as a Git submodule to ensure type consistency. Critical for defining data structures like `PhraseObject` (in `facesign-types/internal.ts`), node types for the flow builder (`FSNode` and its variants in `facesign-types/...`), and action payloads that are passed between `facesign-ff` and `facesign`.
6. **`facesign-socket`**:
    - **Purpose:** Real-time communication server.
    - **Technology:** Node.js with Socket.IO for WebSockets, FFmpeg for video processing.
    - **Functionality:** Handles real-time aspects like video streaming, frame extraction for analysis (e.g., via AWS Rekognition), potentially receiving logs.
    - **Deployment:** Likely deployed as a standalone Node.js application (e.g., to Cloud Run, App Engine, or another hosting provider).
7. **`facesign-admin`**:
    - **Purpose:** Administrative panel for managing the FaceSign application.
    - **Technology (likely):** React.
    - **Functionality:** Provides an interface for administrators.
    - **Deployment:** Likely hosted on Firebase Hosting or similar.
8. **`facesign-create`**:
    1. See `CREATE_README.md` for details
    - **Purpose:** Configuration tool for customers to design verification flows.
    - **Technology:** React frontend (`/app`), Firebase Functions backend (`/functions`).
    - **Functionality:** Visual flow builder (`facesign-create/app`) allows users to design verification flows by arranging nodes and configuring their settings. These configurations are saved to Firestore. The backend part (`facesign-create/functions`) provides API endpoints for the `facesign-create/app` frontend (e.g., to save/load flows) and includes utilities like `facesign-create/functions/src/utils/proto.ts` to serialize flow data into a format understood by `facesign-ff`. Added `.env.local`  to facesign-create/functions folder. We do not need to edit FACESIGN_SERVER_URL more. It will use different envs for local running and deployed version automatically.
    - **Important Note:** `facesign-create` *configures* flows but does *not execute* them for end-users. End-user session execution is handled by the `facesign` application, orchestrated by `facesign-ff`.
    - **Deployment:** Frontend (`/app`) hosted on Firebase Hosting, backend (`/functions`) deployed as Firebase Functions.
9. **`facesign-api-sample`**:
    - **Purpose:** A sample application demonstrating the usage of the `facesign-api`.
    - **Functionality:** Showcases specific flows.
10. **`recognition_demo`**:
    - **Purpose:** A demonstration application showcasing facial recognition and a single-page conversational interaction with an avatar (e.g., Heygen).
    - **Technology:** React, likely using `HeyGenConnectLiveKit`.
    - **Relevance:** Serves as a **structural reference** for the `id_verification_demo`, particularly for the single-page conversational UI (`Conversation.tsx`), Heygen/LiveKit integration, and basic API call patterns.
11. **`id_verification_demo`**:
    - **Purpose:** A demonstration application focusing on **Identity Document Verification (IDV)**, integrating Microblink BlinkID scanning into a conversational flow.
    - **Technology:** React, Heygen/LiveKit, Microblink SDK.
    - **Relationship to `recognition_demo`:** Cloned from `recognition_demo` to leverage its single-page conversational structure, but implements a distinct IDV flow with its own AI logic driven by Firestore.

## Interactions and Data Flow

- **User Interaction:** Users interact with frontend application (`facesign` )
- **API Communication:** Frontend applications (`facesign`, `id_verification_demo`) use `facesign-api` SDK or direct fetch calls to communicate with `facesign-ff` endpoints (defined in `facesign-ff/src/sessions/clientEndpoints.ts`, `facesign-ff/src/demo2/demo2Endpoints.ts`, etc.).
- **Backend Logic (`facesign-ff`):**
    - Reads flow configurations (created by `facesign-create`) from Firestore.
    - `facesign-ff/src/sessions/flow/flowProcessor.ts` steps through the configured flow nodes.
    - For nodes requiring frontend actions (e.g., `DOCUMENT_SCAN`, `ENTER_EMAIL`), it adds an `action` object to the `PhraseObject` (defined in `facesign-types/internal.ts`). This action object contains necessary data, like the `BLINKID_LICENSE_KEY` (from `facesign-ff` environment variables via `facesign-ff/src/config.ts`) for document scanning.
    - Handles other business logic, database interactions, and calls to external services.
- **Frontend Execution (`facesign`):**
    - The `facesign/src/pages/Conversation.tsx` component receives the `PhraseObject`.
    - It checks for an `action` field. If present, it uses the `action.type` to determine the client-side behavior.
    - For `START_DOCUMENT_SCAN`, it initializes the Microblink BlinkID SDK (as a full-page inline component) using the `apiKey` from the action payload.
    - For `SHOW_EMAIL_INPUT`, it would display the email input UI.
    - A dedicated endpoint in `facesign-ff` (to be created by Maksim) processes these results, updates the session state in Firestore, and the flow continues based on the scan outcome as defined in the flow configuration from `facesign-create`.

    **Component Architecture** (`facesign/src/pages/Conversation.tsx`):
    - The main conversation component has been modularized for better maintainability and separation of concerns.
    - **UI Components** (extracted to `/conversation/` subdirectory):
      - `PermissionsFlow`: Handles initial permission requests and error states
      - `AvatarRenderer`: Manages avatar provider selection and rendering (HeyGen/Azure/Custom)
      - `ActiveModeDisplay`: Renders mode-specific UI (EmailInput/DocumentScanning)
      - `ConversationRecorder`: Encapsulates recorder component rendering logic
      - `MainControlPanel`: Handles control panel UI and interactions
    - **Custom Hooks** (in `/conversation/hooks/`):
      - `useSilenceDetection`: Manages silence detection timer with proper cleanup
      - `useMediaControls`: Handles camera/mic state, device management, and stream control
      - `useConversationMode`: Manages conversation mode state and transitions
    - **Bundle Optimization**: Uses `import type * as BlinkIDSDK` to prevent the entire SDK from being bundled when only types are needed, significantly reducing bundle size for users without document scanning flows.
    - This modular architecture reduces the main component from ~1,100 lines to ~800 lines (27% reduction) while maintaining all functionality.

4. **Result Presentation**:
   - Document scan results can be included in the Recap view if configured in the END node settings

- **Real-time Data (`facesign-socket`):** Frontends stream video/audio to the socket server for processing (e.g., facial recognition frame extraction).
- **Administration:** Administrators use `facesign-admin`.
- **Shared Code:** `facesign-lib` and `facesign-types` ensure consistency via Git submodules.

## Key Technical Concepts & Learnings

1. **Vendor Connections (Heygen, Deepgram, Firebase, AWS):**
    - **Heygen:** Connection requires careful handling of API keys (`X-Api-Key` header) and session tokens. LiveKit integration (`HeyGenConnectLiveKit`) is generally more stable than direct WebRTC for managing streaming sessions, especially when dealing with potential interruptions like modal overlays. Robust reconnection logic (using LiveKit events and exponential backoff) is crucial.
    - **Deepgram:** Requires API keys provided securely from the backend (`facesign-ff`) via an initial setup call, not stored directly in the frontend.
    - **Firebase (Firestore/Functions):** Requires correct setup for local emulators (ports, project ID). Functions in `facesign-ff` need proper CORS configuration for local development. The `BLINKID_LICENSE_KEY` is an environment variable in `facesign-ff` (e.g., in `.env.facesignai` for a specific environment) and accessed via `facesign-ff/src/config.ts`.
    - **AWS Rekognition:** Used by `facesign-socket` for facial recognition matching.
2. **Firestore-Driven Prompts & AI Conversation Flow (`id_verification_demo`):**
    - **Configuration:** The `settings/idvConf` document in Firestore dictates the prompts for different states and AI model configuration.
    - **Backend Role (`facesign-ff`):** The `generateResponse` function acts as a **state machine orchestrator**. It reads the current interaction state (`lastPromptId`, `messages`, `flags`, `verificationOutcome`) from Firestore. **Backend logic** then determines the correct *current* conversational stage (e.g., Greeting, Doc Prep, Readiness Check, Scan Feedback). It selects the appropriate prompt from `settings/idvConf` for that stage, injects context data (user reply, verification outcome etc.), and calls the LLM primarily to generate the `reply` text (and potentially analyze context for flags like `userIsReady`). The **backend logic then determines the *next* state (`promptId`)** based on the current stage and LLM output/flags, updates Firestore with this new state, and returns the `reply`, determined flags, and potentially an `isOver` signal to the frontend.
    - **Frontend Role (`Conversation.tsx`):** Manages the UI, sends user input to the backend, receives the AI-generated `reply` and any `flags` or `isOver` signals from the backend, makes the avatar speak, and reacts to flags (e.g., opening the scanner modal when `userIsReady` is received). It does not need to manage the core conversation state itself.
    - **Benefits:** Centralizes state management logic in the backend for consistency, similar to `recognition_demo`, while still allowing prompt content flexibility.
3. **Emulator Setup and Usage:**
    - Firebase emulators (`functions`, `firestore`) are essential for local development. Start them from the `facesign-ff` directory.
    - Ensure correct ports (e.g., Functions: 5001, Firestore: 8080 or 8091 - check emulator startup logs) are used in frontend configurations and API calls.
    - Node scripts interacting with the emulator (like `uploadIdvConf.js`) need environment variables set (`FIRESTORE_EMULATOR_HOST`) *before* initializing the Firebase Admin SDK.
    - For projects using Yarn PnP, Node scripts need to be run using `node --require ./.pnp.cjs script_name.js`.
4. **Camera Management & Modal Approach (`id_verification_demo`):**
    - Direct camera handoff between components (like Heygen avatar and BlinkID scanner) proved unstable, often causing LiveKit disconnections.
    - **Successful Approach:** Using a **modal overlay** for the ID scanner (`IDScannerModal`) allows the main `HeyGenConnectLiveKit` component to remain active in the background, avoiding the problematic camera handoff and maintaining session stability.
    - A `CameraManager` service can still be useful *within* the modal if multiple camera sources need selection for the *scanner itself*, but it's not needed for handoff between the avatar and the scanner modal.
5. **Dependency Management (Yarn PnP):**
    - The use of Yarn Plug'n'Play (PnP) requires specific commands (`node --require ./.pnp.cjs ...`) to run Node scripts correctly.
    - Peer dependency warnings during `yarn install` are common and might need investigation if they cause runtime issues.

## Project Setup

### `facesign-create`

- Facesign API `facesign-api` → This is a separate repo.
    - We work in a branch while we are developing and changing it actively. The branch is `flow_builder`.
    - When we changed something in the api and pushed the changes to github we need to pull the changes where facesign api is used.
    - Facesign api installs as a library using yarn or npm. It's in package.json.
    - But if you run `yarn add @facesignai/api` it will install production version that's pushed to npm. But we need the `flow_builder` version. We don't want that for development
    - So we install it this way:
        - `yarn remove @facesignai/api`
        - `yarn add @facesignai/api@https://github.com/facesignai/facesign-api#flow_builder`

## Local Development Setup

### Running the Complete System Locally

To fully test the end-to-end Flow Builder and Verification system locally, you need to run both the configuration tool (`facesign-create`) and the end-user verification app (`facesign`) concurrently. This setup allows you to design flows in the builder and immediately test them using the preview feature.

#### Step 1: Run facesign-create (Flow Builder)

1. Navigate to the facesign-create app directory:
   ```bash
   cd facesign-all/facesign-create/app
   ```

2. Install dependencies (if needed):
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn start
   ```
   This will automatically run on port 3000 (default for Create React App).

#### Step 2: Run facesign (End-User Verification App)

1. Navigate to the facesign directory:
   ```bash
   cd facesign-all/facesign
   ```

2. Install dependencies (if needed):
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn start
   ```
   Since port 3000 is already in use by facesign-create, you'll be prompted to use a different port. Type 'y' to accept, and facesign will run on port 3001.

#### Step 3: Ensure Port 3001 is Available

Before starting facesign, make sure port 3001 is available:

1. Check if anything is using port 3001:
   ```bash
   lsof -i :3001
   ```
   or on Windows:
   ```bash
   netstat -ano | findstr :3001
   ```

2. If something is using port 3001, you can kill it:
   - On Mac/Linux:
     ```bash
     kill -9 $(lsof -ti:3001)
     ```
   - On Windows, find the PID (Process ID) from the netstat command output and use:
     ```bash
     taskkill /F /PID <PID>
     ```

#### Step 4: Using the Preview Feature

1. In the facesign-create Flow Builder, design your verification flow.
2. Click the "Preview" button in the top navigation bar.
3. The preview modal detects that you're running locally and automatically connects to your local facesign instance on port 3001.
4. You can now test your flow with the actual end-user verification experience.

#### Troubleshooting

- If the preview doesn't connect to your local facesign instance, check:
  - Both applications are running (facesign-create on port 3000, facesign on port 3001)
  - Your configuration URLs in the facesign app (check `confs/dev/config.js` for proper settings)
  - Network settings in your browser (especially if using security extensions)
  - Console errors that might indicate connection issues

- For WebSocket connection issues:
  - Make sure facesign-socket is running if needed
  - Check the socketServerUrl configuration in facesign's config.js

## Deployment Instructions

This section provides general instructions for deploying the main components hosted on Firebase. Ensure you have the [Firebase CLI](https://firebase.google.com/docs/cli) installed and configured.

### Deploying `facesign` (Frontend Hosting)

1. **Navigate to the `facesign` directory:**`bash cd /path/to/facesign-all/facesign`
2. **Install Dependencies (if needed):**`bash yarn install`
3. **Build the Production Application:**`bash yarn build`*(This command might differ based on `package.json` scripts, but `build` is standard for Create React App based projects. It generates static files in the `build/` directory, or the directory specified as `public` in `firebase.json`)*.
4. **Deploy to Firebase Hosting:**`bash firebase deploy --only hosting`*(Ensure your Firebase CLI is logged in (`firebase login`) and connected to the correct Firebase project, potentially using `firebase use <project_id_or_alias>`). This command uploads the contents specified in `firebase.json's `hosting` configuration).*

### Deploying `facesign-ff` (Backend Functions)

1. **Navigate to the `facesign-ff` directory:**`bash cd /path/to/facesign-all/facesign-ff`
2. **Install Dependencies (if needed):**`bash yarn install`
3. **Build the Functions (Compile TypeScript):**`bash yarn build`*(This command compiles TypeScript to JavaScript, typically into a `lib/` or `dist/` directory specified in `tsconfig.json` and potentially `firebase.json's `functions.source` setting)*.
4. **Deploy to Firebase Functions:**`bash firebase deploy --only functions`*(This deploys the functions defined in your `index.ts` (or equivalent entry point) using the compiled code).*

### Deploying `facesign-create` (Frontend Hosting & Backend Functions)

Deploying `facesign-create` involves deploying both its frontend (`/app`) and its backend (`/functions`).

1. **Navigate to the `facesign-create` root directory:**`bash cd /path/to/facesign-all/facesign-create`
2. **Build the Frontend (`/app`):**`bash cd app yarn install # if needed yarn build cd ..`
3. **Build the Backend (`/functions`):**`bash cd functions yarn install # if needed yarn build # Or relevant build script from functions/package.json cd ..`
4. **Deploy Both Hosting and Functions:**`bash firebase deploy`*(This command reads the `firebase.json` in the `facesign-create` root, which should be configured to deploy the `app/build` directory to hosting and the compiled code from `functions` directory to Cloud Functions).*

---

## Project Directory Structure

This section provides a reference guide to the repository structure to help navigate the codebase.

```
facesign-all/                         # Root project directory.  Not a functional application, just a folder to contain all the other applications that make up FaceSign.
│
├── facesign-ff/                      # Firebase Functions backend
│   ├── src/
│   │   ├── demo2/                  # Demo-related backend logic
│   │   │   └── demo2Endpoints.ts   # Endpoint for AI response generation
│   │   ├── idv/                      # IDV-related backend logic
│   │   │   ├── idvEndpoints.ts       # Specific IDV API endpoints (start, status, verify-id proxy)
│   │   │   ├── corsConfig.ts         # CORS configuration
│   │   │   └── ...
│   │   ├── types/                    # Shared backend types
│   │   ├── index.ts                  # Main functions export
│   │   └── ...
│   ├── scripts/
│   │   └── uploadIdvConf.js        # Script to upload IDV config to Firestore
│   ├── package.json
│   └── firebase.json
│
├── id_verification_demo/             # ID Verification demo application
│   ├── src/
│   │   ├── components/
│   │   │   └── idv/
│   │   │       ├── IDScanner.tsx      # Core BlinkID scanning component
│   │   │       └── IDScannerModal.tsx # Modal wrapper for scanner
│   │   ├── controllers/
│   │   │   └── main.ts               # Frontend API interaction logic
│   │   ├── pages/
│   │   │   ├── Conversation.tsx    # Main conversational UI component
│   │   │   └── Recap.tsx           # Recap display component
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   └── HeyGenConnectLiveKit.tsx # Heygen/LiveKit integration
│   │   │   ├── services/
│   │   │   │   └── CameraManager.ts  # Camera management utility (primarily for scanner)
│   │   │   └── utils/
│   │   │       └── imageUtils.ts     # Image conversion utilities
│   │   ├── firebase/
│   │   │   └── idvPrompts.js         # (Reference/old) JS prompts, primary source is Firestore
│   │   └── App.tsx                   # Root application component
│   ├── public/
│   │   └── resources/                # BlinkID WASM files
│   ├── scripts/                      # Frontend utility scripts
│   │   ├── uploadIdvConf.js        # (Duplicate/older?) Script to upload config
│   │   └── checkIdvConf.js         # Script to check Firestore config
│   ├── package.json
│   ├── TASK.md                       # Main task list for IDV demo
│   ├── SCRIPT_UPDATE.md              # Target conversational script
│   ├── IDV_IMPLEMENTATION_GUIDE.md   # Guide for current implementation
│   ├── BLINK_GUIDE.md                # General BlinkID integration guide
│   └── docs/
│       └── archived_handoff_issues/  # Archived docs for camera issues
│
├── facesign-socket/                  # Real-time socket server
│   ├── src/
│   │   ├── videos/videoProcessor.ts  # Video stream/frame processing
│   │   └── ...
│   └── package.json
│
├── recognition_demo/                 # Facial Recognition demo (Reference)
│   ├── src/
│   │   ├── pages/Conversation.tsx    # Reference conversational UI
│   │   └── ...
│   └── package.json
│
├── facesign-types/                   # Shared TypeScript types
│
├── facesign-lib/                     # Shared UI components
├── facesign-api-sample/                     # Sample demo to quickly start using the facesign-api
│
└── ARCHITECTURE.md                   # This architecture document
```

Use this directory structure as a reference when navigating between different parts of the codebase or when trying to locate specific functionality.

## Common Issues and Solutions

### CORS Errors

If you see CORS errors (`Access-Control-Allow-Origin` issues):

1. Verify the API server has the correct CORS configuration
2. Check that `corsConfig.ts` includes your frontend's origin
3. For local development, make sure you've configured the API to allow development origins:
    - Check that `isDevelopment` is correctly detected in `corsConfig.ts`
    - Verify the CORS middleware is correctly applied to all routes

### Connection Refused/Failed

If you see `ERR_CONNECTION_REFUSED` or connection failures:

1. Make sure the API server is running:
    
    ```
    cd facesign-ff
    yarn serve
    ```
    
2. Check for port conflicts:
    - Default port for Firebase Functions emulator is 5001
    - Try different ports if needed (the test tool attempts multiple common ports)
3. Verify credentials handling:
    - Test both with and without credentials
    - Check if your browser is blocking third-party cookies

### API Path Issues

If the API paths aren't matching:

1. Make sure you're using the standardized URL building functions from `apiUtils.ts`
2. Verify that both `/api/document-scan/...` and `/document-scan/...` paths are tested
3. Check the Firebase emulator configuration to ensure it's using the expected paths

## Backend Configuration

To verify backend configuration:

1. Check that `corsConfig.ts` has been updated with the improved configuration
2. Verify that `index.ts` is applying the CORS configuration to all routes
3. Make sure `documentScanEndpoints.ts` is using the shared CORS middleware

## Document Scanning Flow

The document scanning functionality follows this integrated flow across multiple repositories:

1. **Flow Configuration** (`facesign-create`):
   - Users add a DocumentScan node to their verification flow using the Flow Builder
   - They configure document types and other settings in the node settings panel
   - The configuration is serialized and stored in Firestore
   - `proto.ts` handles converting the DocumentScan node to the format required by `@facesignai/api`

2. **Action Notification System** (`facesign-ff` and `facesign`):
   - The flow processor (`facesign-ff/src/sessions/flow/flowProcessor.ts`) encounters a `DOCUMENT_SCAN` or `ENTER_EMAIL` node while processing a session based on the configuration from `facesign-create`.
   - It generates an action notification by adding an `action` field to the `PhraseObject`. The structure of this `action` (e.g., `{ type: 'START_DOCUMENT_SCAN', apiKey: '...' }`) is defined in `facesign-types/internal.ts`.
   - For `START_DOCUMENT_SCAN`, the `apiKey` is the `BLINKID_LICENSE_KEY` obtained from `facesign-ff`'s environment variables.
   - This `PhraseObject` (including the action) is returned to the `facesign` frontend.

3. **Frontend Execution** (`facesign`):
   - The `facesign/src/pages/Conversation.tsx` component receives the `PhraseObject`.
   - It checks for an `action` field. If present, it uses the `action.type` to determine the client-side behavior.
   - For `START_DOCUMENT_SCAN`, it initializes the Microblink BlinkID SDK (as a full-page inline component) using the `apiKey` from the action payload.
   - For `SHOW_EMAIL_INPUT`, it would display the email input UI.
   - A dedicated endpoint in `facesign-ff` (to be created by Maksim) processes these results, updates the session state in Firestore, and the flow continues based on the scan outcome as defined in the flow configuration from `facesign-create`.

4. **Result Presentation**:
   - Document scan results can be included in the Recap view if configured in the END node settings

This unified approach provides several advantages:
- The generic action notification system makes it easy to add new action types beyond document scanning
- All necessary configuration is passed in a single step, eliminating the need for multiple API calls
- The frontend can handle different actions through a consistent interface
- Results are processed uniformly and stored in a standardized format

### DocumentScan Node Integration

- The Flow Builder now supports a new `DocumentScan` node type, which allows configuration of document scanning steps in verification flows.
- Each fixed-outcome node (like Liveness, EnterEmail, DocumentScan) stores an `outcomes` map in Firestore, mapping each possible outcome to a unique transition ID.
- The UI ensures that transition IDs are generated only once and are not regenerated on re-render, maintaining edge consistency in React Flow.
- The right-side settings panel for DocumentScan nodes follows the same pattern as other nodes, with configuration options and outcome mapping.

### Node Outcomes, Transitions, and Edge Routing (API Contract)

- The canonical definition of all node types, their possible outcomes, and the mapping of each outcome to a unique transitionId is maintained in `facesign-api` (`src/types/nodes.ts`).
- The flow builder UI (`facesign-create`) is a visual editor for this schema, but the backend logic and session execution always use the types and outcome constants from `facesign-api`.
- For fixed-outcome nodes (e.g., Liveness, DocumentScan), the node stores an `outcomes` object:  
  `{ [OutcomeConstant]: transitionId }`
- When the backend processes a node, it determines the outcome (e.g., from Microblink or AI), looks up `node.outcomes[OUTCOME_CONSTANT]` to get the transitionId, then finds the edge with `sourceHandle = transitionId`. The `target` of that edge is the next node to process.
- This contract ensures that the backend can always route to the correct next node, regardless of how the UI is implemented.

# Session Creation Flow (uses @facesign-api)
- facesign-create/functions uses @facesign-api to create sessions
- @facesign-api sends the settings (including permissions customization) to facesign-ff
- facesign-ff stores everything in main application's Firestore (facesign-dev & facesign-prod)


# RECAP PAGE AND WRAPPER
The wrapper will have several pages:
- incorrect url
- error
- initialization
- playing
- recap

A user opens a url, the wrapper page opens (/user) . The page takes formId from the url path and sends it to Facesign-create backend `facesign-create/functions`. The `facesign-create/functions` loads flow data from the Facesign-create db (Firebase project: `facesign-sandbox`) and calls `facesign-api` session/create endpoint. Our api returns the session object and client secret. The backend (`facesign-ff`) saves the session object onto database (`facesign-dev` or `Facesign` (production)) and returns client secret to the wrapper page. Th wrapper page renders Facesign frontend in an iframe using the client secret.