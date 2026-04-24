/**
 * Customers Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customersAPI } from '../services/api';
import Card from '../components/Card';
import { TableSkeleton } from '../components/SkeletonLoader';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, [page, status]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 25 };
      if (status) params.status = status;
      if (search) params.search = search;

      const response = await customersAPI.getAll(params);
      setCustomers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadCustomers();
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-accent-green/20 text-accent-green',
      inactive: 'bg-accent-yellow/20 text-accent-yellow',
      blocked: 'bg-accent-red/20 text-accent-red',
    };
    return colors[status] || 'bg-dark-hover text-dark-text-secondary';
  };

  return (
    <div className="space-y-6" data-testid="customers-page">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-text-primary">Customers</h1>
        <p className="text-dark-text-secondary mt-1">
          Manage customer accounts and information
        </p>
      </div>

      {/* Filters */}
      <Card testId="customers-filters">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:border-accent-blue transition-colors"
                data-testid="customers-search-input"
              />
            </div>
          </form>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-accent-blue transition-colors"
            data-testid="customers-status-filter"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors"
            data-testid="customers-search-btn"
          >
            Search
          </button>
        </div>
      </Card>

      {/* Customers Table */}
      <Card testId="customers-table">
        {loading ? (
          <TableSkeleton rows={10} cols={5} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">
                      KYC
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      onClick={() => navigate(`/customers/${customer.id}`)}
                      className="border-b border-dark-border hover:bg-dark-hover cursor-pointer transition-colors"
                      data-testid={`customer-row-${customer.id}`}
                    >
                      <td className="py-3 px-4 text-dark-text-primary">
                        {customer.id}
                      </td>
                      <td className="py-3 px-4 text-dark-text-primary">
                        {customer.name}
                      </td>
                      <td className="py-3 px-4 text-dark-text-secondary">
                        {customer.email}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            customer.status
                          )}`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            customer.kyc_verified
                              ? 'bg-accent-green/20 text-accent-green'
                              : 'bg-accent-yellow/20 text-accent-yellow'
                          }`}
                        >
                          {customer.kyc_verified ? 'Verified' : 'Pending'}
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
                  className="p-2 rounded-lg bg-dark-hover hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  data-testid="customers-prev-page"
                >
                  <FiChevronLeft className="w-5 h-5 text-dark-text-primary" />
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-dark-hover hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  data-testid="customers-next-page"
                >
                  <FiChevronRight className="w-5 h-5 text-dark-text-primary" />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
