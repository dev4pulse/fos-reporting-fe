import React, { useState, useEffect } from 'react';
import './ViewCustomers.css';
import axios from 'axios';

const ViewCustomers = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/borrowers', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBorrowers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load borrower records');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowers();
  }, []);

  const filteredBorrowers = borrowers.filter((borrower) => {
    const search = searchTerm.toLowerCase();
    return (
      String(borrower.id).toLowerCase().includes(search) ||
      String(borrower.customerName).toLowerCase().includes(search) ||
      String(borrower.customerVehicle).toLowerCase().includes(search) ||
      String(borrower.phone).toLowerCase().includes(search) ||
      (borrower.email && borrower.email.toLowerCase().includes(search)) ||
      (borrower.address && borrower.address.toLowerCase().includes(search))
    );
  });

  const totalBorrowedAmount = filteredBorrowers.reduce(
    (sum, borrower) => sum + (borrower.amountBorrowed || 0),
    0
  );

  return (
    <div className="view-customers">
      <h1>Borrowers</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by ID, Name, Vehicle, Phone, Email, or Address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>

      {loading ? (
        <div className="loading">Loading borrowers...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : borrowers.length === 0 ? (
        <div className="empty-message">No borrower records found</div>
      ) : (
        <>
          <div className="total-amount">
            Total Borrowed Amount: ₹ {totalBorrowedAmount.toLocaleString('en-IN')}
          </div>
          <div className="customers-table-container">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Borrow ID</th>
                  <th>Customer Name</th>
                  <th>Vehicle</th>
                  <th>Employee ID</th>
                  <th>Amount (₹)</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredBorrowers.map((borrower, index) => (
                  <tr key={borrower.id}>
                    <td>{index + 1}</td>
                    <td>{borrower.id}</td>
                    <td>{borrower.customerName}</td>
                    <td>{borrower.customerVehicle}</td>
                    <td>{borrower.employeeId}</td>
                    <td>{borrower.amountBorrowed.toLocaleString('en-IN')}</td>
                    <td>{new Date(borrower.borrowDate).toLocaleDateString()}</td>
                    <td>{new Date(borrower.dueDate).toLocaleDateString()}</td>
                    <td>{borrower.status}</td>
                    <td>{borrower.notes || '—'}</td>
                    <td>{borrower.phone}</td>
                    <td>{borrower.email || '—'}</td>
                    <td>{borrower.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewCustomers;
