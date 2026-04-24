/**
 * Dashboard Page
 */

import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import Card from '../components/Card';
import { CardSkeleton } from '../components/SkeletonLoader';
import { FiUsers, FiCreditCard, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#58a6ff', '#bc8cff', '#3fb950', '#f85149', '#d29922', '#ff8c00'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [transactionsByDay, setTransactionsByDay] = useState([]);
  const [loanDistribution, setLoanDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [summaryRes, transactionsRes, loansRes] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getTransactionsByDay(),
        dashboardAPI.getLoanStatusDistribution(),
      ]);

      setSummary(summaryRes.data);
      setTransactionsByDay(transactionsRes.data.data);
      setLoanDistribution(loansRes.data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const summaryCards = [
    {
      title: 'Total Customers',
      value: summary?.total_customers,
      icon: FiUsers,
      color: 'text-accent-blue',
      testId: 'summary-customers',
    },
    {
      title: 'Active Accounts',
      value: summary?.active_accounts,
      icon: FiCreditCard,
      color: 'text-accent-purple',
      testId: 'summary-accounts',
    },
    {
      title: 'Transactions Today',
      value: summary?.transactions_today,
      icon: FiTrendingUp,
      color: 'text-accent-green',
      testId: 'summary-transactions',
    },
    {
      title: 'Active Loans',
      value: summary?.active_loans,
      icon: FiDollarSign,
      color: 'text-accent-orange',
      testId: 'summary-loans',
    },
  ];

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-text-primary">Dashboard</h1>
        <p className="text-dark-text-secondary mt-1">
          Overview of your banking system
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          summaryCards.map((card) => (
            <Card key={card.title} testId={card.testId}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-text-secondary mb-1">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-dark-text-primary">
                    {card.value?.toLocaleString() || 0}
                  </p>
                </div>
                <card.icon className={`w-12 h-12 ${card.color}`} />
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transactions by Day */}
        <Card title="Transactions (Last 30 Days)" testId="chart-transactions">
          {loading ? (
            <div className="h-80 skeleton rounded" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis 
                  dataKey="date" 
                  stroke="#8b949e"
                  tick={{ fill: '#8b949e' }}
                />
                <YAxis 
                  stroke="#8b949e"
                  tick={{ fill: '#8b949e' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                    color: '#e6edf3',
                  }}
                />
                <Legend wrapperStyle={{ color: '#8b949e' }} />
                <Bar dataKey="count" fill="#58a6ff" name="Transactions" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Loan Status Distribution */}
        <Card title="Loan Status Distribution" testId="chart-loans">
          {loading ? (
            <div className="h-80 skeleton rounded" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={loanDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) =>
                    `${status}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {loanDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                    color: '#e6edf3',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}
