import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, expect, test, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

test.each(['phc_test', '', '   '])('sends to EU Cloud only with a project token (%j)', async (token) => {
  vi.stubEnv('VITE_POSTHOG_KEY', token)
  const { PHProvider } = await import('./ph-provider')
  const element = PHProvider({ children: 'application' })
  expect({
    key: element.props.environment?.projectToken,
    host: element.props.ingestPath,
    html: renderToStaticMarkup(element),
  }).toEqual({
    key: token.trim() || undefined,
    host: token.trim() ? 'https://eu.i.posthog.com' : undefined,
    html: 'application',
  })
})
