import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { AuthProvider } from '@/admin/context/AuthContext'
import { ToastProvider } from '@/admin/context/ToastContext'
import { ThemeProvider } from '@/admin/context/ThemeContext'
import '@/admin/styles/index.css'

// One shared cache for every collection — navigating between pages reuses
// the cached lists instead of refetching on every click; mutations
// invalidate their collection so stale data never lingers after an edit.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HashRouter>
  </React.StrictMode>
)
