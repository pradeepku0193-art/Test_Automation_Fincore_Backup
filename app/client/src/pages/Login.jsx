/**
 * Login Page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLock, FiAlertCircle } from 'react-icons/fi';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent-blue glow-blue mb-2">
            FinCore Bank
          </h1>
          <p className="text-dark-text-secondary">
            Test Automation Training System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-dark-text-primary mb-6">
            Sign In
          </h2>

          {/* Error Message */}
          {error && (
            <div
              className="mb-4 p-4 bg-accent-red/10 border border-accent-red/30 rounded-lg flex items-start"
              data-testid="login-error"
            >
              <FiAlertCircle className="w-5 h-5 text-accent-red mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-sm text-accent-red">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} data-testid="login-form">
            {/* Username */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-dark-text-secondary mb-2"
              >
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:border-accent-blue transition-colors"
                  placeholder="Enter username"
                  required
                  data-testid="login-username-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-dark-text-secondary mb-2"
              >
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:border-accent-blue transition-colors"
                  placeholder="Enter password"
                  required
                  data-testid="login-password-input"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent-blue hover:bg-accent-blue/80 disabled:bg-accent-blue/50 text-white font-medium rounded-lg transition-colors glow-blue"
              data-testid="login-submit-btn"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Test Accounts Info */}
          <div className="mt-6 p-4 bg-dark-bg rounded-lg">
            <p className="text-xs text-dark-text-muted mb-2">Test Accounts:</p>
            <div className="space-y-1 text-xs text-dark-text-secondary">
              <div>admin / Admin@123</div>
              <div>viewer / Viewer@123</div>
              <div>testuser / Test@123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
