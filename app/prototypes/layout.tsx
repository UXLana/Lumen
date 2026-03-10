import React from 'react'
import { AllPrototypesButton } from './AllPrototypesButton'

export default function PrototypesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AllPrototypesButton />
    </>
  )
}
