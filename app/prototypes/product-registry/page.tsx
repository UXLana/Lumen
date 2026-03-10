'use client'

import { useEffect } from 'react'

export default function ProductRegistryIndex() {
  useEffect(() => {
    window.location.href = '/prototypes/product-registry/catalog'
  }, [])

  return null
}
