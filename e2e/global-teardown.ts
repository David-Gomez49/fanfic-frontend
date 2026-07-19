import { execSync } from 'child_process'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function globalTeardown() {
  const backDir = path.resolve(__dirname, '..', '..', 'back')

  console.log('[global-teardown] Cleaning up test data...')
  try {
    execSync('npx tsx prisma/seed-e2e-teardown.ts', {
      cwd: backDir,
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'development' },
    })
  } catch (e) {
    console.error('[global-teardown] Cleanup failed (non-fatal):', e)
  }
  console.log('[global-teardown] Done.')
}
