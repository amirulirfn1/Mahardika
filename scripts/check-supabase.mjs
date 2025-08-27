// Minimal Supabase connectivity check using fetch (Node 18+)
// Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from .env

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnv(file = '.env') {
  const envPath = resolve(process.cwd(), file)
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY
  try {
    const text = readFileSync(envPath, 'utf8')
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#') || !line.includes('=')) continue
      const idx = line.indexOf('=')
      const k = line.slice(0, idx).trim()
      const v = line.slice(idx + 1).trim()
      if (k === 'NEXT_PUBLIC_SUPABASE_URL' && !url) url = v
      if ((k === 'NEXT_PUBLIC_SUPABASE_ANON_KEY' || k === 'SUPABASE_KEY') && !key) key = v
    }
  } catch {}
  return { url, key }
}

async function main() {
  const { url, key } = loadEnv()
  if (!url || !key) {
    console.error('Missing Supabase env. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.')
    process.exit(2)
  }

  const endpoint = `${url.replace(/\/?$/, '')}/auth/v1/settings`
  const start = Date.now()
  try {
    const res = await fetch(endpoint, { headers: { apikey: key } })
    const ms = Date.now() - start
    const ok = res.ok
    let info = ''
    try {
      const json = await res.json()
      info = JSON.stringify({ status: res.status, gotrue: json?.external || Object.keys(json || {}).length }, null, 2)
    } catch {
      info = `status=${res.status}`
    }
    console.log(`[supabase] reachable=${ok} time_ms=${ms} endpoint=/auth/v1/settings`)
    console.log(info)
    process.exit(ok ? 0 : 1)
  } catch (err) {
    const ms = Date.now() - start
    console.error(`[supabase] error after ${ms}ms:`, err?.message || err)
    process.exit(1)
  }
}

main()

