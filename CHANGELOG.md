# Changelog

All notable changes to the Facesign API will be documented in this file.

## [1.0.44] - 2026-08-05

### Breaking

- `FSLivenessDetectionOutcome` gains a fourth member, `INCONCLUSIVE` (`"inconclusive"`).
  Because `FSLivenessDetectionNode.outcomes` is `Record<FSLivenessDetectionOutcome, FSNodeId>`,
  **every flow builder on this version must supply the `inconclusive` edge** — code that
  builds a liveness node with only the three previous outcomes no longer type-checks.
  An inconclusive check means the detector produced no verdict (it could not decide, did
  not run, or there was nothing to analyze); it is a failure of the check, not of the user,
  and where it routes is now your decision instead of ours.

  Flows submitted without the edge are still accepted at runtime: the missing outcome is
  filled with the node's `noFace` target, recorded in `SessionSettings.flowNormalizations`
  and reported in `CreateSessionResponse.warnings`. Treat that as a migration aid, not as
  the answer — a filled edge is our guess, not the flow author's decision.

### Added

- `ControlsCustomization.captionsOpenedByDefault` — optional. `true` opens the transcript
  (closed-captions) panel at session start; omitted or `false` keeps today's closed state.
  The user can still toggle the panel with the CC button either way. Ignored when
  `showUxControls` is `false`, which is the master switch for the whole control panel.
- `LivenessDetectionNodeReport.inconclusiveReason` and the `LivenessInconclusiveReason`
  type (`"no_media" | "unusable_media" | "unknown_verdict" | "timeout" | "provider_error"`),
  set only when the node outcome is `inconclusive`.
- `DeepfakeDetectionStatus` and `SessionReport.deepfakeDetectionStatus` —
  `pending | succeeded | failed | timed_out` plus `startedAt` / `finishedAt` / `errorCode`.
  This distinguishes "the post-session analysis ran and found nothing" from "the analysis
  never produced a result". Absent when the analysis was not requested.
- `WebhookType.ANALYSIS_DEEPFAKE` (`"analysis.deepfake"`) — fired when post-session deepfake
  analysis reaches a terminal state. Doorbell-only: refetch the session for the verdict.
- `SessionSettings.flowNormalizations` (read-only) and `CreateSessionResponse.warnings`.

## [1.0.41] - 2026-05-14

### Added

- Transcript data extraction:
  - `SessionSettings.extractionSchema` — optional array of `ExtractionField` describing which fields to extract from the session transcript using an LLM.
  - `ExtractionField` — `{ fieldName, type, description, enum? }`. Supported types: `"string"`, `"number"`, `"boolean"`, `"date"` (date is returned as an ISO 8601 string). Optional `enum` constrains the LLM to a fixed set of string values.
  - `SessionReport.extractedData` — `Record<string, string | number | boolean | null>` with the extracted values. Every field is optional; missing data is returned as `null`.
- `FSEnterEmailNode.prompt` — optional phrase the avatar speaks at the moment the email input field appears.

## [1.0.40] - 2026-04-14

### Changed

- `Client` no longer selects the server URL based on the API key prefix (`sk_live_` / `sk_test_`). If `serverUrl` is not provided in options, `https://api.facesign.ai` is used regardless of the key prefix.

## [1.0.29] - 2026-01-29

- VideoAIAnalysis object keys can be extended with any string key

## [1.0.16] - 2025-01-29

### Added

- Two-Factor Authentication node support:
  - `FSTwoFactorChannel` enum with EMAIL and SMS channel options
  - `FSTwoFactorContactSource` enum for session_data, module_settings, and recognition_match sources
  - `FSTwoFactorOutcome` enum with verified, delivery_failed, failed_unverified, cancelled, and error outcomes
  - `FSTwoFactorNode` interface with comprehensive configuration options including:
    - Multi-channel delivery (Email via Resend, SMS via Twilio)
    - Contact source configuration with field mapping
    - Template system with variable support ({{userName}}, {{code}}, {{companyName}})
    - Verification settings (OTP length, expiry, max attempts, resend delay)
  - `FSPhraseAction.START_TWO_FACTOR_VERIFICATION` action for conversation flow integration
  - `FSClientEvent.TWO_FACTOR_CODE_SPOKEN` event for spoken code verification

## [1.0.15] - 2025-01-28

### Added

- Advanced configuration options for Face Scan node:
  - `captureDelay` - Configurable countdown before capture (0 for immediate)
  - `detectionInterval` - How often to check for faces (performance tuning)
  - `qualityThreshold` - Overall face quality score requirement
  - `blurThreshold` - Clarity detection threshold (lower = stricter)
  - `minFaceSize` / `maxFaceSize` - Acceptable face size range in pixels
  - `enableSound` - Toggle audio feedback
  - `enableHaptics` - Toggle haptic feedback on mobile
  - `useWebGL` - Control WebGL acceleration usage
  - `maxRetries` - Maximum capture attempts allowed

## [1.0.14] - 2025-01-28

### Added

- Localization support for permissions screen text:
  - `permissionsButtonTextTranslates` - Localized button text per language
  - `permissionsMainHeadingTranslates` - Localized main heading per language
  - `permissionsSubheadingTranslates` - Localized subheading per language

### Changed

- Kept original non-localized fields for backward compatibility

## [1.0.13] - 2025-01-28

### Added

- Face Scan mode enum (`FSFaceScanMode`) with CAPTURE and COMPARE modes
- Enhanced `FSFaceScanNode` interface with mode-based configuration
- `saveToField` option for capture-only mode to store face image URL
- `CAPTURED` outcome for capture-only face scan mode

### Changed

- Reorganized `FSFaceScanOutcome` enum to separate capture and compare mode outcomes
- Updated `FSFaceScanNode` to support both capture-only and capture+compare modes

## [1.0.12] - 2025-01-27

### Added

- Face Scan node type (`FACE_SCAN`) for 1:1 biometric face matching
- `FSFaceScanOutcome` enum with match outcomes (match, noMatch, noFace, error)
- `FSFaceScanNode` interface with configuration for reference image sources and matching threshold

## [1.0.11] - 2025-01-27

### Added

- Permissions screen customization options to `SessionSettings`:
  - `permissionsButtonText` - Custom text for the permissions request button
  - `permissionsBackgroundType` - Choose between 'avatar' or 'color' background
  - `permissionsBackgroundColor` - Custom color when using solid color background
  - `permissionsMainHeading` - Custom main heading text (e.g., "You're about to chat with a digital assistant.")
  - `permissionsSubheading` - Custom subheading text (e.g., "Allow FaceSign to use your camera and microphone?")

## [1.0.10] - 2024-05-20

### Added

- Document Scanning node type (`DOCUMENT_SCAN`) to support Microblink document scanning integration
- New `MicroblinkDocumentType` enum with supported document types
- `FSDocumentScanOutcome` enum for tracking scan outcomes
- `FSDocumentScanNode` interface with configuration options for document scanning

### Changed

- Updated `FSNode` union type to include the new DocumentScan node type

## [1.0.9] - Previous version

Initial version with support for:

- Start/End nodes
- Conversation nodes
- Liveness Detection nodes
- Email Input nodes
- Data Validation nodes
