const fs = require('node:fs')
const path = require('node:path')
const { execSync } = require('node:child_process')
const { checkPaths } = require(path.join(__dirname, 'localization-lock-core.cjs'))

const GOLDEN_PATH_URL =
  'https://darkkitchen.vtex.com/docs/default/domain/engineering/engineering-golden-path/localization-lock'

const MSG_MISSING_CROWDIN = `localization-lock: crowdin.yml not found at repo root.

This file is required for localization-lock to identify translation files.
The hook cannot operate without it — this commit is blocked.

To resolve:
  1. Add crowdin.yml to the repo root (see the Crowdin configuration guide).
  2. Re-run the localization-lock adoption procedure for this repo.

Setup guide: ${GOLDEN_PATH_URL}
`

// §1 — Resolve crowdin.yml
const crowdinYmlPath = path.join(process.cwd(), 'crowdin.yml')
if (!fs.existsSync(crowdinYmlPath)) {
  process.stdout.write(MSG_MISSING_CROWDIN)
  process.exit(1)
}

// §2 — Get staged files
const raw = execSync('git diff --name-only --cached', { encoding: 'utf8' })
const stagedFiles = raw.split('\n').filter(line => line.length > 0)

// §3 — Check paths
let blocked
try {
  blocked = checkPaths(stagedFiles, crowdinYmlPath)
} catch (err) {
  process.stdout.write(`localization-lock: unexpected error — ${err.message}\n`)
  process.exit(1)
}

if (blocked.length > 0) {
  let msg = 'localization-lock: commit blocked.\n\n'
  msg +=
    'The following staged files are translation files managed by the Localization team:\n\n'
  for (const entry of blocked) {
    msg += `  ${entry.path}  (matched: ${entry.matchedGlob})\n`
  }
  msg +=
    '\nTranslation files are managed via Crowdin. Do not commit them directly.\n'
  msg += `\nSetup guide: ${GOLDEN_PATH_URL}\n`
  process.stdout.write(msg)
  process.exit(1)
}

process.exit(0)
