'use client'

import { useState, useCallback } from 'react'

interface UsePaginationProps {
  initialPage?: number
  initialLimit?: number
}

export function usePagination({ initialPage = 1, initialLimit = 12 }: UsePaginationProps = {}) {
  const [page, setPage] = useState(initialPage)
  const [limit] = useState(initialLimit)
  const [total, setTotal] = useState(0)

  const totalPages = Math.ceil(total / limit)

  const goToPage = useCallback((p: number) => {
    if (p >= 1 && p <= totalPages) setPage(p)
  }, [totalPages])

  const nextPage = useCallback(() => goToPage(page + 1), [page, goToPage])
  const prevPage = useCallback(() => goToPage(page - 1), [page, goToPage])

  return { page, limit, total, totalPages, setTotal, goToPage, nextPage, prevPage }
}
