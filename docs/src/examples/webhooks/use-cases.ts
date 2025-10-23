/**
 * Real-World Webhook Use Cases
 *
 * Practical examples showing how to integrate FaceSign webhooks
 * into common business workflows:
 *
 * 1. KYC Onboarding - Complete identity verification workflow
 * 2. Age Verification - Quick age check for age-gated content
 * 3. Document Verification - ID validation with data extraction
 * 4. Fraud Detection - AI-powered risk assessment
 * 5. Session Lifecycle Tracking - Multi-event aggregation
 * 6. User Authentication - Passwordless login with biometrics
 */

import { WebhookEvent, WebhookType } from '@facesignai/api'

// ============================================================================
// Use Case 1: KYC Onboarding (Financial Services, Crypto Exchanges)
// ============================================================================

/**
 * Complete KYC onboarding flow:
 * 1. User starts verification
 * 2. Capture document + selfie
 * 3. Run AI fraud checks
 * 4. Update user account status
 * 5. Notify compliance team
 */

interface KYCStatus {
  userId: string
  status: 'pending' | 'in_progress' | 'verified' | 'rejected'
  sessionId?: string
  documentVerified: boolean
  livenessVerified: boolean
  fraudScore?: number
  verifiedAt?: Date
  rejectionReason?: string
}

class KYCOnboardingService {
  async handleWebhook(event: WebhookEvent): Promise<void> {
    const userId = await this.getUserIdFromSession(event.sessionId)

    switch (event.type) {
      case WebhookType.SESSION_STATUS:
        await this.handleSessionStatus(event, userId)
        break

      case WebhookType.MEDIA_DOCUMENT_PHOTO:
        await this.handleDocumentCapture(event, userId)
        break

      case WebhookType.MEDIA_USER_PHOTO:
        await this.handleSelfieCapture(event, userId)
        break

      case WebhookType.ANALYSIS_VIDEO:
        await this.handleFraudAnalysis(event, userId)
        break
    }
  }

  private async handleSessionStatus(event: WebhookEvent, userId: string): Promise<void> {
    // Fetch full session to get status
    const { session } = await client.session.retrieve({ sessionId: event.sessionId })

    if (session.status === 'complete') {
      // Extract verification data
      const docReport = session.report?.nodeReports?.find(
        (r) => r.nodeType === 'document_scan'
      )
      const livenessReport = session.report?.nodeReports?.find(
        (r) => r.nodeType === 'liveness_detection'
      )

      const kycStatus: KYCStatus = {
        userId,
        status: 'verified',
        sessionId: session.id,
        documentVerified: docReport?.outcome === 'success',
        livenessVerified: livenessReport?.outcome === 'success',
        verifiedAt: new Date(),
      }

      // Update user account
      await this.updateUserKYCStatus(userId, kycStatus)

      // Send to compliance dashboard
      await this.notifyCompliance({
        userId,
        sessionId: session.id,
        documentData: docReport?.data,
        livenessResult: livenessReport?.outcome,
        timestamp: new Date(),
      })

      // Send confirmation email to user
      await this.sendVerificationEmail(userId, 'success')

      console.log(`✅ KYC verification complete for user ${userId}`)
    } else if (session.status === 'canceled') {
      await this.updateUserKYCStatus(userId, {
        userId,
        status: 'rejected',
        sessionId: session.id,
        documentVerified: false,
        livenessVerified: false,
        rejectionReason: 'User canceled verification',
      })

      await this.sendVerificationEmail(userId, 'canceled')
    }
  }

  private async handleDocumentCapture(event: WebhookEvent, userId: string): Promise<void> {
    if (!event.media?.url) return

    // Download and store document photo
    const response = await fetch(event.media.url)
    const imageBuffer = await response.arrayBuffer()

    // Store in secure storage (S3, GCS, etc.)
    await this.storage.save(`kyc/${userId}/documents/${event.id}.jpg`, imageBuffer, {
      encryption: 'AES256',
      retention: '7_years', // Compliance requirement
    })

    console.log(`📄 Document saved for user ${userId}`)

    // Update KYC status
    await this.updateUserKYCStatus(userId, { documentVerified: true })
  }

  private async handleSelfieCapture(event: WebhookEvent, userId: string): Promise<void> {
    if (!event.media?.url) return

    const response = await fetch(event.media.url)
    const imageBuffer = await response.arrayBuffer()

    await this.storage.save(`kyc/${userId}/selfie/${event.id}.jpg`, imageBuffer, {
      encryption: 'AES256',
    })

    console.log(`🤳 Selfie saved for user ${userId}`)
  }

  private async handleFraudAnalysis(event: WebhookEvent, userId: string): Promise<void> {
    if (!event.media?.url) return

    // Fetch AI analysis results
    const response = await fetch(event.media.url)
    const analysis = await response.json()

    const fraudScore = analysis.fraudScore || 0

    // Store analysis
    await this.db.kycAnalysis.create({
      userId,
      sessionId: event.sessionId,
      fraudScore,
      signals: analysis.signals,
      analyzedAt: new Date(),
    })

    // High fraud score = manual review
    if (fraudScore > 0.7) {
      await this.flagForManualReview(userId, {
        reason: 'High fraud score',
        score: fraudScore,
        signals: analysis.signals,
      })

      await this.notifyCompliance({
        type: 'HIGH_RISK_USER',
        userId,
        fraudScore,
        sessionId: event.sessionId,
      })

      console.log(`⚠️  High fraud score for user ${userId}: ${fraudScore}`)
    }
  }

  // Helper methods (implement based on your stack)
  private async getUserIdFromSession(sessionId: string): Promise<string> {
    // Fetch session and extract clientReferenceId or metadata
    const { session } = await client.session.retrieve({ sessionId })
    return session.settings.clientReferenceId || session.id
  }

  private async updateUserKYCStatus(userId: string, update: Partial<KYCStatus>) {
    // Update in your database
    await db.users.update({ where: { id: userId }, data: { kyc: update } })
  }

  private async notifyCompliance(data: any) {
    // Send to compliance dashboard/Slack/email
    await complianceQueue.add('review', data)
  }

  private async sendVerificationEmail(userId: string, status: string) {
    // Send transactional email
    await emailService.send({ userId, template: `kyc_${status}` })
  }

  private async flagForManualReview(userId: string, data: any) {
    // Add to manual review queue
    await db.reviewQueue.create({ userId, ...data })
  }

  private storage: any // Your storage service (S3, GCS, etc.)
  private db: any // Your database
}

// ============================================================================
// Use Case 2: Age Verification (Gaming, Alcohol, Adult Content)
// ============================================================================

/**
 * Simple age gate verification:
 * - Quick liveness check + document scan
 * - Extract date of birth
 * - Grant/deny access immediately
 */

class AgeVerificationService {
  private readonly minimumAge = 21 // or 18, 13, etc.

  async handleAgeVerification(event: WebhookEvent): Promise<void> {
    if (event.type !== WebhookType.SESSION_STATUS) return

    const { session } = await client.session.retrieve({ sessionId: event.sessionId })

    if (session.status !== 'complete') return

    // Extract DOB from document scan
    const docReport = session.report?.nodeReports?.find(
      (r) => r.nodeType === 'document_scan'
    )

    if (!docReport?.data?.dateOfBirth) {
      console.error('No date of birth found in document scan')
      return
    }

    const dob = new Date(docReport.data.dateOfBirth)
    const age = this.calculateAge(dob)

    const userId = session.settings.clientReferenceId!

    if (age >= this.minimumAge) {
      // Grant access
      await this.grantAccess(userId, {
        verified: true,
        age,
        verifiedAt: new Date(),
        sessionId: session.id,
      })

      // Store age verification record (compliance)
      await this.db.ageVerifications.create({
        userId,
        age,
        dateOfBirth: dob,
        documentType: docReport.data.documentType,
        verifiedAt: new Date(),
        sessionId: session.id,
      })

      console.log(`✅ Age verified: User ${userId} is ${age} years old`)
    } else {
      // Deny access
      await this.denyAccess(userId, {
        reason: 'underage',
        age,
        minimumAge: this.minimumAge,
      })

      console.log(`❌ Access denied: User ${userId} is only ${age} years old`)
    }
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date()
    let age = today.getFullYear() - dateOfBirth.getFullYear()
    const monthDiff = today.getMonth() - dateOfBirth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--
    }

    return age
  }

  private async grantAccess(userId: string, data: any) {
    // Update user session/token with age-verified flag
    await this.redis.set(`user:${userId}:age_verified`, JSON.stringify(data), 'EX', 86400)
  }

  private async denyAccess(userId: string, data: any) {
    // Log denial
    await this.db.accessDenials.create({ userId, ...data })
  }

  private db: any
  private redis: any
}

// ============================================================================
// Use Case 3: Document Verification Only (Background Checks, B2B)
// ============================================================================

/**
 * Document-focused verification:
 * - Capture ID document
 * - Extract all data fields
 * - Validate against external databases
 * - Store for audit trail
 */

interface ExtractedDocumentData {
  firstName: string
  lastName: string
  dateOfBirth: string
  documentNumber: string
  documentType: string
  issuingCountry: string
  expirationDate?: string
  address?: string
  extractedAt: Date
}

class DocumentVerificationService {
  async handleDocumentWebhook(event: WebhookEvent): Promise<void> {
    if (event.type === WebhookType.MEDIA_DOCUMENT_PHOTO) {
      await this.storeDocumentImage(event)
    } else if (event.type === WebhookType.SESSION_STATUS) {
      await this.processDocumentData(event)
    }
  }

  private async storeDocumentImage(event: WebhookEvent): Promise<void> {
    if (!event.media?.url) return

    const response = await fetch(event.media.url)
    const imageBuffer = await response.arrayBuffer()

    // Store original document image
    const path = `documents/${event.sessionId}/${event.id}.jpg`
    await this.storage.save(path, imageBuffer, {
      encryption: true,
      retention: '7_years',
    })

    console.log(`📄 Document image stored: ${path}`)
  }

  private async processDocumentData(event: WebhookEvent): Promise<void> {
    const { session } = await client.session.retrieve({ sessionId: event.sessionId })

    if (session.status !== 'complete') return

    const docReport = session.report?.nodeReports?.find(
      (r) => r.nodeType === 'document_scan'
    )

    if (!docReport?.data) {
      console.error('No document data found')
      return
    }

    // Extract all fields
    const extractedData: ExtractedDocumentData = {
      firstName: docReport.data.firstName,
      lastName: docReport.data.lastName,
      dateOfBirth: docReport.data.dateOfBirth,
      documentNumber: docReport.data.documentNumber,
      documentType: docReport.data.documentType,
      issuingCountry: docReport.data.issuingCountry,
      expirationDate: docReport.data.expirationDate,
      address: docReport.data.address,
      extractedAt: new Date(),
    }

    // Store in database
    await this.db.documents.create({
      sessionId: session.id,
      userId: session.settings.clientReferenceId,
      ...extractedData,
    })

    // Validate against external databases
    const validation = await this.validateDocument(extractedData)

    if (!validation.valid) {
      console.warn(`⚠️  Document validation failed: ${validation.reason}`)

      await this.db.documents.update({
        where: { sessionId: session.id },
        data: {
          validationStatus: 'failed',
          validationReason: validation.reason,
        },
      })

      // Notify admin
      await this.notifyAdmin({
        type: 'DOCUMENT_VALIDATION_FAILED',
        sessionId: session.id,
        reason: validation.reason,
      })
    } else {
      console.log(`✅ Document validated successfully`)

      await this.db.documents.update({
        where: { sessionId: session.id },
        data: { validationStatus: 'valid' },
      })
    }
  }

  private async validateDocument(data: ExtractedDocumentData): Promise<any> {
    // Validate against external APIs (Checkr, etc.)
    // Check expiration date
    if (data.expirationDate && new Date(data.expirationDate) < new Date()) {
      return { valid: false, reason: 'Document expired' }
    }

    // Check format
    if (!this.isValidDocumentNumber(data.documentNumber, data.documentType)) {
      return { valid: false, reason: 'Invalid document number format' }
    }

    return { valid: true }
  }

  private isValidDocumentNumber(number: string, type: string): boolean {
    // Implement format validation based on document type
    return true
  }

  private async notifyAdmin(data: any) {
    await adminQueue.add('alert', data)
  }

  private storage: any
  private db: any
}

// ============================================================================
// Use Case 4: Session Lifecycle Tracking (Analytics, Monitoring)
// ============================================================================

/**
 * Track complete session journey:
 * - Aggregate all events for a session
 * - Calculate completion time
 * - Track drop-off points
 * - Generate analytics
 */

interface SessionLifecycle {
  sessionId: string
  userId?: string
  startedAt?: Date
  completedAt?: Date
  canceledAt?: Date
  events: Array<{
    type: string
    timestamp: Date
    eventId: string
  }>
  status: 'started' | 'in_progress' | 'completed' | 'canceled'
  duration?: number
  mediaCount: number
  nodeOutcomes: Record<string, string>
}

class SessionTrackingService {
  private sessions = new Map<string, SessionLifecycle>()

  async trackWebhook(event: WebhookEvent): Promise<void> {
    const sessionId = event.sessionId
    let lifecycle = this.sessions.get(sessionId)

    if (!lifecycle) {
      lifecycle = {
        sessionId,
        events: [],
        status: 'started',
        startedAt: new Date(event.createdAt * 1000),
        mediaCount: 0,
        nodeOutcomes: {},
      }
      this.sessions.set(sessionId, lifecycle)
    }

    // Add event
    lifecycle.events.push({
      type: event.type,
      timestamp: new Date(event.createdAt * 1000),
      eventId: event.id,
    })

    // Count media events
    if (event.type.startsWith('media.')) {
      lifecycle.mediaCount++
    }

    // Handle session status changes
    if (event.type === WebhookType.SESSION_STATUS) {
      const { session } = await client.session.retrieve({ sessionId })

      lifecycle.status =
        session.status === 'complete'
          ? 'completed'
          : session.status === 'canceled'
            ? 'canceled'
            : 'in_progress'

      if (session.status === 'complete') {
        lifecycle.completedAt = new Date()
        lifecycle.duration = lifecycle.completedAt.getTime() - lifecycle.startedAt!.getTime()

        // Extract node outcomes
        session.report?.nodeReports?.forEach((report) => {
          lifecycle!.nodeOutcomes[report.nodeType] = report.outcome
        })

        // Store complete lifecycle
        await this.saveLifecycle(lifecycle)

        // Generate analytics
        await this.generateAnalytics(lifecycle)

        console.log(
          `📊 Session ${sessionId} completed in ${(lifecycle.duration / 1000).toFixed(1)}s`
        )
      } else if (session.status === 'canceled') {
        lifecycle.canceledAt = new Date()
        await this.saveLifecycle(lifecycle)

        console.log(`🚫 Session ${sessionId} canceled`)
      }
    }
  }

  private async saveLifecycle(lifecycle: SessionLifecycle) {
    await this.db.sessionLifecycles.create({ data: lifecycle })

    // Clean up from memory
    this.sessions.delete(lifecycle.sessionId)
  }

  private async generateAnalytics(lifecycle: SessionLifecycle) {
    const analytics = {
      sessionId: lifecycle.sessionId,
      duration: lifecycle.duration,
      mediaCount: lifecycle.mediaCount,
      eventCount: lifecycle.events.length,
      completedAt: lifecycle.completedAt,

      // Calculate funnel metrics
      docScanSuccess: lifecycle.nodeOutcomes['document_scan'] === 'success',
      livenessSuccess: lifecycle.nodeOutcomes['liveness_detection'] === 'success',

      // User flow
      dropOffPoint: lifecycle.status === 'canceled' ? this.findDropOffPoint(lifecycle) : null,
    }

    await this.db.analytics.create({ data: analytics })
  }

  private findDropOffPoint(lifecycle: SessionLifecycle): string {
    // Analyze events to find where user dropped off
    const lastEvent = lifecycle.events[lifecycle.events.length - 1]
    return lastEvent.type
  }

  private db: any
}

// ============================================================================
// Use Case 5: Passwordless Authentication (Login, MFA)
// ============================================================================

/**
 * Biometric login flow:
 * 1. User initiates login
 * 2. FaceSign liveness check
 * 3. Compare against stored biometric
 * 4. Issue auth token
 */

class BiometricAuthService {
  async handleAuthWebhook(event: WebhookEvent): Promise<void> {
    if (event.type !== WebhookType.SESSION_STATUS) return

    const { session } = await client.session.retrieve({ sessionId: event.sessionId })

    if (session.status !== 'complete') return

    const userId = session.settings.clientReferenceId!

    // Check liveness passed
    const livenessReport = session.report?.nodeReports?.find(
      (r) => r.nodeType === 'liveness_detection'
    )

    if (livenessReport?.outcome !== 'success') {
      console.log(`❌ Liveness check failed for user ${userId}`)
      await this.notifyUser(userId, 'login_failed')
      return
    }

    // Check face recognition matched stored biometric
    const recognitionReport = session.report?.nodeReports?.find(
      (r) => r.nodeType === 'recognition'
    )

    if (recognitionReport?.outcome === 'match') {
      // Issue auth token
      const token = await this.issueAuthToken(userId)

      // Store session
      await this.redis.set(`auth:${token}`, userId, 'EX', 3600)

      console.log(`✅ User ${userId} authenticated via biometrics`)

      // Send token to user's device
      await this.sendAuthToken(userId, token)
    } else {
      console.log(`❌ Face recognition failed for user ${userId}`)
      await this.notifyUser(userId, 'login_failed')
    }
  }

  private async issueAuthToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' })
  }

  private async sendAuthToken(userId: string, token: string) {
    // Send via push notification or SMS
    await notificationService.send({ userId, type: 'auth_token', token })
  }

  private async notifyUser(userId: string, type: string) {
    await notificationService.send({ userId, type })
  }

  private redis: any
}

// ============================================================================
// Export All Services
// ============================================================================

export {
  KYCOnboardingService,
  AgeVerificationService,
  DocumentVerificationService,
  SessionTrackingService,
  BiometricAuthService,
}

// ============================================================================
// Usage Example: Complete Integration
// ============================================================================

/**
 * Example: Integrate all services into a single webhook handler
 */

import express from 'express'

const app = express()

const kycService = new KYCOnboardingService()
const ageService = new AgeVerificationService()
const docService = new DocumentVerificationService()
const trackingService = new SessionTrackingService()
const authService = new BiometricAuthService()

app.post('/webhooks/facesign', express.json(), async (req, res) => {
  const event: WebhookEvent = req.body

  try {
    // Route to appropriate service based on metadata or clientReferenceId
    const { session } = await client.session.retrieve({ sessionId: event.sessionId })
    const flowType = session.settings.metadata?.flowType

    // Track all sessions
    await trackingService.trackWebhook(event)

    // Route to specific service
    switch (flowType) {
      case 'kyc':
        await kycService.handleWebhook(event)
        break
      case 'age_verification':
        await ageService.handleAgeVerification(event)
        break
      case 'document_only':
        await docService.handleDocumentWebhook(event)
        break
      case 'biometric_auth':
        await authService.handleAuthWebhook(event)
        break
      default:
        console.log(`Unknown flow type: ${flowType}`)
    }

    res.status(200).json({ received: true, eventId: event.id })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000')
})
