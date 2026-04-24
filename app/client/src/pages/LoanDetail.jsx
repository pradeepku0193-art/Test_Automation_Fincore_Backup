/**
 * Loan Detail Page
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loansAPI } from '../services/api';
import Card from '../components/Card';
import SkeletonLoader from '../components/SkeletonLoader';
import { FiArrowLeft, FiUser, FiMail, FiCalendar, FiDollarSign } from 'react-icons/fi';

export default function LoanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoanDetail();
  }, [id]);

  const loadLoanDetail = async () => {
    try {
      const response = await loansAPI.getById(id);
      setLoan(response.data);
    } catch (error) {
      console.error('Failed to load loan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader count={2} height="h-40" />
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-text-secondary">Loan not found</p>
      </div>
    );
  }

  const repaymentPercentage = loan.repayment_percentage || 0;

  return (
    <div className="space-y-6" data-testid="loan-detail-page">
      {/* Back Button */}
      <button
        onClick={() => navigate('/loans')}
        className="flex items-center text-accent-blue hover:text-accent-blue/80 transition-colors"
        data-testid="back-to-loans"
      >
        <FiArrowLeft className="w-5 h-5 mr-2" />
        Back to Loans
      </button>

      {/* Loan Information */}
      <Card title="Loan Information" testId="loan-info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <span className="text-sm text-dark-text-secondary">Loan ID</span>
              <div className="text-2xl font-bold text-dark-text-primary mt-1">#{loan.id}</div>
            </div>
            <div>
              <span className="text-sm text-dark-text-secondary">Loan Type</span>
              <div className="text-lg text-dark-text-primary mt-1 capitalize">{loan.loan_type}</div>
            </div>
            <div>
              <span className="text-sm text-dark-text-secondary">Status</span>
              <div className="mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  loan.status === 'active' ? 'bg-accent-green/20 text-accent-green' :
                  loan.status === 'closed' ? 'bg-dark-hover text-dark-text-secondary' :
                  loan.status === 'defaulted' ? 'bg-accent-red/20 text-accent-red' :
                  'bg-accent-yellow/20 text-accent-yellow'
                }`}>
                  {loan.status}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-dark-text-secondary">
              <FiUser className="w-5 h-5 mr-3" />
              {loan.customer_name}
            </div>
            <div className="flex items-center text-dark-text-secondary">
              <FiMail className="w-5 h-5 mr-3" />
              {loan.customer_email}
            </div>
            <div className="flex items-center text-dark-text-secondary">
              <FiCalendar className="w-5 h-5 mr-3" />
              {new Date(loan.start_date).toLocaleDateString()} - {new Date(loan.end_date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-dark-text-secondary">
              <FiDollarSign className="w-5 h-5 mr-3" />
              Duration: {loan.loan_duration_days} days
            </div>
          </div>
        </div>
      </Card>

      {/* Financial Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card testId="principal-amount">
          <div className="text-sm text-dark-text-secondary mb-2">Principal Amount</div>
          <div className="text-3xl font-bold text-accent-blue">
            ${parseFloat(loan.principal_amount).toLocaleString()}
          </div>
        </Card>

        <Card testId="outstanding-amount">
          <div className="text-sm text-dark-text-secondary mb-2">Outstanding Amount</div>
          <div className="text-3xl font-bold text-accent-orange">
            ${parseFloat(loan.outstanding_amount).toLocaleString()}
          </div>
        </Card>

        <Card testId="interest-rate">
          <div className="text-sm text-dark-text-secondary mb-2">Interest Rate</div>
          <div className="text-3xl font-bold text-accent-purple">
            {parseFloat(loan.interest_rate).toFixed(2)}%
          </div>
        </Card>
      </div>

      {/* Repayment Progress */}
      <Card title="Repayment Progress" testId="repayment-progress">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-dark-text-secondary">Repaid</span>
            <span className="text-dark-text-primary font-medium">{repaymentPercentage}%</span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-blue to-accent-purple transition-all duration-500"
              style={{ width: `${repaymentPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-dark-text-secondary">
            <span>$0</span>
            <span>${parseFloat(loan.principal_amount).toLocaleString()}</span>
          </div>
        </div>

        {loan.emi_amount && (
          <div className="mt-6 p-4 bg-dark-bg rounded-lg">
            <div className="text-sm text-dark-text-secondary mb-1">Monthly EMI</div>
            <div className="text-2xl font-bold text-accent-green">
              ${parseFloat(loan.emi_amount).toLocaleString()}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
