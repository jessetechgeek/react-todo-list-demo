import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import TodoListPage from './pages/TodoListPage'
import Header from './components/Header'
import Footer from './components/Footer'
import { authApi } from './lib/api-client'

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authApi.isLoggedIn()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Routes>
          {/* Auth routes - without Header */}
          <Route path="/login" element={
            <>
              <main className="flex-grow">
                <LoginPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/signup" element={
            <>
              <main className="flex-grow">
                <SignupPage />
              </main>
              <Footer />
            </>
          } />
          
          {/* Protected routes - with Header */}
          <Route path="/" element={
            <>
              <Header />
              <main className="flex-grow">
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              </main>
              <Footer />
            </>
          } />
          <Route path="/lists/:listId" element={
            <>
              <Header />
              <main className="flex-grow">
                <ProtectedRoute>
                  <TodoListPage />
                </ProtectedRoute>
              </main>
              <Footer />
            </>
          } />
          
          {/* Redirect all other routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App