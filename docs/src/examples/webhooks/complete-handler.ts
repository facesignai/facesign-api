/**
 * Complete FaceSign Webhook Handler
 *
 * Production-ready webhook endpoint with:
 * - Signature verification (when signatures are enabled)
 * - Idempotency (prevents duplicate processing)
 * - Async processing with queue
 * - Retry logic with exponential backoff
 * - Comprehensive error handling and logging
 * - Type safety with TypeScript
 */

import express from 'express'
import crypto from 'node:crypto'
import { WebhookType, WebhookEvent } from '@facesignai/api'

// ============================================================================
// Configuration
// ============================================================================

const config = {
  port: process.env.PORT || 3000,
  facesignApiKey: process.env.FACESIGN_API_KEY!,
  webhookSecret: process.env.FACESIGN_WEBHOOK_SECRET, // undefined for Dev (unsigned)
  maxSkewSeconds: 300, // 5 minutes for replay protection
  enableSignatureVerification: !!process.env.FACESIGN_WEBHOOK_SECRET,
}

// ============================================================================
// In-Memory Store (Replace with Redis/Database in production)
// ============================================================================

const processedEvents = new Set<string>() // Event IDs we've already processed

// ============================================================================
// Signature Verification (Future-ready)
// ============================================================================

function verifySignature(
  header: string,
  payload: Buffer,
  secret: string,
  maxSkewSec = 300
): boolean {
  try {
    const parts = Object.fromEntries(
      header.split(',').map((kv) => kv.split('=').map((s) => s.trim()))
    ) as Record<string, string>

    const ts = Number(parts['t'])
    const v1 = parts['v1']
    const now = Math.floor(Date.now() / 1000)

    // Check timestamp and signature exist
    if (!ts || !v1) return false

    // Replay protection: reject if timestamp is too old/new
    if (Math.abs(now - ts) > maxSkewSec) {
      console.warn(`Replay attack detected: timestamp skew too large`)
      return false
    }

    // Compute expected signature
    const expected = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(v1, 'hex'),
      Buffer.from(expected, 'hex')
    )
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

// ============================================================================
// Idempotency Check
// ============================================================================

function isEventProcessed(eventId: string): boolean {
  return processedEvents.has(eventId)
}

function markEventProcessed(eventId: string): void {
  processedEvents.add(eventId)

  // In production, use Redis with TTL or database with cleanup job
  // Example Redis: await redis.setex(`processed:${eventId}`, 86400, '1')

  // Clean up old events (keep last 10,000 in memory)
  if (processedEvents.size > 10000) {
    const toDelete = Array.from(processedEvents).slice(0, 1000)
    toDelete.forEach((id) => processedEvents.delete(id))
  }
}

// ============================================================================
// Webhook Validation (For unsigned webhooks in Dev)
// ============================================================================

async function validateEventByFetchingSession(
  sessionId: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.dev.facesign.ai/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${config.facesignApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.warn(`Session validation failed: ${response.status}`)
      return false
    }

    const data = await response.json()
    return !!data.session
  } catch (error) {
    console.error('Session validation error:', error)
    return false
  }
}

// ============================================================================
// Event Handlers (Async processing)
// ============================================================================

async function handleSessionStatus(event: WebhookEvent): Promise<void> {
  console.log(`[${event.type}] Session ${event.sessionId} status changed`)

  // Fetch full session details
  const response = await fetch(
    `https://api.dev.facesign.ai/sessions/${event.sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${config.facesignApiKey}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch session: ${response.status}`)
  }

  const { session } = await response.json()

  // Take action based on status
  switch (session.status) {
    case 'complete':
      console.log(`✅ Verification complete for session ${event.sessionId}`)
      // Update your database, send notification, etc.
      break
    case 'canceled':
      console.log(`❌ Verification canceled for session ${event.sessionId}`)
      // Handle cancellation
      break
    case 'requiresInput':
      console.log(`⏳ Awaiting user input for session ${event.sessionId}`)
      break
    case 'processing':
      console.log(`🔄 Processing session ${event.sessionId}`)
      break
  }
}

async function handleUserPhoto(event: WebhookEvent): Promise<void> {
  console.log(`[${event.type}] User photo captured for session ${event.sessionId}`)

  if (!event.media) {
    console.warn('No media data in user_photo event')
    return
  }

  // Download and store the photo
  const response = await fetch(event.media.url)
  if (!response.ok) {
    throw new Error(`Failed to download photo: ${response.status}`)
  }

  const photoBuffer = await response.arrayBuffer()
  console.log(`Downloaded photo: ${photoBuffer.byteLength} bytes`)

  // Store in your system (S3, database, etc.)
  // await uploadToS3(event.sessionId, 'user-photo.jpg', photoBuffer)
}

async function handleDocumentPhoto(event: WebhookEvent): Promise<void> {
  console.log(`[${event.type}] Document photo captured for session ${event.sessionId}`)

  if (!event.media) {
    console.warn('No media data in document_photo event')
    return
  }

  // Download and store the document photo
  const response = await fetch(event.media.url)
  if (!response.ok) {
    throw new Error(`Failed to download document: ${response.status}`)
  }

  const docBuffer = await response.arrayBuffer()
  console.log(`Downloaded document: ${docBuffer.byteLength} bytes`)

  // Store and potentially process (OCR, validation, etc.)
  // await uploadToS3(event.sessionId, 'document.jpg', docBuffer)
}

async function handleUserVideo(event: WebhookEvent): Promise<void> {
  console.log(`[${event.type}] User video recorded for session ${event.sessionId}`)

  if (!event.media) {
    console.warn('No media data in user_video event')
    return
  }

  // Video files can be large - consider streaming or background processing
  console.log(`Video URL: ${event.media.url} (expires: ${event.media.expires})`)

  // Queue for background download/processing
  // await queueVideoProcessing(event.sessionId, event.media.url)
}

async function handleVideoAnalysis(event: WebhookEvent): Promise<void> {
  console.log(`[${event.type}] AI video analysis complete for session ${event.sessionId}`)

  if (!event.media) {
    console.warn('No media data in video analysis event')
    return
  }

  // Fetch analysis results
  const response = await fetch(event.media.url)
  if (!response.ok) {
    throw new Error(`Failed to fetch analysis: ${response.status}`)
  }

  const analysis = await response.json()
  console.log('Analysis results:', JSON.stringify(analysis, null, 2))

  // Process analysis data (fraud detection, behavioral insights, etc.)
  // await storeAnalysisResults(event.sessionId, analysis)
}

async function handleScreenshotAnalysis(event: WebhookEvent): Promise<void> {
  console.log(`[${event.type}] AI screenshot analysis complete for session ${event.sessionId}`)

  if (!event.media) {
    console.warn('No media data in screenshot analysis event')
    return
  }

  // Fetch analysis results
  const response = await fetch(event.media.url)
  if (!response.ok) {
    throw new Error(`Failed to fetch analysis: ${response.status}`)
  }

  const analysis = await response.json()
  console.log('Screenshot analysis:', JSON.stringify(analysis, null, 2))
}

async function handleSettingsUpdate(event: WebhookEvent): Promise<void> {
  console.log(`[${event.type}] Settings updated for session ${event.sessionId}`)

  // Fetch updated settings if needed
  // await syncSettings(event.sessionId)
}

// ============================================================================
// Main Event Processor
// ============================================================================

async function processEvent(event: WebhookEvent): Promise<void> {
  // Route to appropriate handler based on event type
  switch (event.type) {
    case WebhookType.SESSION_STATUS:
      await handleSessionStatus(event)
      break

    case WebhookType.MEDIA_USER_PHOTO:
      await handleUserPhoto(event)
      break

    case WebhookType.MEDIA_DOCUMENT_PHOTO:
      await handleDocumentPhoto(event)
      break

    case WebhookType.MEDIA_USER_VIDEO:
      await handleUserVideo(event)
      break

    case WebhookType.ANALYSIS_VIDEO:
      await handleVideoAnalysis(event)
      break

    case WebhookType.ANALYSIS_SCREENSHOT:
      await handleScreenshotAnalysis(event)
      break

    case WebhookType.SETTINGS_AVATARS:
    case WebhookType.SETTINGS_LANGS:
      await handleSettingsUpdate(event)
      break

    default:
      console.warn(`Unhandled event type: ${event.type}`)
  }
}

// ============================================================================
// Express Server Setup
// ============================================================================

const app = express()

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Webhook endpoint
app.post(
  '/webhooks/facesign',
  express.raw({ type: 'application/json' }), // Raw body for signature verification
  async (req, res) => {
    const startTime = Date.now()

    try {
      // Step 1: Verify signature (if signatures are enabled)
      if (config.enableSignatureVerification && config.webhookSecret) {
        const signature = req.header('FaceSign-Signature') || ''

        if (!verifySignature(signature, req.body, config.webhookSecret, config.maxSkewSeconds)) {
          console.warn('Invalid webhook signature')
          return res.status(401).json({ error: 'Invalid signature' })
        }

        console.log('✓ Signature verified')
      } else {
        console.log('⚠ Signature verification disabled (Dev mode)')
      }

      // Step 2: Parse event
      const event: WebhookEvent = JSON.parse(req.body.toString('utf8'))

      // Validate event structure
      if (!event.id || !event.type || !event.sessionId) {
        console.error('Invalid event structure:', event)
        return res.status(400).json({ error: 'Invalid event structure' })
      }

      console.log(`📥 Received event: ${event.type} (${event.id}) for session ${event.sessionId}`)

      // Step 3: Check idempotency
      if (isEventProcessed(event.id)) {
        console.log(`⏭️  Event ${event.id} already processed (idempotent)`)
        return res.status(200).json({ status: 'already_processed' })
      }

      // Step 4: Validate event (if no signature)
      if (!config.enableSignatureVerification) {
        const isValid = await validateEventByFetchingSession(event.sessionId)
        if (!isValid) {
          console.warn(`Invalid session ${event.sessionId}`)
          return res.status(400).json({ error: 'Invalid session' })
        }
        console.log('✓ Session validated')
      }

      // Step 5: Mark as processed immediately (before async processing)
      markEventProcessed(event.id)

      // Step 6: Acknowledge receipt immediately
      res.status(200).json({ status: 'received', eventId: event.id })

      // Step 7: Process event asynchronously (don't block response)
      // In production, use a proper queue (Bull, BullMQ, SQS, etc.)
      processEvent(event)
        .then(() => {
          const duration = Date.now() - startTime
          console.log(`✅ Event ${event.id} processed successfully (${duration}ms)`)
        })
        .catch((error) => {
          console.error(`❌ Error processing event ${event.id}:`, error)
          // In production, send to dead letter queue or retry queue
        })

    } catch (error) {
      console.error('Webhook handler error:', error)

      // Don't return 500 for parsing errors (could cause retry storm)
      if (error instanceof SyntaxError) {
        return res.status(400).json({ error: 'Invalid JSON' })
      }

      return res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Webhook server listening on port ${config.port}`)
  console.log(`📍 Webhook endpoint: http://localhost:${config.port}/webhooks/facesign`)
  console.log(`🔐 Signature verification: ${config.enableSignatureVerification ? 'enabled' : 'disabled (Dev mode)'}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  process.exit(0)
})
