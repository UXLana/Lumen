'use client'

import { useState, useEffect, useCallback } from 'react'
import type { StateCompliance, VPATReport, IssueStatus, ComplianceStore } from './types'

const STORAGE_KEY = 'lumen-compliance-dashboard'
const LEGACY_STORAGE_KEY = 'mtr-compliance-dashboard' // pre-rebrand

function loadFromStorage(): StateCompliance[] {
  if (typeof window === 'undefined') return []
  try {
    // Migrate any data stored under the legacy key before the rebrand.
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy && !localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, legacy)
      localStorage.removeItem(LEGACY_STORAGE_KEY)
    }
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(states: StateCompliance[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
  } catch (e) {
    console.error('Failed to save compliance data:', e)
  }
}

function recalculateState(state: StateCompliance): StateCompliance {
  const latestReport = state.reports.length > 0
    ? state.reports.reduce((a, b) => (a.importedAt > b.importedAt ? a : b))
    : null

  const allIssues = state.reports.flatMap(r => r.issues)
  const openIssues = allIssues.filter(i => i.status !== 'resolved')

  // Calculate score across all reports (weighted average by issue count)
  let overallScore = 0
  if (state.reports.length > 0) {
    const totalWeight = state.reports.reduce((sum, r) => sum + Math.max(r.issues.length, 1), 0)
    overallScore = Math.round(
      state.reports.reduce((sum, r) => {
        const weight = Math.max(r.issues.length, 1)
        return sum + calculateScore(r) * weight
      }, 0) / totalWeight
    )
  }

  return {
    ...state,
    latestScore: overallScore,
    openIssues: openIssues.length,
    criticalCount: openIssues.filter(i => i.severity === 'critical' || i.severity === 'serious').length,
    lastAuditDate: latestReport?.auditDate ?? null,
  }
}

export function calculateScore(report: VPATReport): number {
  if (report.issues.length === 0 && report.passedChecks.length === 0) return 100

  const total = report.issues.length + report.passedChecks.length
  if (total === 0) return 100

  const resolved = report.issues.filter(i => i.status === 'resolved').length
  const passing = report.passedChecks.length + resolved

  // When passedChecks is empty (common for parsed VPATs that only list failures),
  // calculate score based on issue severity weights instead of returning 0.
  if (report.passedChecks.length === 0 && report.issues.length > 0) {
    const weights: Record<string, number> = { critical: 10, serious: 7, moderate: 4, minor: 1 }
    const maxPossible = report.issues.length * 10
    const deductions = report.issues
      .filter(i => i.status !== 'resolved')
      .reduce((sum, i) => sum + (weights[i.severity] || 4), 0)
    return Math.round(Math.max(0, ((maxPossible - deductions) / maxPossible) * 100))
  }

  return Math.round((passing / total) * 100)
}

export function useComplianceStore(): ComplianceStore {
  const [states, setStates] = useState<StateCompliance[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount, recalculate scores (handles formula changes)
  useEffect(() => {
    const loaded = loadFromStorage()
    setStates(loaded.map(recalculateState))
    setIsLoaded(true)
  }, [])

  // Persist on every change (skip initial mount)
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(states)
    }
  }, [states, isLoaded])

  const addState = useCallback((code: string, name: string) => {
    setStates(prev => {
      if (prev.some(s => s.stateCode === code)) return prev
      return [...prev, {
        stateCode: code,
        stateName: name,
        reports: [],
        latestScore: 0,
        openIssues: 0,
        criticalCount: 0,
        lastAuditDate: null,
      }]
    })
  }, [])

  const removeState = useCallback((code: string) => {
    setStates(prev => prev.filter(s => s.stateCode !== code))
  }, [])

  const addReport = useCallback((stateCode: string, report: VPATReport) => {
    setStates(prev => prev.map(s => {
      if (s.stateCode !== stateCode) return s
      const updated = { ...s, reports: [...s.reports, report] }
      return recalculateState(updated)
    }))
  }, [])

  const removeReport = useCallback((stateCode: string, reportId: string) => {
    setStates(prev => prev.map(s => {
      if (s.stateCode !== stateCode) return s
      const updated = { ...s, reports: s.reports.filter(r => r.id !== reportId) }
      return recalculateState(updated)
    }))
  }, [])

  const updateIssueStatus = useCallback((stateCode: string, reportId: string, issueId: string, status: IssueStatus) => {
    setStates(prev => prev.map(s => {
      if (s.stateCode !== stateCode) return s
      const updated = {
        ...s,
        reports: s.reports.map(r => {
          if (r.id !== reportId) return r
          return {
            ...r,
            issues: r.issues.map(i => i.id === issueId ? { ...i, status } : i),
          }
        }),
      }
      return recalculateState(updated)
    }))
  }, [])

  return {
    states,
    isLoaded,
    addState,
    removeState,
    addReport,
    removeReport,
    updateIssueStatus,
  }
}

// US States list for the state selector
export const US_STATES: Array<{ code: string; name: string }> = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'District of Columbia' },
  { code: 'PR', name: 'Puerto Rico' }, { code: 'GU', name: 'Guam' }, { code: 'VI', name: 'US Virgin Islands' },
]
