import { createContext, useContext } from 'react'

export type ViewerSpace = {
  id: string
  name: string
  role: 'OWNER' | 'MANAGER' | 'MEMBER'
}

export type Viewer = {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  spaces: ViewerSpace[]
}

const ViewerContext = createContext<Viewer | null>(null)

export function ViewerProvider({
  value,
  children,
}: {
  value: Viewer | null
  children: React.ReactNode
}) {
  return (
    <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>
  )
}

export function useViewer() {
  return useContext(ViewerContext)
}
