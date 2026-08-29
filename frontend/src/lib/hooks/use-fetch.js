import { useCallback, useEffect, useState } from 'react'

/**
 * Fetch on mount and whenever `deps` change, aborting the in-flight request on
 * unmount or dep change so no state is set on an unmounted component.
 *
 * @param {(options: {signal: AbortSignal}) => Promise<any>} fetcher
 * @param {any[]} deps
 * @returns {{data: any, loading: boolean, error: Error | null}}
 */
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fetcher, deps)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    setLoading(true)
    setError(null)

    run({ signal: controller.signal })
      .then((result) => active && setData(result))
      .catch((err) => {
        if (err.name !== 'AbortError' && active) setError(err)
      })
      .finally(() => active && setLoading(false))

    return () => {
      active = false
      controller.abort()
    }
  }, [run])

  return { data, loading, error }
}
