# Changelog

All notable changes to the Facesign API will be documented in this file.

## [Unreleased]

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
