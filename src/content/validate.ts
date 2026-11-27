import { content } from './index'
import { contentSchema } from './schema'

/**
 * Development-only content check.
 *
 * Called from `main.tsx` behind `import.meta.env.DEV`, so the schema and
 * this module are dropped from the production bundle by the bundler.
 * CI enforces the same contract via `npm run validate:content`, which
 * means a broken content edit can never reach a deploy even though the
 * runtime check ships to nobody.
 */
export function assertValidContent(): void {
  const result = contentSchema.safeParse(content)

  if (result.success) return

  const detail = result.error.issues
    .map((issue) => `  • ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n')

  throw new Error(`Invalid portfolio content:\n${detail}`)
}
