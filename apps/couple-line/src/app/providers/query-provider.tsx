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
        staleTime: 10_000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 1,
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
