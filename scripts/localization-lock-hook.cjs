const fs = require('node:fs')
const path = require('node:path')
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

function blockMessage(filePath, matchedGlob) {
  return `localization-lock: blocked write to translation file.

  File:         ${filePath}
  Matched glob: ${matchedGlob}

Translation files are managed by the Localization team via Crowdin.
Only the Localization team may modify these files.

Setup guide: ${GOLDEN_PATH_URL}
`
}

const chunks = []
process.stdin.on('data', chunk => chunks.push(chunk))
process.stdin.on('end', () => {
  let payload
  try {
    payload = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch (err) {
    process.stderr.write(
      `localization-lock: failed to parse stdin JSON: ${err.message}\n`
    )
    process.exit(1)
  }

  const filePath = payload?.tool_input?.file_path
  const cwd = payload?.cwd

  if (!filePath) {
    process.stderr.write(
      'localization-lock: missing tool_input.file_path in stdin JSON\n'
    )
    process.exit(1)
  }

  // Resolve crowdin.yml: prefer cwd from stdin, fall back to process.cwd()
  let crowdinYmlPath = null
  if (cwd && fs.existsSync(path.join(cwd, 'crowdin.yml'))) {
    crowdinYmlPath = path.join(cwd, 'crowdin.yml')
  } else if (fs.existsSync(path.join(process.cwd(), 'crowdin.yml'))) {
    crowdinYmlPath = path.join(process.cwd(), 'crowdin.yml')
  }

  if (!crowdinYmlPath) {
    process.stdout.write(MSG_MISSING_CROWDIN)
    process.exit(2)
  }

  // Make filePath relative to cwd before matching against crowdin.yml globs,
  // which are repo-root-relative. Claude Code passes absolute file_path in tool_input.
  let resolvedFilePath = filePath
  if (cwd && path.isAbsolute(filePath)) {
    const rel = path.relative(cwd, filePath)
    if (!rel.startsWith('..')) {
      resolvedFilePath = rel
    }
  }

  let blocked
  try {
    blocked = checkPaths([resolvedFilePath], crowdinYmlPath)
  } catch (err) {
    process.stderr.write(`localization-lock: internal error: ${err.message}\n`)
    process.exit(1)
  }

  if (blocked.length > 0) {
    const { path: blockedPath, matchedGlob } = blocked[0]
    process.stdout.write(blockMessage(blockedPath, matchedGlob))
    process.exit(2)
  }

  process.exit(0)
})
