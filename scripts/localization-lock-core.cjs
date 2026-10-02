const fs = require('node:fs')
const yaml = require('js-yaml')
const micromatch = require('micromatch')

const LOCALE_VARS = [
  '%two_letters_code%',
  '%locale%',
  '%locale_with_underscore%',
  '%language%',
  '%three_letters_code%',
  '%android_code%',
  '%osx_code%',
]

const GLOB_CHARS = /[*?[\]{}/]/

function hasGlobChars(segment) {
  return GLOB_CHARS.test(segment)
}

function deriveGlobPair(entry, basePath) {
  let source = entry.source
  let translation = entry.translation

  if (basePath && basePath !== '.' && basePath !== '') {
    source = `${basePath.replace(/\/$/, '')}/${source.replace(/^\//, '')}`
    translation = `${basePath.replace(/\/$/, '')}/${translation.replace(
      /^\//,
      ''
    )}`
  }

  const segments = source.split('/')
  const lastSegment = segments[segments.length - 1]

  if (hasGlobChars(lastSegment)) {
    throw new Error(
      `parse error: source glob's last segment must be a literal filename (got: ${lastSegment})`
    )
  }

  const parentSegments = segments.slice(0, -1)
  const originalPath = parentSegments.join('/')
  const originalFileName = lastSegment
  const dotIndex = originalFileName.lastIndexOf('.')
  const fileExtension =
    dotIndex >= 0 ? originalFileName.slice(dotIndex + 1) : ''
  const fileName =
    dotIndex >= 0 ? originalFileName.slice(0, dotIndex) : originalFileName

  let translationGlob = translation
  translationGlob = translationGlob.replace(/%original_path%/g, originalPath)
  translationGlob = translationGlob.replace(
    /%original_file_name%/g,
    originalFileName
  )
  translationGlob = translationGlob.replace(/%file_extension%/g, fileExtension)
  translationGlob = translationGlob.replace(/%file_name%/g, fileName)

  for (const localeVar of LOCALE_VARS) {
    translationGlob = translationGlob.split(localeVar).join('*')
  }

  // Collapse any double slashes that can arise from variable substitution
  // (e.g. /%original_path%/... where original_path starts with /)
  translationGlob = translationGlob.replace(/\/\/+/g, '/')

  return { translationGlob, sourceGlob: source }
}

function deriveTranslationGlobs(crowdinYmlPath) {
  let content
  try {
    content = fs.readFileSync(crowdinYmlPath, 'utf8')
  } catch (err) {
    throw new Error(
      `Failed to read crowdin.yml at ${crowdinYmlPath}: ${err.message}`
    )
  }

  let parsed
  try {
    parsed = yaml.load(content)
  } catch (err) {
    throw new Error(
      `Failed to parse crowdin.yml at ${crowdinYmlPath}: ${err.message}`
    )
  }

  if (!parsed || !Object.hasOwn(parsed, 'files')) {
    throw new Error(
      `crowdin.yml at ${crowdinYmlPath} is missing the required 'files' key`
    )
  }

  const files = parsed.files
  if (!Array.isArray(files) || files.length === 0) {
    return []
  }

  const basePath = parsed.base_path || '.'

  return files.map(entry =>
    deriveGlobPair(entry, basePath === '.' ? '' : basePath)
  )
}

function isTranslationFile(filePath, globPairs) {
  // Strip leading slash so git's relative paths (no slash) match crowdin.yml's /prefixed globs
  const normalizedPath = filePath.replace(/^\//, '')
  for (const { translationGlob, sourceGlob } of globPairs) {
    const normTrans = translationGlob.replace(/^\//, '')
    const normSource = sourceGlob.replace(/^\//, '')
    if (!micromatch.isMatch(normalizedPath, normTrans)) {
      continue
    }
    if (micromatch.isMatch(normalizedPath, normSource)) {
      continue
    }
    return { blocked: true, matchedGlob: translationGlob }
  }
  return { blocked: false }
}

function checkPaths(paths, crowdinYmlPath) {
  const globPairs = deriveTranslationGlobs(crowdinYmlPath)
  return paths
    .map(p => ({ path: p, ...isTranslationFile(p, globPairs) }))
    .filter(r => r.blocked)
}

module.exports = { deriveTranslationGlobs, isTranslationFile, checkPaths }
