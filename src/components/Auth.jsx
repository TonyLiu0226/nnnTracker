import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Auth.css'

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    // Validation
    if (isSignUp && (!email || !username || !password)) {
      setError('Please fill in all fields')
      return
    }

    if (!isSignUp && (!email || !password)) {
      setError('Please fill in all fields')
      return
    }

    if (isSignUp) {
      // Username validation
      if (username.length < 3 || username.length > 20) {
        setError('Username must be between 3 and 20 characters')
        return
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setError('Username can only contain letters, numbers, and underscores')
        return
      }
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, username)
        setMessage('Account created successfully! You can now sign in.')
        setEmail('')
        setUsername('')
        setPassword('')
        setConfirmPassword('')
        setTimeout(() => setIsSignUp(false), 2000)
      } else {
        await signIn(email, password)
        // User will be redirected automatically by AuthContext
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setError(null)
    setMessage(null)
    setEmail('')
    setUsername('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🍂 NNN Tracker</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="choose_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_]+"
                title="Only letters, numbers, and underscores allowed"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
                minLength={6}
              />
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="auth-toggle">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button type="button" onClick={toggleMode} disabled={loading}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  )
}

