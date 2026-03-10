'use client'

import { useEffect } from 'react'

export default function TransferManifestIndex() {
  useEffect(() => {
    window.location.href = '/prototypes/transfer-manifest/detail-view'
  }, [])

  return null
}
