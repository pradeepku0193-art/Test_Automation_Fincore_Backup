/**
 * Customer Detail Page
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customersAPI } from '../services/api';
import Card from '../components/Card';
import SkeletonLoader from '../components/SkeletonLoader';
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accounts');

  useEffect(() => {
    loadCustomerDetail();
  }, [id]);

  const loadCustomerDetail = async () => {
    try {
      const response = await customersAPI.getById(id);
      setCustomer(response.data.customer);
      setAccounts(response.data.accounts);
      setTransactions(response.data.recent_transactions);
    } catch (error) {
      console.error('Failed to load customer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader count={3} height="h-40" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-text-secondary">Customer not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="customer-detail-page">
      {/* Back Button */}
      <button
        onClick={() => navigate('/customers')}
        className="flex items-center text-accent-blue hover:text-accent-blue/80 transition-colors"
        data-testid="back-to-customers"
      >
        <FiArrowLeft className="w-5 h-5 mr-2" />
        Back to Customers
      </button>

      {/* Customer Info */}
      <Card title="Customer Information" testId="customer-info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl font-bold text-dark-text-primary mb-4">
              {customer.name}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-dark-text-secondary">
                <FiMail className="w-5 h-5 mr-3" />
                {customer.email}
              </div>
              <div className="flex items-center text-dark-text-secondary">
                <FiPhone className="w-5 h-5 mr-3" />
                {customer.phone}
              </div>
              <div className="flex items-center text-dark-text-secondary">
                <FiMapPin className="w-5 h-5 mr-3" />
                {customer.address}
              </div>
              <div className="flex items-center text-dark-text-secondary">
                <FiCalendar className="w-5 h-5 mr-3" />
                DOB: {new Date(customer.date_of_birth).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-dark-text-secondary">Status</span>
              <div className="mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    customer.status === 'active'
                      ? 'bg-accent-green/20 text-accent-green'
                      : customer.status === 'inactive'
                      ? 'bg-accent-yellow/20 text-accent-yellow'
                      : 'bg-accent-red/20 text-accent-red'
                  }`}
                >
                  {customer.status}
                </span>
              </div>
            </div>
            <div>
              <span className="text-sm text-dark-text-secondary">KYC Status</span>
              <div className="mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    customer.kyc_verified
                      ? 'bg-accent-green/20 text-accent-green'
                      : 'bg-accent-yellow/20 text-accent-yellow'
                  }`}
                >
                  {customer.kyc_verified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
            <div>
              <span className="text-sm text-dark-text-secondary">Customer Since</span>
              <div className="mt-1 text-dark-text-primary">
                {new Date(customer.created_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-dark-border">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`pb-4 px-2 border-b-2 transition-colors ${
              activeTab === 'accounts'
                ? 'border-accent-blue text-accent-blue'
                : 'border-transparent text-dark-text-secondary hover:text-dark-text-primary'
            }`}
            data-testid="tab-accounts"
          >
            Accounts ({accounts.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`pb-4 px-2 border-b-2 transition-colors ${
              activeTab === 'transactions'
                ? 'border-accent-blue text-accent-blue'
                : 'border-transparent text-dark-text-secondary hover:text-dark-text-primary'
            }`}
            data-testid="tab-transactions"
          >
            Recent Transactions ({transactions.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'accounts' && (
        <Card testId="accounts-list">
          <div className="space-y-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="p-4 bg-dark-bg rounded-lg border border-dark-border"
                data-testid={`account-${account.id}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-lg font-semibold text-dark-text-primary">
                      {account.account_number}
                    </div>
                    <div className="text-sm text-dark-text-secondary capitalize mt-1">
                      {account.account_type.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-accent-blue">
                      {account.currency} {parseFloat(account.balance).toLocaleString()}
                    </div>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                        account.status === 'active'
                          ? 'bg-accent-green/20 text-accent-green'
                          : 'bg-accent-yellow/20 text-accent-yellow'
                      }`}
                    >
                      {account.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'transactions' && (
        <Card testId="transactions-list">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">
                    Account
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">
                    Type
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-dark-text-secondary">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="border-b border-dark-border hover:bg-dark-hover transition-colors"
                  >
                    <td className="py-3 px-4 text-dark-text-secondary text-sm">
                      {new Date(txn.transaction_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-dark-text-primary text-sm">
                      {txn.account_number}
                    </td>
                    <td className="py-3 px-4 text-dark-text-secondary text-sm capitalize">
                      {txn.transaction_type}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-medium ${
                        txn.transaction_type === 'credit'
                          ? 'text-accent-green'
                          : 'text-accent-red'
                      }`}
                    >
                      {txn.transaction_type === 'credit' ? '+' : '-'}
                      {txn.currency} {parseFloat(txn.amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          txn.status === 'completed'
                            ? 'bg-accent-green/20 text-accent-green'
                            : 'bg-accent-yellow/20 text-accent-yellow'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
