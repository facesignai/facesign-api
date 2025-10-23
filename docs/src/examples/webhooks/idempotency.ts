/**
 * Webhook Idempotency Implementation
 *
 * Ensures webhooks are processed exactly once, even if delivered multiple times.
 *
 * Strategies covered:
 * - In-memory Set (simple, for development)
 * - Redis (recommended for production)
 * - Database (PostgreSQL/MySQL)
 * - Hybrid approach (memory + persistent storage)
 *
 * Also includes:
 * - TTL for automatic cleanup
 * - Concurrent request handling
 * - Performance optimization
 */

import { WebhookEvent } from '@facesignai/api'
import crypto from 'node:crypto'

// ============================================================================
// Strategy 1: In-Memory Set (Development Only)
// ============================================================================

class InMemoryIdempotencyStore {
  private processedEvents = new Set<string>()
  private readonly maxSize: number
  private readonly cleanupThreshold: number

  constructor(maxSize = 10000, cleanupThreshold = 1000) {
    this.maxSize = maxSize
    this.cleanupThreshold = cleanupThreshold
  }

  async isProcessed(eventId: string): Promise<boolean> {
    return this.processedEvents.has(eventId)
  }

  async markProcessed(eventId: string): Promise<void> {
    this.processedEvents.add(eventId)

    // Cleanup old events when threshold reached
    if (this.processedEvents.size > this.maxSize) {
      const toDelete = Array.from(this.processedEvents).slice(0, this.cleanupThreshold)
      toDelete.forEach((id) => this.processedEvents.delete(id))
      console.log(`Cleaned up ${toDelete.length} old events from memory`)
    }
  }

  getSize(): number {
    return this.processedEvents.size
  }
}

// ============================================================================
// Strategy 2: Redis (Production Recommended)
// ============================================================================

import Redis from 'ioredis'

class RedisIdempotencyStore {
  private redis: Redis
  private readonly ttlSeconds: number
  private readonly keyPrefix: string

  constructor(redis: Redis, ttlSeconds = 86400, keyPrefix = 'webhook:processed:') {
    this.redis = redis
    this.ttlSeconds = ttlSeconds // 24 hours default
    this.keyPrefix = keyPrefix
  }

  private getKey(eventId: string): string {
    return `${this.keyPrefix}${eventId}`
  }

  async isProcessed(eventId: string): Promise<boolean> {
    const key = this.getKey(eventId)
    const exists = await this.redis.exists(key)
    return exists === 1
  }

  async markProcessed(eventId: string, metadata?: Record<string, any>): Promise<void> {
    const key = this.getKey(eventId)
    const value = JSON.stringify({
      processedAt: Date.now(),
      ...metadata,
    })

    // Set with TTL for automatic cleanup
    await this.redis.setex(key, this.ttlSeconds, value)
  }

  // Optional: Get processing details
  async getProcessingDetails(eventId: string): Promise<any | null> {
    const key = this.getKey(eventId)
    const value = await this.redis.get(key)
    return value ? JSON.parse(value) : null
  }

  // Optional: Bulk check (for batch processing)
  async areManyProcessed(eventIds: string[]): Promise<Map<string, boolean>> {
    const keys = eventIds.map((id) => this.getKey(id))
    const results = await this.redis.mget(...keys)

    const map = new Map<string, boolean>()
    eventIds.forEach((id, index) => {
      map.set(id, results[index] !== null)
    })

    return map
  }
}

// ============================================================================
// Strategy 3: Database (PostgreSQL/MySQL)
// ============================================================================

/**
 * Database schema for idempotency:
 *
 * CREATE TABLE webhook_events (
 *   event_id VARCHAR(255) PRIMARY KEY,
 *   session_id VARCHAR(255) NOT NULL,
 *   event_type VARCHAR(100) NOT NULL,
 *   processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   processing_duration_ms INT,
 *   metadata JSONB,
 *   INDEX idx_session_id (session_id),
 *   INDEX idx_processed_at (processed_at)
 * );
 *
 * -- Cleanup old events periodically:
 * DELETE FROM webhook_events WHERE processed_at < NOW() - INTERVAL '30 days';
 */

interface DatabaseClient {
  query(sql: string, params: any[]): Promise<any>
}

class DatabaseIdempotencyStore {
  constructor(private db: DatabaseClient) {}

  async isProcessed(eventId: string): Promise<boolean> {
    const result = await this.db.query(
      'SELECT 1 FROM webhook_events WHERE event_id = $1 LIMIT 1',
      [eventId]
    )
    return result.rows && result.rows.length > 0
  }

  async markProcessed(
    event: WebhookEvent,
    processingDurationMs?: number
  ): Promise<void> {
    await this.db.query(
      `INSERT INTO webhook_events (event_id, session_id, event_type, processing_duration_ms)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (event_id) DO NOTHING`,
      [event.id, event.sessionId, event.type, processingDurationMs || null]
    )
  }

  // Query processing history
  async getEventHistory(sessionId: string): Promise<any[]> {
    const result = await this.db.query(
      'SELECT * FROM webhook_events WHERE session_id = $1 ORDER BY processed_at DESC',
      [sessionId]
    )
    return result.rows
  }
}

// ============================================================================
// Strategy 4: Hybrid (Memory + Redis for Performance)
// ============================================================================

class HybridIdempotencyStore {
  private memoryCache = new Set<string>()
  private readonly maxCacheSize = 5000

  constructor(private redis: RedisIdempotencyStore) {}

  async isProcessed(eventId: string): Promise<boolean> {
    // Check memory cache first (fastest)
    if (this.memoryCache.has(eventId)) {
      return true
    }

    // Check Redis (slower but persistent)
    const processed = await this.redis.isProcessed(eventId)

    // Update memory cache if found in Redis
    if (processed) {
      this.addToMemoryCache(eventId)
    }

    return processed
  }

  async markProcessed(eventId: string, metadata?: Record<string, any>): Promise<void> {
    // Mark in both memory and Redis
    this.addToMemoryCache(eventId)
    await this.redis.markProcessed(eventId, metadata)
  }

  private addToMemoryCache(eventId: string): void {
    // Simple LRU: remove oldest entries when cache is full
    if (this.memoryCache.size >= this.maxCacheSize) {
      const firstItem = this.memoryCache.values().next().value
      if (firstItem) {
        this.memoryCache.delete(firstItem)
      }
    }

    this.memoryCache.add(eventId)
  }
}

// ============================================================================
// Idempotency Middleware
// ============================================================================

interface IdempotencyMiddlewareOptions {
  store: InMemoryIdempotencyStore | RedisIdempotencyStore | DatabaseIdempotencyStore | HybridIdempotencyStore
  onDuplicate?: (event: WebhookEvent) => void
  trackMetrics?: boolean
}

function createIdempotencyMiddleware(options: IdempotencyMiddlewareOptions) {
  const { store, onDuplicate, trackMetrics } = options
  const metrics = {
    duplicates: 0,
    processed: 0,
  }

  return async (event: WebhookEvent, next: () => Promise<void>): Promise<void> => {
    // Check if already processed
    const alreadyProcessed = await store.isProcessed(event.id)

    if (alreadyProcessed) {
      console.log(`⏭️  Event ${event.id} already processed (duplicate delivery)`)

      if (trackMetrics) {
        metrics.duplicates++
      }

      if (onDuplicate) {
        onDuplicate(event)
      }

      // Don't process again, but return success
      return
    }

    // Mark as processed BEFORE processing to prevent race conditions
    await store.markProcessed(event.id)

    if (trackMetrics) {
      metrics.processed++
    }

    // Process the event
    await next()
  }

  // Expose metrics
  function getMetrics() {
    return {
      ...metrics,
      duplicateRate:
        metrics.processed + metrics.duplicates > 0
          ? metrics.duplicates / (metrics.processed + metrics.duplicates)
          : 0,
    }
  }

  return { middleware, getMetrics }
}

// ============================================================================
// Advanced: Distributed Locking for Critical Sections
// ============================================================================

/**
 * Use distributed locks when you need to ensure only ONE instance
 * processes an event, even in a distributed system.
 *
 * This prevents race conditions in multi-server deployments.
 */

class RedisDistributedLock {
  constructor(
    private redis: Redis,
    private keyPrefix = 'lock:webhook:'
  ) {}

  async acquire(eventId: string, ttlMs = 30000): Promise<boolean> {
    const key = `${this.keyPrefix}${eventId}`
    const lockValue = crypto.randomBytes(16).toString('hex')

    // Use SET NX (only set if doesn't exist) with expiry
    const result = await this.redis.set(key, lockValue, 'PX', ttlMs, 'NX')

    return result === 'OK'
  }

  async release(eventId: string): Promise<void> {
    const key = `${this.keyPrefix}${eventId}`
    await this.redis.del(key)
  }
}

// Usage with distributed lock
async function processWithLock(
  event: WebhookEvent,
  lock: RedisDistributedLock,
  store: any,
  processor: (event: WebhookEvent) => Promise<void>
): Promise<void> {
  // Try to acquire lock
  const acquired = await lock.acquire(event.id)

  if (!acquired) {
    console.log(`🔒 Event ${event.id} is being processed by another instance`)
    return // Another instance is processing this event
  }

  try {
    // Check idempotency
    if (await store.isProcessed(event.id)) {
      console.log(`⏭️  Event ${event.id} already processed`)
      return
    }

    // Mark as processed
    await store.markProcessed(event.id)

    // Process the event
    await processor(event)

    console.log(`✅ Event ${event.id} processed successfully`)
  } finally {
    // Always release lock
    await lock.release(event.id)
  }
}

// ============================================================================
// Example Usage
// ============================================================================

async function setupIdempotency() {
  // Development: Use in-memory store
  const inMemoryStore = new InMemoryIdempotencyStore()

  // Production: Use Redis store
  const redis = new Redis(process.env.REDIS_URL!)
  const redisStore = new RedisIdempotencyStore(redis, 86400) // 24 hour TTL

  // Best: Use hybrid for performance
  const hybridStore = new HybridIdempotencyStore(redisStore)

  // Create middleware
  const { middleware: idempotencyMiddleware, getMetrics } =
    createIdempotencyMiddleware({
      store: hybridStore,
      trackMetrics: true,
      onDuplicate: (event) => {
        console.log(`Duplicate webhook received: ${event.type} (${event.id})`)
      },
    })

  return { idempotencyMiddleware, getMetrics, store: hybridStore }
}

// ============================================================================
// Performance Considerations
// ============================================================================

/**
 * Best Practices:
 *
 * 1. Check idempotency BEFORE expensive operations
 * 2. Mark as processed IMMEDIATELY after idempotency check
 * 3. Use distributed locks for critical operations
 * 4. Set appropriate TTLs (balance storage vs. safety)
 * 5. Monitor duplicate rates (high rate = delivery issues)
 *
 * Performance Tips:
 * - Use hybrid strategy (memory + Redis) for best performance
 * - Batch Redis operations when checking multiple events
 * - Use Redis pipelines for bulk operations
 * - Consider using Redis Cluster for high throughput
 *
 * TTL Recommendations:
 * - Dev/Testing: 1 hour (3600s)
 * - Production: 24 hours (86400s)
 * - High-traffic: 7 days (604800s)
 */

// ============================================================================
// Export
// ============================================================================

export {
  InMemoryIdempotencyStore,
  RedisIdempotencyStore,
  DatabaseIdempotencyStore,
  HybridIdempotencyStore,
  createIdempotencyMiddleware,
  RedisDistributedLock,
  processWithLock,
  setupIdempotency,
}
