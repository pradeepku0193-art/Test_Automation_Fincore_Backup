/**
 * Loans Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loansAPI } from '../services/api';
import Card from '../components/Card';
import { TableSkeleton } from '../components/SkeletonLoader';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [loanType, setLoanType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    loadLoans();
  }, [page, status, loanType]);

  const loadLoans = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 25 };
      if (status) params.status = status;
      if (loanType) params.loan_type = loanType;

      const response = await loansAPI.getAll(params);
      setLoans(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Failed to load loans:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="loans-page">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-text-primary">Loans</h1>
        <p className="text-dark-text-secondary mt-1">
          Manage and monitor loan accounts
        </p>
      </div>

      {/* Filters */}
      <Card testId="loans-filters">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-accent-blue"
            data-testid="filter-status"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="defaulted">Defaulted</option>
            <option value="restructured">Restructured</option>
          </select>

          <select
            value={loanType}
            onChange={(e) => {
              setLoanType(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-accent-blue"
            data-testid="filter-loan-type"
          >
            <option value="">All Types</option>
            <option value="home">Home</option>
            <option value="personal">Personal</option>
            <option value="auto">Auto</option>
            <option value="education">Education</option>
          </select>
        </div>
      </Card>

      {/* Loans Table */}
      <Card testId="loans-table">
        {loading ? (
          <TableSkeleton rows={10} cols={6} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">Type</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-text-secondary">Principal</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-text-secondary">Outstanding</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-text-secondary">Rate</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr
                      key={loan.id}
                      onClick={() => navigate(`/loans/${loan.id}`)}
                      className="border-b border-dark-border hover:bg-dark-hover cursor-pointer transition-colors"
                      data-testid={`loan-row-${loan.id}`}
                    >
                      <td className="py-3 px-4 text-dark-text-primary">{loan.id}</td>
                      <td className="py-3 px-4 text-dark-text-primary">{loan.customer_name}</td>
                      <td className="py-3 px-4 text-dark-text-secondary capitalize">{loan.loan_type}</td>
                      <td className="py-3 px-4 text-right text-dark-text-primary">
                        ${parseFloat(loan.principal_amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-accent-orange">
                        ${parseFloat(loan.outstanding_amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-dark-text-secondary">
                        {parseFloat(loan.interest_rate).toFixed(2)}%
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          loan.status === 'active' ? 'bg-accent-green/20 text-accent-green' :
                          loan.status === 'closed' ? 'bg-dark-hover text-dark-text-secondary' :
                          loan.status === 'defaulted' ? 'bg-accent-red/20 text-accent-red' :
                          'bg-accent-yellow/20 text-accent-yellow'
                        }`}>
                          {loan.status}
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
