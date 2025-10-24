/**
 * Webhook Retry Logic with Exponential Backoff
 *
 * Demonstrates how to handle webhook processing failures with:
 * - Exponential backoff (1s, 2s, 4s, 8s, 16s...)
 * - Maximum retry attempts
 * - Dead letter queue for permanent failures
 * - Retry tracking and metrics
 * - Circuit breaker pattern
 */

import { WebhookEvent } from '@facesignai/api'

// ============================================================================
// Retry Configuration
// ============================================================================

interface RetryConfig {
  maxAttempts: number
  initialDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
  timeout: number
}

const retryConfig: RetryConfig = {
  maxAttempts: 5,
  initialDelayMs: 1000, // 1 second
  maxDelayMs: 32000, // 32 seconds
  backoffMultiplier: 2,
  timeout: 30000, // 30 seconds per attempt
}

// ============================================================================
// Retry State Tracking
// ============================================================================

interface RetryState {
  eventId: string
  attempt: number
  lastError?: string
  lastAttemptAt?: number
  nextRetryAt?: number
}

// In-memory storage (use Redis or database in production)
const retryQueue = new Map<string, RetryState>()

// ============================================================================
// Exponential Backoff Calculator
// ============================================================================

function calculateBackoff(attempt: number, config: RetryConfig): number {
  const delay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt - 1)
  return Math.min(delay, config.maxDelayMs)
}

function addJitter(delayMs: number, jitterPercent: number = 0.1): number {
  const jitter = delayMs * jitterPercent * (Math.random() * 2 - 1)
  return Math.max(0, delayMs + jitter)
}

// ============================================================================
// Retry Logic
// ============================================================================

async function processWithRetry<T>(
  fn: () => Promise<T>,
  eventId: string,
  context: string
): Promise<T> {
  let attempt = 1
  let lastError: Error | null = null

  // Get existing retry state or create new
  const state: RetryState = retryQueue.get(eventId) || {
    eventId,
    attempt: 0,
  }

  while (attempt <= retryConfig.maxAttempts) {
    try {
      console.log(`[${context}] Attempt ${attempt}/${retryConfig.maxAttempts} for event ${eventId}`)

      // Execute with timeout
      const result = await Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), retryConfig.timeout)
        ),
      ])

      // Success - remove from retry queue
      retryQueue.delete(eventId)
      console.log(`✅ [${context}] Success on attempt ${attempt}`)

      return result
    } catch (error) {
      lastError = error as Error
      state.attempt = attempt
      state.lastError = lastError.message
      state.lastAttemptAt = Date.now()

      console.error(
        `❌ [${context}] Attempt ${attempt}/${retryConfig.maxAttempts} failed:`,
        lastError.message
      )

      // If not last attempt, calculate backoff and retry
      if (attempt < retryConfig.maxAttempts) {
        const backoffMs = calculateBackoff(attempt, retryConfig)
        const delayMs = addJitter(backoffMs)

        state.nextRetryAt = Date.now() + delayMs

        console.log(
          `⏳ [${context}] Retrying in ${Math.round(delayMs / 1000)}s (attempt ${attempt + 1}/${retryConfig.maxAttempts})`
        )

        // Update retry queue
        retryQueue.set(eventId, state)

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delayMs))

        attempt++
      } else {
        // All retries exhausted
        break
      }
    }
  }

  // All retries failed - send to dead letter queue
  console.error(
    `☠️  [${context}] All ${retryConfig.maxAttempts} attempts failed for event ${eventId}`
  )

  await sendToDeadLetterQueue(eventId, state, lastError!)

  throw new Error(
    `Failed after ${retryConfig.maxAttempts} attempts: ${lastError?.message}`
  )
}

// ============================================================================
// Dead Letter Queue
// ============================================================================

interface DeadLetterItem {
  eventId: string
  attempts: number
  firstAttemptAt: number
  lastAttemptAt: number
  lastError: string
  event?: WebhookEvent
}

// In production, use SQS DLQ, Redis, or database
const deadLetterQueue: DeadLetterItem[] = []

async function sendToDeadLetterQueue(
  eventId: string,
  state: RetryState,
  error: Error
): Promise<void> {
  const dlqItem: DeadLetterItem = {
    eventId,
    attempts: state.attempt,
    firstAttemptAt: state.lastAttemptAt! - (state.attempt - 1) * 1000, // approximate
    lastAttemptAt: state.lastAttemptAt!,
    lastError: error.message,
  }

  deadLetterQueue.push(dlqItem)

  console.error(`📬 Sent event ${eventId} to dead letter queue`)

  // In production, also:
  // - Send alert/notification
  // - Log to error tracking (Sentry, Datadog, etc.)
  // - Store for manual review
  // await alertOps(`Webhook event ${eventId} failed after ${state.attempt} retries`)
}

// ============================================================================
// Circuit Breaker Pattern (Optional)
// ============================================================================

class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: 'closed' | 'open' | 'half-open' = 'closed'

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000, // 1 minute
    private resetTimeout: number = 30000 // 30 seconds
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      // Check if we should try again (half-open)
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        console.log('🔧 Circuit breaker: Trying half-open state')
        this.state = 'half-open'
      } else {
        throw new Error('Circuit breaker is open')
      }
    }

    try {
      const result = await fn()

      // Success - reset circuit breaker
      if (this.state === 'half-open') {
        console.log('✅ Circuit breaker: Closed (recovered)')
        this.state = 'closed'
      }
      this.failures = 0

      return result
    } catch (error) {
      this.failures++
      this.lastFailureTime = Date.now()

      // Open circuit if threshold exceeded
      if (this.failures >= this.threshold) {
        console.error(
          `⚡ Circuit breaker: OPEN (${this.failures} failures, cooling down for ${this.resetTimeout}ms)`
        )
        this.state = 'open'
      }

      throw error
    }
  }

  getState(): 'closed' | 'open' | 'half-open' {
    return this.state
  }

  getFailures(): number {
    return this.failures
  }
}

// Global circuit breaker for all webhook processing
const webhookCircuitBreaker = new CircuitBreaker(5, 60000, 30000)

// ============================================================================
// Example Usage with Webhook Processing
// ============================================================================

async function processWebhookWithRetry(event: WebhookEvent): Promise<void> {
  // Wrap processing with retry logic and circuit breaker
  await processWithRetry(
    async () => {
      // Use circuit breaker to prevent overwhelming failing services
      return await webhookCircuitBreaker.execute(async () => {
        // Your actual processing logic here
        await processWebhookEvent(event)
      })
    },
    event.id,
    `webhook:${event.type}`
  )
}

async function processWebhookEvent(event: WebhookEvent): Promise<void> {
  // Simulate processing that might fail
  console.log(`Processing event ${event.id} of type ${event.type}`)

  // Simulate random failures for demonstration
  if (Math.random() < 0.3) {
    throw new Error(`Simulated failure for event ${event.id}`)
  }

  // Simulate actual processing
  await new Promise((resolve) => setTimeout(resolve, 100))

  console.log(`Event ${event.id} processed successfully`)
}

// ============================================================================
// Retry Queue Management
// ============================================================================

// Process pending retries (run this periodically)
async function processRetryQueue(): Promise<void> {
  const now = Date.now()

  for (const [eventId, state] of retryQueue.entries()) {
    if (state.nextRetryAt && state.nextRetryAt <= now) {
      console.log(`🔄 Processing pending retry for event ${eventId}`)

      // Remove from queue before retrying (will be re-added if fails)
      retryQueue.delete(eventId)

      // Retry the event
      // In production, fetch the event data from storage
      // await processWebhookWithRetry(fetchEvent(eventId))
    }
  }
}

// Run retry queue processor every 10 seconds
setInterval(processRetryQueue, 10000)

// ============================================================================
// Monitoring and Metrics
// ============================================================================

function getRetryMetrics() {
  return {
    queueSize: retryQueue.size,
    deadLetterQueueSize: deadLetterQueue.length,
    circuitBreakerState: webhookCircuitBreaker.getState(),
    circuitBreakerFailures: webhookCircuitBreaker.getFailures(),
    pendingRetries: Array.from(retryQueue.values()).map((state) => ({
      eventId: state.eventId,
      attempt: state.attempt,
      nextRetryIn: state.nextRetryAt
        ? Math.max(0, state.nextRetryAt - Date.now())
        : 0,
    })),
  }
}

// Expose metrics endpoint
export function setupMetricsEndpoint(app: any) {
  app.get('/metrics/webhooks', (_req: any, res: any) => {
    res.json(getRetryMetrics())
  })
}

// ============================================================================
// Export for use in webhook handler
// ============================================================================

export {
  processWithRetry,
  processWebhookWithRetry,
  webhookCircuitBreaker,
  getRetryMetrics,
  retryQueue,
  deadLetterQueue,
}
