import { useAuth } from './contexts/AuthContext'
import Auth from './components/Auth'
import Tracker from './components/Tracker'
import './App.css'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="app-container">
        <div style={{ 
          textAlign: 'center', 
          color: 'white', 
          fontSize: '1.5rem', 
          padding: '2rem' 
        }}>
          Loading...
        </div>
      </div>
    )
  }

  return user ? <Tracker /> : <Auth />
}

export default App

