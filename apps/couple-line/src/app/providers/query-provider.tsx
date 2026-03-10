import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

let context:
  | {
      queryClient: QueryClient
    }
  | undefined

export function getRouterContext() {
  if (context) {
    return context
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
    },
  })

  context = { queryClient }

  return context
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const { queryClient } = getRouterContext()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
