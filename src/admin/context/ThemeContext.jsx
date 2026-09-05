import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'radium-admin-theme'

const ThemeContext = createContext({ theme: 'dark', setTheme: () => {}, toggleTheme: () => {} })

export function ThemeProvider({ children }) {
  // Dark is the original look and remains the default; the choice persists per browser.
  const [theme, setTheme] = useState(() =>
    localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
