# Changelog

All notable changes to the Facesign API will be documented in this file.

## [Unreleased]

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
