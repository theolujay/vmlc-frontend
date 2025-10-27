import React, { useState } from 'react'

export default function usePagination() {
  const [page, setPage] = useState(1)
  return {page, setPage}
}
