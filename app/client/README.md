# FinCore Bank - React UI

Modern dark-themed React 18 application for the FinCore Bank system.

## 🎨 Features

- ✅ **Dark Theme** - GitHub-inspired dark color scheme
- ✅ **React 18** - Latest React with hooks
- ✅ **Vite** - Lightning-fast build tool
- ✅ **Tailwind CSS** - Utility-first CSS framework
- ✅ **React Router** - Client-side routing
- ✅ **Recharts** - Beautiful charts and visualizations
- ✅ **Axios** - HTTP client with interceptors
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Responsive Design** - Mobile-friendly layouts
- ✅ **Skeleton Loaders** - Smooth loading states
- ✅ **Test IDs** - All elements have data-testid for automation

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # Shared components
│   │   ├── Layout.jsx       # Main layout with sidebar
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── Header.jsx       # Top header with user menu
│   │   ├── Card.jsx         # Reusable card component
│   │   └── SkeletonLoader.jsx  # Loading skeletons
│   ├── pages/               # Page components
│   │   ├── Login.jsx        # Login page
│   │   ├── Dashboard.jsx    # Dashboard with charts
│   │   ├── Customers.jsx    # Customers list
│   │   ├── CustomerDetail.jsx  # Customer detail
│   │   ├── Transactions.jsx # Transactions list
│   │   ├── Loans.jsx        # Loans list
│   │   └── LoanDetail.jsx   # Loan detail
│   ├── services/            # API services
│   │   └── api.js           # Axios configuration
│   ├── context/             # React context
│   │   └── AuthContext.jsx  # Authentication state
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev

# App will be available at http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Dark Theme Colors

```javascript
colors: {
  dark: {
    bg: '#0d1117',           // Main background
    surface: '#161b22',      // Cards, sidebar
    border: '#30363d',       // Borders
    hover: '#21262d',        // Hover states
    text: {
      primary: '#e6edf3',    // Primary text
      secondary: '#8b949e',  // Secondary text
      muted: '#6e7681'       // Muted text
    }
  },
  accent: {
    blue: '#58a6ff',         // Primary actions
    purple: '#bc8cff',       // Secondary accent
    green: '#3fb950',        // Success
    red: '#f85149',          // Error
    yellow: '#d29922',       // Warning
    orange: '#ff8c00'        // Info
  }
}
```

## 📱 Screens

### 1. Login (`/login`)
- Username/password authentication
- Test accounts displayed
- Error handling
- JWT token storage

### 2. Dashboard (`/dashboard`)
- Summary cards (customers, accounts, transactions, loans)
- Bar chart - Transactions by day (last 30 days)
- Pie chart - Loan status distribution
- Real-time data loading

### 3. Customers (`/customers`)
- Paginated customer list
- Search by name/email
- Filter by status
- Click to view details

### 4. Customer Detail (`/customers/:id`)
- Customer information
- Accounts tab
- Recent transactions tab
- Status badges

### 5. Transactions (`/transactions`)
- Paginated transaction list
- Advanced filters:
  - Type (credit, debit, transfer)
  - Status (completed, pending, failed, reversed)
  - Date range
- Color-coded amounts

### 6. Loans (`/loans`)
- Paginated loan list
- Filter by status and type
- Click to view details
- Status indicators

### 7. Loan Detail (`/loans/:id`)
- Loan information
- Customer details
- Financial summary cards
- Repayment progress bar
- EMI amount

## 🔐 Authentication

### Login Flow

1. User enters credentials
2. API call to `/auth/login`
3. JWT token stored in localStorage
4. User redirected to dashboard
5. Token sent with all API requests

### Protected Routes

All routes except `/login` require authentication. Unauthenticated users are redirected to login.

### Logout

Click logout button in header to clear token and return to login.

## 🌐 API Integration

### Axios Configuration

```javascript
// Base URL
const API_BASE_URL = 'http://localhost:4000/api/v1';

// Request interceptor - adds auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handles 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Services

```javascript
// Auth
authAPI.login({ username, password })
authAPI.verify()

// Customers
customersAPI.getAll({ page, limit, status, search })
customersAPI.getById(id)

// Accounts
accountsAPI.getAll({ page, limit, customer_id, status, account_type })
accountsAPI.getById(id)

// Transactions
transactionsAPI.getAll({ page, limit, type, status, from_date, to_date })
transactionsAPI.getById(id)

// Loans
loansAPI.getAll({ page, limit, status, loan_type })
loansAPI.getById(id)

// Dashboard
dashboardAPI.getSummary()
dashboardAPI.getTransactionsByDay()
dashboardAPI.getLoanStatusDistribution()
```

## 🎭 Components

### Layout Components

- **Layout** - Main layout wrapper with sidebar and header
- **Sidebar** - Navigation menu with active state
- **Header** - Top bar with user info and logout

### Shared Components

- **Card** - Reusable card container
- **SkeletonLoader** - Loading placeholders
- **TableSkeleton** - Table loading state
- **CardSkeleton** - Card loading state

### Charts (Recharts)

- **BarChart** - Transactions by day
- **PieChart** - Loan status distribution

## 🧪 Test Automation

All interactive elements have `data-testid` attributes:

```jsx
// Examples
<button data-testid="login-submit-btn">Login</button>
<input data-testid="login-username-input" />
<div data-testid="dashboard-page">...</div>
<tr data-testid="customer-row-123">...</tr>
```

### Common Test IDs

- `login-submit-btn` - Login button
- `login-username-input` - Username input
- `login-password-input` - Password input
- `sidebar` - Navigation sidebar
- `nav-dashboard` - Dashboard nav link
- `nav-customers` - Customers nav link
- `logout-button` - Logout button
- `customers-search-input` - Customer search
- `customers-status-filter` - Status filter
- `customer-row-{id}` - Customer table row

## 🎨 Styling

### Tailwind Classes

```jsx
// Background colors
bg-dark-bg          // Main background
bg-dark-surface     // Cards, surfaces
bg-dark-hover       // Hover states

// Text colors
text-dark-text-primary    // Primary text
text-dark-text-secondary  // Secondary text
text-dark-text-muted      // Muted text

// Accent colors
text-accent-blue     // Primary
text-accent-purple   // Secondary
text-accent-green    // Success
text-accent-red      // Error

// Borders
border-dark-border   // Standard border

// Effects
glow-blue           // Blue glow effect
glow-purple         // Purple glow effect
```

### Custom Animations

```css
/* Skeleton loader */
.skeleton {
  animation: shimmer 2s infinite linear;
}

/* Glow effects */
.glow-blue {
  box-shadow: 0 0 20px rgba(88, 166, 255, 0.3);
}
```

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.1",
  "axios": "^1.6.5",
  "recharts": "^2.10.3",
  "react-icons": "^5.0.1",
  "@headlessui/react": "^1.7.17",
  "clsx": "^2.1.0"
}
```

## 🔧 Configuration

### Vite Config

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
})
```

### Tailwind Config

Custom dark theme colors configured in `tailwind.config.js`.

## 🐛 Troubleshooting

### Issue: API calls fail

**Solution**: Ensure backend is running on port 4000

```bash
cd app
npm run dev
```

### Issue: Charts not rendering

**Solution**: Ensure Recharts is installed

```bash
npm install recharts
```

### Issue: Routing not working

**Solution**: Check React Router is installed

```bash
npm install react-router-dom
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [React Router](https://reactrouter.com/)

---

**Built with**: React 18, Vite, Tailwind CSS, Recharts
