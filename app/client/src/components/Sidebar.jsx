/**
 * Sidebar Navigation Component
 */

import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiCreditCard, 
  FiDollarSign 
} from 'react-icons/fi';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Customers', href: '/customers', icon: FiUsers },
  { name: 'Transactions', href: '/transactions', icon: FiCreditCard },
  { name: 'Loans', href: '/loans', icon: FiDollarSign },
];

export default function Sidebar({ isOpen }) {
  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-0'
      } bg-dark-surface border-r border-dark-border transition-all duration-300 overflow-hidden`}
      data-testid="sidebar"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-dark-border">
          <h1 className="text-2xl font-bold text-accent-blue" data-testid="app-logo">
            FinCore Bank
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              data-testid={`nav-${item.name.toLowerCase()}`}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-dark-hover text-accent-blue glow-blue'
                    : 'text-dark-text-secondary hover:bg-dark-hover hover:text-dark-text-primary'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-border">
          <div className="text-xs text-dark-text-muted">
            Version 1.0.0
          </div>
        </div>
      </div>
    </aside>
  );
}
