import { atomWithStorage } from 'jotai/utils'

// Persisted user selection: 'auto' | theme name (no legacy handling needed)
export const themeSelectionAtom = atomWithStorage('aurora-theme', 'auto')
