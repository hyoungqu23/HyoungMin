import { createContext, useContext } from 'react'
import type { ViewerSpace } from '#/app/providers/viewer-provider'

type SpaceContextValue = {
  space: Pick<ViewerSpace, 'id' | 'name'>
  membership: { role: ViewerSpace['role'] }
}

const SpaceContext = createContext<SpaceContextValue | null>(null)

export function SpaceProvider({
  value,
  children,
}: {
  value: SpaceContextValue
  children: React.ReactNode
}) {
  return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
}

export function useSpace() {
  const value = useContext(SpaceContext)

  if (!value) {
    throw new Error('useSpace must be used within SpaceProvider')
  }

  return value
}
