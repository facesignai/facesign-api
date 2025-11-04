#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { loadEnv } from './lib/env.mjs'
import { writeFixture } from './lib/io.mjs'

const ROOT = process.cwd()
const BASE_FIXTURES = path.join(ROOT, 'scripts', 'fixtures', 'api-js')
const SCENARIOS_DIR = path.join(ROOT, 'scripts', 'scenarios')

function get(obj, dotted) {
  if (!dotted) return undefined
  return dotted.split('.').reduce((o, k) => (o && k in o ? o[k] : undefined), obj)
}

function set(vars, key, obj, dotted) {
  const val = get(obj, dotted)
  if (val !== undefined) vars[key] = val
}

function interpolate(input, vars) {
  if (!input) return input
  const s = JSON.stringify(input)
  const out = s.replace(/\$\{([^}]+)\}/g, (_, name) => (name in vars ? String(vars[name]) : `\${${name}}`))
  try { return JSON.parse(out) } catch { return input }
}

async function request(baseUrl, apiKey, spec) {
  const { method, path: rel, body } = spec
  const url = `${baseUrl}${rel}`
  const r = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await r.text().catch(() => '')
  let json
  try { json = JSON.parse(text) } catch { json = text }
  return { status: r.status, headers: Object.fromEntries(r.headers.entries()), body: json }
}

function opToReq(op, params) {
  switch (op) {
    case 'createSession':
      return { method: 'POST', path: '/sessions', body: params }
    case 'getSession':
      return { method: 'GET', path: `/sessions/${params.sessionId}` }
    case 'createClientSecret':
      return { method: 'GET', path: `/sessions/${params.sessionId}/refresh` }
    case 'listSessions':
      return { method: 'GET', path: `/sessions?limit=${params.limit ?? 5}` }
    case 'getLangs':
      return { method: 'GET', path: '/langs' }
    case 'getAvatars':
      return { method: 'GET', path: '/avatars' }
    default:
      throw new Error(`Unknown operation: ${op}`)
  }
}

async function runScenario(file, { baseUrl, apiKey }) {
  const raw = fs.readFileSync(file, 'utf8')
  const scenario = JSON.parse(raw)
  const scenarioSlug = path.basename(file, '.json')
  const vars = { ...(scenario.vars || {}) }

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i]
    const op = step.operation
    const params = interpolate(step.params || {}, vars)
    const req = opToReq(op, params)

    const started = Date.now()
    const res = await request(baseUrl, apiKey, req)
    const duration = Date.now() - started

    const parts = [scenarioSlug, `${String(i + 1).padStart(2, '0')}_${op}`]
    writeFixture(BASE_FIXTURES, parts, {
      request: JSON.stringify({ op, req, params }),
      response: res,
      meta: { status: res.status, duration_ms: duration, timestamp: new Date().toISOString() },
    })

    if (step.expects?.status && res.status !== step.expects.status) {
      throw new Error(`Step ${i + 1} expected status ${step.expects.status} got ${res.status}`)
    }

    if (step.save) {
      for (const [k, dotted] of Object.entries(step.save)) set(vars, k, res, dotted)
    }
  }
}

async function main() {
  const env = loadEnv()
  if (!env.apiKey) {
    console.error('FACESIGN_DEV_API_KEY is required (env or .env/.env.local)')
    process.exit(1)
  }
  const scenario = process.argv[2] || 'liveness-and-document.json'
  const file = path.join(SCENARIOS_DIR, scenario)
  if (!fs.existsSync(file)) {
    console.error('Scenario not found:', path.relative(ROOT, file))
    process.exit(1)
  }
  await runScenario(file, { baseUrl: env.baseUrl, apiKey: env.apiKey })
  console.log('Done')
}

main().catch((e) => { console.error(e.message || e); process.exit(1) })



