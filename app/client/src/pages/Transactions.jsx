/**
 * Transactions Page
 */

import { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/api';
import Card from '../components/Card';
import { TableSkeleton } from '../components/SkeletonLoader';
import { FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    from_date: '',
    to_date: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadTransactions();
  }, [page]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 50, ...filters };
      // Remove empty filters
      Object.keys(params).forEach(key => !params[key] && delete params[key]);

      const response = await transactionsAPI.getAll(params);
      setTransactions(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyFilters = () => {
    setPage(1);
    loadTransactions();
  };

  const clearFilters = () => {
    setFilters({ type: '', status: '', from_date: '', to_date: '' });
    setPage(1);
  };

  return (
    <div className="space-y-6" data-testid="transactions-page">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-text-primary">Transactions</h1>
        <p className="text-dark-text-secondary mt-1">
          View and filter transaction history
        </p>
      </div>

      {/* Filters */}
      <Card testId="transactions-filters">
        <div className="flex items-center mb-4">
          <FiFilter className="w-5 h-5 text-accent-blue mr-2" />
          <h3 className="text-lg font-semibold text-dark-text-primary">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-accent-blue"
            data-testid="filter-type"
          >
            <option value="">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
            <option value="transfer">Transfer</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-accent-blue"
            data-testid="filter-status"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="reversed">Reversed</option>
          </select>

          <input
            type="date"
            value={filters.from_date}
            onChange={(e) => handleFilterChange('from_date', e.target.value)}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-accent-blue"
            placeholder="From Date"
            data-testid="filter-from-date"
          />

          <input
            type="date"
            value={filters.to_date}
            onChange={(e) => handleFilterChange('to_date', e.target.value)}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-accent-blue"
            placeholder="To Date"
            data-testid="filter-to-date"
          />
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={applyFilters}
            className="px-6 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors"
            data-testid="apply-filters-btn"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-dark-hover hover:bg-dark-border text-dark-text-primary rounded-lg transition-colors"
            data-testid="clear-filters-btn"
          >
            Clear
          </button>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card testId="transactions-table">
        {loading ? (
          <TableSkeleton rows={15} cols={6} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">Account</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">Type</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-text-secondary">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="border-b border-dark-border hover:bg-dark-hover transition-colors"
                      data-testid={`transaction-row-${txn.id}`}
                    >
                      <td className="py-3 px-4 text-dark-text-primary text-sm">{txn.id}</td>
                      <td className="py-3 px-4 text-dark-text-secondary text-sm">
                        {new Date(txn.transaction_date).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-dark-text-primary text-sm">{txn.account_number}</td>
                      <td className="py-3 px-4 text-dark-text-secondary text-sm capitalize">
                        {txn.transaction_type}
                      </td>
                      <td className={`py-3 px-4 text-right font-medium ${
                        txn.transaction_type === 'credit' ? 'text-accent-green' : 'text-accent-red'
                      }`}>
                        {txn.transaction_type === 'credit' ? '+' : '-'}
                        {txn.currency} {parseFloat(txn.amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          txn.status === 'completed' ? 'bg-accent-green/20 text-accent-green' :
                          txn.status === 'pending' ? 'bg-accent-yellow/20 text-accent-yellow' :
                          'bg-accent-red/20 text-accent-red'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-dark-text-secondary">
                Page {page} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-dark-hover hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="prev-page"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-dark-hover hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="next-page"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
