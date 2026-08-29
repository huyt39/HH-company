import { useCallback, useEffect, useState } from 'react'

import { resourcesApi } from '@/lib/api/resources-client'

const PAGE_SIZE = 50

/**
 * Load the records of one admin resource, with search.
 *
 * @param {string} resource resource key, e.g. `projects`
 * @param {string} query search term ('' = no filter)
 * @param {boolean} [enabled] false when the route points at an unknown resource
 */
export function useResourceList(resource, query, enabled = true) {
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await resourcesApi.list(resource, {
        page_size: PAGE_SIZE,
        q: query || undefined,
      })
      setRows(data.items)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [resource, query, enabled])

  useEffect(() => {
    reload()
  }, [reload])

  return { rows, total, loading, error, setError, reload, pageSize: PAGE_SIZE }
}
