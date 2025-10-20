#!/usr/bin/env node

// One-off Dev fixture recorder
// Records 200s and representative 4xx responses for FaceSign API into docs/src/examples
// Usage: FACESIGN_API_KEY=sk_test_... node scripts/record-fixtures.mjs

import fs from 'node:fs'
import path from 'node:path'

const API = process.env.FACESIGN_API_URL || 'https://api.dev.facesign.ai'
const KEY = process.env.FACESIGN_API_KEY || ''
if (!KEY) {
  console.error('FACESIGN_API_KEY is required')
  process.exit(1)
}

const OUT_DIR = path.resolve(process.cwd(), 'src/examples')
fs.mkdirSync(OUT_DIR, { recursive: true })

async function request(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text().catch(() => '')
  let json
  try { json = JSON.parse(text) } catch { json = text }
  return { status: res.status, ok: res.ok, data: json }
}

async function writeFixture(name, obj) {
  const p = path.join(OUT_DIR, name)
  fs.writeFileSync(p, JSON.stringify(obj, null, 2))
  console.log('Wrote', p)
}

async function main() {
  // 1) POST /sessions (200)
  const createPayload = {
    clientReferenceId: 'fixture-user-123',
    metadata: { source: 'fixture' },
    flow: {
      nodes: [
        { id: 'start', type: 'start' },
        { id: 'end', type: 'end' },
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'end' },
      ],
    },
  }
  const createRes = await request('POST', `${API}/sessions`, createPayload)
  await writeFixture('create_session.json', createRes.data)

  // Representative 400: send both modules+flow to trigger validation
  const badCreate = await request('POST', `${API}/sessions`, {
    clientReferenceId: 'bad-123',
    metadata: { source: 'fixture' },
    modules: [{ type: 'identityVerification' }],
    flow: createPayload.flow,
  })
  await writeFixture('create_session_400.json', badCreate.data)

  // Session id for GETs
  const sessionId = createRes?.data?.session?.id

  // 2) GET /sessions (200)
  const listRes = await request('GET', `${API}/sessions?limit=5`, null)
  await writeFixture('sessions_list.json', listRes.data)

  // 3) GET /sessions/{id} (200/404)
  if (sessionId) {
    const getRes = await request('GET', `${API}/sessions/${sessionId}`, null)
    await writeFixture('get_session.json', getRes.data)
  }
  const get404 = await request('GET', `${API}/sessions/sess_nonexistent`, null)
  await writeFixture('get_session_404.json', get404.data)

  // 4) GET /sessions/{id}/refresh (200/404)
  if (sessionId) {
    const refreshRes = await request('GET', `${API}/sessions/${sessionId}/refresh`, null)
    await writeFixture('refresh_session.json', refreshRes.data)
  }
  const refresh404 = await request('GET', `${API}/sessions/sess_nonexistent/refresh`, null)
  await writeFixture('refresh_session_404.json', refresh404.data)

  // 5) GET /langs (200)
  const langsRes = await request('GET', `${API}/langs`, null)
  await writeFixture('langs.json', langsRes.data)

  // 6) GET /avatars (200)
  const avatarsRes = await request('GET', `${API}/avatars`, null)
  await writeFixture('avatars.json', avatarsRes.data)

  console.log('Done')
}

main().catch((e) => {
  console.error('Fixture script failed:', e)
  process.exit(1)
})
