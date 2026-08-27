import { useEffect, useState } from 'react'
import { ApiRequestError } from '../services/api'

export type ApiResourceState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string; error: unknown }
  | { status: 'success'; data: T }

function shallowEqual(a: unknown[], b: unknown[]) {
  return a.length === b.length && a.every((value, index) => Object.is(value, b[index]))
}

/**
 * Fetches a public resource and exposes loading/error/success states so
 * every API-driven section can render a distinct state for each, per
 * specs/portfolio-dynamic-content/spec.md. An empty (but successful) result
 * is still `status: 'success'` — callers decide how to render an empty list.
 */
export function useApiResource<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): ApiResourceState<T> {
  const [state, setState] = useState<ApiResourceState<T>>({ status: 'loading' })
  const [prevDeps, setPrevDeps] = useState(deps)

  // Reset to loading during render when deps change, rather than calling
  // setState synchronously in the effect body (see "Adjusting some state
  // when a prop changes" at https://react.dev/learn/you-might-not-need-an-effect).
  if (!shallowEqual(prevDeps, deps)) {
    setPrevDeps(deps)
    if (state.status !== 'loading') {
      setState({ status: 'loading' })
    }
  }

  useEffect(() => {
    let cancelled = false

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        const message =
          error instanceof ApiRequestError
            ? error.message
            : 'Unable to load data. Please try again later.'
        setState({ status: 'error', message, error })
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
