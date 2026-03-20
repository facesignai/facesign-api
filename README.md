<div align="center">
	<h1>Facesign SDK for Node JS</h1>
	<p>
		<b>A simple and easy to use client for the <a href="https://docs.facesign.ai">Facesign API</a></b>
	</p>
	<br>
</div>

## Installation

```
npm install @facesignai/api
yarn add @facesignai/api
```

## Usage

Import and initialize a client using an **integration token**

```js
const { Client } = require("@facesignai/api")

// Initializing a client
const facesignClient = new Client({
  auth: process.env.FACESIGN_TOKEN,
})
```

Make a request to any Facesign API endpoint.

## Flow & Nodes

A flow is a directed graph of nodes that defines a session. Sessions can serve different purposes — identity verification, data collection, authorization, analysis, or any combination. Every flow must start with a **START** node and end with one or more **END** nodes. Nodes connect to each other via **outcomes** — each outcome points to the `id` of the next node. All defined outcomes must be connected to other nodes; no outcome can be left unlinked.

### START Node

The entry point of every flow. Each flow must have exactly one START node. It has a single `outcome` that points to the first node in the flow.

```typescript
{
  id: "start",
  type: "start",
  outcome: "next-node-id"
}
```

### END Node

The terminal node of a flow. A flow can have multiple END nodes (e.g., one for success path, one for failure path). It has no outcomes.

```typescript
{
  id: "end-success",
  type: "end"
}
```

### CONVERSATION Node

The avatar speaks to the user using the `prompt` text and routes the flow based on the user's response. The session stays on this node until one of the outcome conditions matches the user's response, so a single conversation node can facilitate a multi-turn dialog with the user until the desired information is gathered.

The `prompt` field supports two modes:

1. **Direct speech** — Tell the avatar exactly what to say:
   `"Say: Hi, how are you doing?"`

2. **Goal-driven behavior** — Describe what the avatar should achieve during the conversation:
   `"Chat with the user and find out how well they understand medicine."`

When using goal-driven prompts, always include realistic exit conditions in the outcomes, since the dialog could otherwise continue indefinitely. Examples of exit conditions:
- User didn't respond after 3 attempts
- The dialog has reached 6 exchanges and no condition was met
- User refuses to answer

Uses conditional outcomes — each outcome has a `condition` (a natural language description of what the user's response should match) and a `targetNodeId` pointing to the next node.

Set `doesNotRequireReply: true` for nodes at the end of the flow where the avatar delivers a final message and no user response is needed (e.g., "Thank you for the conversation, goodbye!"). Typically used before an END node.

**Outcomes** use `FSConditionalOutcome`:
- `id` — unique identifier for the outcome
- `targetNodeId` — the node to navigate to
- `condition` — natural language description of the matching criteria

**Unconditional transition:** When the avatar should say a phrase and move to the next node regardless of the user's response, use a single outcome with an empty `condition` (`""`). This creates an unconditional transition — the avatar delivers the message, and whatever the user replies (or even if they don't), the flow proceeds to `targetNodeId`.

**Direct speech example:**
```typescript
{
  id: "greeting",
  type: "conversation",
  prompt: "Say: Hello! What would you like to do today?",
  outcomes: [
    { id: "verify", targetNodeId: "liveness-node", condition: "User wants to verify their identity" },
    { id: "info", targetNodeId: "info-node", condition: "User wants more information" }
  ]
}
```

**Goal-driven example:**
```typescript
{
  id: "medical-assessment",
  type: "conversation",
  prompt: "Chat with the user and assess their level of medical knowledge.",
  outcomes: [
    { id: "high", targetNodeId: "advanced-path", condition: "User demonstrates strong medical knowledge" },
    { id: "low", targetNodeId: "basic-path", condition: "User has limited medical knowledge" },
    { id: "no-response", targetNodeId: "end-fail", condition: "User didn't respond after 3 attempts" },
    { id: "timeout", targetNodeId: "end-fail", condition: "Dialog reached 6 exchanges with no condition met" },
    { id: "refused", targetNodeId: "end-fail", condition: "User refuses to answer" }
  ]
}
```

**End-of-flow example:**
```typescript
{
  id: "goodbye",
  type: "conversation",
  prompt: "Thank you for the conversation, goodbye!",
  doesNotRequireReply: true,
  outcomes: [
    { id: "done", targetNodeId: "end", condition: "" }
  ]
}
```

### PERMISSIONS Node

Requests camera and/or microphone permissions from the user before proceeding. Use this node when you need to display a custom prompt explaining why permissions are needed, or when you want to handle the denied case with a specific flow path.

If the flow does not contain any PERMISSIONS node, permissions will be requested automatically.

- `permissions.camera` — request camera access
- `permissions.microphone` — request microphone access
- `prompt` — optional message the avatar will say (uses direct speech mode, e.g., `"Say: Could you please enable your microphone so I can hear you."`). If the site already has permanent permissions granted, the avatar will not say this phrase and the flow will continue directly via the `permissionsGranted` outcome.

**Outcomes:**
- `permissionsGranted` — user granted the requested permissions (or they were already granted)
- `permissionsDenied` — user denied the permissions

```typescript
{
  id: "request-permissions",
  type: "permissions",
  prompt: "Say: Could you please enable your camera and microphone so we can proceed.",
  permissions: {
    camera: true,
    microphone: true
  },
  outcomes: {
    permissionsGranted: "next-node-id",
    permissionsDenied: "end-denied"
  }
}
```

### LIVENESS_DETECTION Node

Checks whether the user in front of the camera is a real person or a deepfake. The node analyzes the video feed to perform liveness detection.

**Prerequisites:** The user must have camera access granted before this node. Additionally, liveness detection requires several seconds of video recording for analysis. Do not place this node immediately after a PERMISSIONS node — instead, add a CONVERSATION node in between to give the system time to accumulate video data for analysis.

**Recommended flow order:**
`PERMISSIONS → CONVERSATION → LIVENESS_DETECTION`

**Outcomes:**
- `livenessDetected` — the user is a real person
- `deepfakeDetected` — a deepfake or spoofing attempt was detected
- `noFace` — no face was detected in the camera feed

```typescript
{
  id: "liveness-check",
  type: "liveness_detection",
  outcomes: {
    livenessDetected: "next-node-id",
    deepfakeDetected: "end-fail",
    noFace: "end-fail"
  }
}
```

### ENTER_EMAIL Node

Displays a UI for the user to enter their email address without any verification or confirmation step. Use this node when you simply need to collect an email from the user as data input. Note: if your goal is to collect AND verify an email via OTP, use TWO_FACTOR_EMAIL instead — it handles email collection internally and does not require a preceding ENTER_EMAIL node.

**Outcomes:**
- `emailEntered` — user submitted their email
- `canceled` — user canceled the email entry

```typescript
{
  id: "collect-email",
  type: "enter_email",
  outcomes: {
    emailEntered: "next-node-id",
    canceled: "end-canceled"
  }
}
```

### DATA_VALIDATION Node

Validates data collected during the session and routes the flow based on the result. Uses a `validation` object to specify which field to check, what action to perform, and an optional expected value.

- `validation.field` — the data field to validate
- `validation.action` — the validation action to perform
- `validation.value` — optional expected value for comparison

Uses conditional outcomes (same as CONVERSATION node) to branch the flow based on the validation result.

```typescript
{
  id: "check-email-domain",
  type: "data_validation",
  validation: {
    field: "email",
    action: "contains",
    value: "@company.com"
  },
  outcomes: [
    { id: "valid", targetNodeId: "next-node-id", condition: "Validation passed" },
    { id: "invalid", targetNodeId: "end-fail", condition: "Validation failed" }
  ]
}
```

### DOCUMENT_SCAN Node

Opens a document scanning UI powered by Microblink. The user can scan identity documents using their camera. Extracted data (name, date of birth, document number, etc.) becomes available in the session report.

- `scanningMode` — determines how to scan the document:
  - `"single"` — scan only one side of the document
  - `"automatic"` — automatically determine how many sides need to be scanned
- `allowedDocumentTypes` — array of document types the user can scan (e.g., `"passport"`, `"id"`, `"dl"`, `"residence-permit"`, `"visa"`, etc.)
- `showTorchButton` — show flashlight toggle (default: true)
- `showCameraSwitch` — show front/back camera toggle (default: true)
- `showMirrorCameraButton` — show mirror camera button (default: true)

**Outcomes:**
- `scanSuccess` — document was scanned successfully
- `userCancelled` — user canceled the scan
- `scanTimeout` — scan timed out

```typescript
{
  id: "scan-id",
  type: "document_scan",
  scanningMode: "automatic",
  allowedDocumentTypes: ["passport", "id", "dl"],
  outcomes: {
    scanSuccess: "next-node-id",
    userCancelled: "end-canceled",
    scanTimeout: "end-fail"
  }
}
```

### RECOGNITION Node

Performs biometric face recognition to identify the user. Compares the user's face against previously registered faces to determine if they are a known or new user.

**Prerequisites:** Requires camera access. Like LIVENESS_DETECTION, needs several seconds of video for analysis — do not place immediately after a PERMISSIONS node. Add a CONVERSATION node in between to accumulate video data.

**Outcomes:**
- `recognized` — the user was matched to a known face
- `newUser` — the user's face was not found in the database (new user)
- `noFace` — no face was detected in the camera feed

```typescript
{
  id: "recognize-user",
  type: "recognition",
  outcomes: {
    recognized: "welcome-back",
    newUser: "registration-flow",
    noFace: "end-fail"
  }
}
```

### FACE_SCAN Node

Performs 1:1 biometric face matching. Captures the user's face and compares it against a reference image to verify their identity.

**Prerequisites:** Requires camera access. Like LIVENESS_DETECTION, needs several seconds of video — do not place immediately after a PERMISSIONS node.

- `captureInstructions` — optional text instructions shown to the user during capture
- `requireLivenessChallenge` — require an active liveness challenge during capture
- `requireAILivenessCheck` — require AI-based liveness verification
- `referenceImageKey` — key identifying the reference image to compare against
- `similarityThreshold` — minimum similarity score (0–1) required for a match
- `enableSound` — enable audio feedback (default: true)
- `enableHaptics` — enable haptic feedback (default: true)

**Outcomes:**
- `passed` — face matched the reference image
- `notPassed` — face did not match
- `cancelled` — user canceled the scan
- `error` — an error occurred during scanning

```typescript
{
  id: "face-verify",
  type: "face_scan",
  referenceImageKey: "document_photo",
  similarityThreshold: 0.8,
  requireAILivenessCheck: true,
  outcomes: {
    passed: "next-node-id",
    notPassed: "end-fail",
    cancelled: "end-canceled",
    error: "end-error"
  }
}
```

### TWO_FACTOR_EMAIL Node

Sends a one-time password (OTP) to the user's email address and verifies the code they enter. This node manages its own sub-flow for collecting the email: if no email was provided via `providedData` or found in `publicRecognition`, the node will automatically prompt the user to enter their email. There is no need to add an ENTER_EMAIL node before this one — email collection is handled internally.

- `otpLength` — number of digits in the OTP (4–8, default: 6)
- `expirySeconds` — how long the OTP is valid (default: 300 / 5 minutes)
- `maxAttempts` — maximum verification attempts (default: 3)
- `resendAfterSeconds` — minimum delay before "Resend" button is enabled
- `showUI` — show on-screen toast notification (default: true)
- `emailTemplate` — optional custom email template

**Outcomes:**
- `verified` — user entered the correct OTP
- `delivery_failed` — OTP could not be delivered
- `failed_unverified` — user exhausted all attempts without verifying
- `cancelled` — user canceled the verification
- `error` — an error occurred

```typescript
{
  id: "email-2fa",
  type: "two_factor_email",
  otpLength: 6,
  expirySeconds: 300,
  maxAttempts: 3,
  outcomes: {
    verified: "next-node-id",
    delivery_failed: "end-fail",
    failed_unverified: "end-fail",
    cancelled: "end-canceled",
    error: "end-error"
  }
}
```

### FACE_COMPARE Node

Compares faces from two different sources to verify they belong to the same person. Unlike FACE_SCAN (which captures a photo and compares it against a single reference), this node takes already-existing images from different session sources and compares them.

**Available sources:**
- `sessionVideo` — a frame captured from the live video feed during the session
- `faceScan` — a higher-quality photo from a FACE_SCAN node (oval capture). Uses the most recent completed FACE_SCAN node in the session.
- `providedData` — an image URL from a `providedData` field. Requires `providedDataKey` to specify which field contains the URL.
- `documentPhoto` — a photo extracted from a scanned document (DOCUMENT_SCAN node). Uses the most recent completed DOCUMENT_SCAN node in the session.

**Configuration:**
- `sourceA` — first image source
- `sourceB` — second image source
- `similarityThreshold` — optional minimum similarity score (0–1) required for a match

**Outcomes:**
- `match` — faces from both sources match
- `noMatch` — faces do not match
- `imageUnavailable` — at least one image could not be obtained (e.g., no person detected on camera, missing `providedData` field, no photo on document, etc.)

**Example — compare live video with a photo from providedData:**
```typescript
{
  id: "compare-faces",
  type: "face_compare",
  sourceA: { source: "sessionVideo" },
  sourceB: { source: "providedData", providedDataKey: "photoUrl" },
  similarityThreshold: 0.8,
  outcomes: {
    match: "next-node-id",
    noMatch: "end-fail",
    imageUnavailable: "end-error"
  }
}
```

**Example — compare face scan capture with document photo:**
```typescript
{
  id: "compare-scan-vs-doc",
  type: "face_compare",
  sourceA: { source: "faceScan" },
  sourceB: { source: "documentPhoto" },
  outcomes: {
    match: "next-node-id",
    noMatch: "end-fail",
    imageUnavailable: "end-error"
  }
}
```

### TWO_FACTOR_SMS Node

Same as TWO_FACTOR_EMAIL but sends the OTP via SMS. This node manages its own sub-flow for collecting the phone number: if no phone number was provided via `providedData` or found in `publicRecognition`, the node will automatically prompt the user to enter their phone number. There is no need to add a separate phone collection node before this one.

- Same configuration options as TWO_FACTOR_EMAIL
- `smsTemplate` — optional custom SMS template (instead of `emailTemplate`)

```typescript
{
  id: "sms-2fa",
  type: "two_factor_sms",
  otpLength: 6,
  expirySeconds: 300,
  maxAttempts: 3,
  outcomes: {
    verified: "next-node-id",
    delivery_failed: "end-fail",
    failed_unverified: "end-fail",
    cancelled: "end-canceled",
    error: "end-error"
  }
}
```
