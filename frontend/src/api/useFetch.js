import { useCallback, useEffect, useState } from 'react'

/**
 * Hook fetch dùng chung: tự huỷ request khi component unmount / deps đổi.
 *
 * @param {(opts: {signal: AbortSignal}) => Promise<any>} fetcher
 * @param {any[]} deps
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
