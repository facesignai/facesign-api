import fs from 'fs/promises'
import path from 'path'

const API = process.env.FACESIGN_API_BASE || 'https://api.dev.facesign.ai'
let KEY = process.env.FACESIGN_API_KEY || ''

// Attempt to read .env if KEY not set
if (!KEY) {
  try {
    const envPath = path.resolve(process.cwd(), '.env')
    const raw = await fs.readFile(envPath, 'utf8').catch(() => '')
    if (raw) {
      for (const line of raw.split(/\r?\n/)) {
        const m = line.match(/^\s*FACESIGN_API_KEY\s*=\s*(.+)\s*$/)
        if (m) {
          KEY = m[1].replace(/^['\"]|['\"]$/g, '')
          break
        }
      }
    }
  } catch {}
}

if (!KEY) {
  console.error('FACESIGN_API_KEY is required (set env var or .env)')
  process.exit(1)
}

const outDir = path.resolve(process.cwd(), 'src/examples')

async function writeJson(name, obj) {
  const file = path.join(outDir, name)
  await fs.writeFile(file, JSON.stringify(obj, null, 2) + '\n')
  console.log('Wrote', file)
}

async function GET(url) {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${KEY}` } })
  const body = await r.json().catch(() => ({}))
  return { status: r.status, ok: r.ok, body }
}

async function POST(url, json) {
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  })
  const body = await r.json().catch(() => ({}))
  return { status: r.status, ok: r.ok, body }
}

async function main() {
  await fs.mkdir(outDir, { recursive: true })

  // Create session (minimal start->end flow)
  const createPayload = {
    clientReferenceId: 'docs_fixture',
    metadata: { source: 'fixture' },
    flow: {
      nodes: [
        { id: 'start', type: 'start' },
        { id: 'end', type: 'end' },
      ],
      edges: [{ id: 'e1', source: 'start', target: 'end' }],
    },
  }
  const create = await POST(`${API}/sessions`, createPayload)
  if (create.ok) await writeJson('create_session.json', create.body)
  else await writeJson('create_session_400.json', create.body)

  const sessionId = create.body?.session?.id || 'sess_invalid'

  // Get session (200 or 404)
  const getOk = await GET(`${API}/sessions/${sessionId}`)
  if (getOk.ok) await writeJson('get_session.json', getOk.body)
  const get404 = await GET(`${API}/sessions/sess_does_not_exist`)
  if (get404.status >= 400) await writeJson('get_session_404.json', get404.body)

  // List sessions (200)
  const list = await GET(`${API}/sessions?limit=20`)
  if (list.ok) await writeJson('sessions_list.json', list.body)

  // Refresh client secret (200/404)
  const refreshOk = await GET(`${API}/sessions/${sessionId}/refresh`)
  if (refreshOk.ok) await writeJson('refresh_session.json', refreshOk.body)
  const refresh404 = await GET(`${API}/sessions/sess_does_not_exist/refresh`)
  if (refresh404.status >= 400) await writeJson('refresh_session_404.json', refresh404.body)

  // Langs (200)
  const langs = await GET(`${API}/langs`)
  if (langs.ok) await writeJson('langs.json', langs.body)

  // Avatars (200)
  const avatars = await GET(`${API}/avatars`)
  if (avatars.ok) await writeJson('avatars.json', avatars.body)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


