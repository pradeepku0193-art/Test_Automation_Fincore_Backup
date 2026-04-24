/**
 * Header Component
 */

import { useAuth } from '../context/AuthContext';
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-dark-surface border-b border-dark-border flex items-center justify-between px-6" data-testid="header">
      {/* Menu Button */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-dark-hover transition-colors"
        data-testid="menu-button"
      >
        <FiMenu className="w-6 h-6 text-dark-text-primary" />
      </button>

      {/* User Menu */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-dark-hover">
          <FiUser className="w-5 h-5 text-accent-blue" />
          <div>
            <div className="text-sm font-medium text-dark-text-primary" data-testid="user-name">
              {user?.username}
            </div>
            <div className="text-xs text-dark-text-muted capitalize">
              {user?.role}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-lg hover:bg-dark-hover transition-colors text-accent-red"
          data-testid="logout-button"
          title="Logout"
        >
          <FiLogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
