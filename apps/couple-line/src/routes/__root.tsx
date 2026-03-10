import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'
import type { QueryClient } from '@tanstack/react-query'
import appCss from '../styles.css?url'
import { QueryProvider } from '#/app/providers/query-provider'
import { ViewerProvider } from '#/app/providers/viewer-provider'
import { fetchViewerFn } from '#/entities/viewer/server'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const viewer = await fetchViewerFn()
    return { viewer }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'CoupleLine' },
      {
        name: 'description',
        content: '커플을 위한 복식부기 가계부 CoupleLine',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  notFoundComponent: () => (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 text-center">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-700/70">
          404
        </p>
        <h1 className="mt-4 font-display text-5xl text-stone-900">
          페이지를 찾을 수 없어요.
        </h1>
      </div>
    </main>
  ),
  component: RootDocument,
})

function RootDocument() {
  const { viewer } = Route.useRouteContext()

  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryProvider>
          <ViewerProvider value={viewer}>
            <Outlet />
            <Toaster
              richColors
              expand
              closeButton
              duration={3400}
              position="top-right"
              offset={20}
              mobileOffset={{ top: 16, left: 16, right: 16 }}
              toastOptions={{
                classNames: {
                  toast:
                    'rounded-[1.35rem] border border-white/80 shadow-[0_18px_50px_rgba(35,52,46,0.14)] backdrop-blur-xl',
                  title: 'text-[13px] font-semibold',
                  description: 'text-xs leading-5 opacity-90',
                  closeButton: '!rounded-full !shadow-sm',
                  success:
                    '!bg-emerald-50 !border-emerald-200 !text-emerald-900',
                  error: '!bg-rose-50 !border-rose-200 !text-rose-900',
                  info: '!bg-sky-50 !border-sky-200 !text-sky-900',
                  warning: '!bg-amber-50 !border-amber-200 !text-amber-900',
                  loading: '!bg-white/95 !border-stone-200 !text-stone-900',
                },
              }}
            />
            <TanStackRouterDevtools position="bottom-right" />
          </ViewerProvider>
        </QueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
