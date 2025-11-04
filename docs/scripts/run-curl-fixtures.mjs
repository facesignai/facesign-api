#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = process.cwd()
const FIXTURES_DIR = path.join(ROOT, 'scripts', 'fixtures', 'curl')

const args = process.argv.slice(2)
const flags = new Set(args)
const record = flags.has('--record') || !flags.has('--verify')
const verify = flags.has('--verify')

function findRequests(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findRequests(full))
    } else if (entry.isFile() && entry.name === 'request.sh') {
      results.push(full)
    }
  }
  return results.sort()
}

function runScript(file) {
  const res = spawnSync('bash', [file], { stdio: 'inherit', env: process.env })
  return res.status === 0
}

function readJson(file) {
  if (!fs.existsSync(file)) return null
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return null }
}

function verifyFixture(dir) {
  const response = readJson(path.join(dir, 'response.json'))
  const meta = readJson(path.join(dir, 'meta.json'))
  const ok = !!response && !!meta && typeof meta.status === 'number'
  return { ok, response, meta }
}

function main() {
  const requests = findRequests(FIXTURES_DIR)
  if (!requests.length) {
    console.error('No request.sh files found under', FIXTURES_DIR)
    process.exit(1)
  }

  let failures = 0
  for (const req of requests) {
    const dir = path.dirname(req)
    const rel = path.relative(ROOT, dir)
    if (record) {
      console.log('Recording', rel)
      if (!runScript(req)) {
        console.error('Failed:', rel)
        failures++
        continue
      }
    }
    if (verify) {
      const { ok } = verifyFixture(dir)
      if (!ok) {
        console.error('Verify failed:', rel)
        failures++
      } else {
        console.log('Verified', rel)
      }
    }
  }

  if (failures) {
    console.error('Done with failures =', failures)
    process.exit(1)
  }
  console.log('Done')
}

main()



