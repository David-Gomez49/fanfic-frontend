import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/auth'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

function TestProviders({ children }: { children: ReactNode }) {
  const qc = createTestQueryClient()
  return (
    <QueryClientProvider client={qc}>
      {children}
    </QueryClientProvider>
  )
}

function AuthProviders({ children }: { children: ReactNode }) {
  const qc = createTestQueryClient()
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: TestProviders, ...options })
}

function renderWithAuth(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AuthProviders, ...options })
}

export * from '@testing-library/react'
export { customRender as render, renderWithAuth }
