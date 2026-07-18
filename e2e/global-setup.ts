import { execSync } from 'child_process'
import * as path from 'path'

async function waitForServer(url: string, maxMs = 30000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) })
      if (res.ok || res.status >= 400) return
    } catch {}
    await new Promise(r => setTimeout(r, 1000))
  }
  throw new Error(`Server ${url} did not respond within ${maxMs}ms`)
}

export default async function globalSetup() {
  const backDir = path.resolve(__dirname, '..', '..', 'back')

  console.log('[global-setup] Waiting for servers...')
  await Promise.all([
    waitForServer('http://localhost:3001/api/fics'),
    waitForServer('http://localhost:3000'),
  ])
  console.log('[global-setup] Both servers are ready.')

  console.log('[global-setup] Cleaning previous test data...')
  try {
    execSync('npx tsx prisma/seed-e2e-teardown.ts', {
      cwd: backDir,
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'development' },
    })
  } catch {
    console.log('[global-setup] Cleanup skipped (first run).')
  }

  console.log('[global-setup] Seeding test data...')
  execSync('npx tsx prisma/seed-e2e.ts', {
    cwd: backDir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' },
  })
  console.log('[global-setup] Seed complete.')
}
