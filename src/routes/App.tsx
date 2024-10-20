import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from '../pages/home'
import { ThemeProvider } from '../providers/theme-provider'
import LoginPage from '../pages/login'
import FavoritePage from '../pages/favorites'
import ProtectedRoute from './protected-route'
import SearchResults from '@/pages/search-results'

const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      )
    },
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/favorite',
      element: (
        <ProtectedRoute>
          <FavoritePage />
        </ProtectedRoute>
      )
    },
    {
      path: '/movie/search',
      element: (
        <ProtectedRoute>
          <SearchResults />
        </ProtectedRoute>
      )
    }
  ])

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  )
}

export default App
