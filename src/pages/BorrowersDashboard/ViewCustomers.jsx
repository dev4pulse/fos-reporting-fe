import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ViewCustomers.css";

const ViewCustomers = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);

  // Fetch borrowers
  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8080/borrowers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBorrowers(res.data);
        console.log(res.data)
      } catch (err) {
        setError("Failed to load borrowers");
      } finally {
        setLoading(false);
      }
    };
    fetchBorrowers();
  }, []);

  const filteredBorrowers = borrowers.filter((b) => {
    const s = searchTerm.toLowerCase();
    return (
      String(b.id).includes(s) ||
      b.customerName?.toLowerCase().includes(s) ||
      b.customerVehicle?.toLowerCase().includes(s) ||
      b.phone?.toLowerCase().includes(s)
    );
  });

  // Open update modal
  const handleUpdateClick = (borrower) => {
    setSelectedBorrower({
      ...borrower,
      duePaid: "",
      extraBorrowed: "",
      status: borrower.status,
    });
    setUpdateModalOpen(true);
  };

  // Calculate new due live
  const getUpdatedDue = () => {
    if (!selectedBorrower) return 0;
    const dueAmount = parseFloat(selectedBorrower.dueAmount) || 0;
    const duePaid = parseFloat(selectedBorrower.duePaid) || 0;
    const extraBorrowed = parseFloat(selectedBorrower.extraBorrowed) || 0;
    return (dueAmount - duePaid + extraBorrowed).toFixed(2);
  };

  // Submit update
  const handleUpdateSubmit = async () => {
    const { id, duePaid, extraBorrowed, status } = selectedBorrower;
    const updatedDueAmount = parseFloat(getUpdatedDue());

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8080/borrowers/${id}/update`,
        {
          duePaid: parseFloat(duePaid) || 0,
          extraBorrowed: parseFloat(extraBorrowed) || 0,
          status,
          updatedDueAmount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Borrower updated successfully");
      setBorrowers((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, dueAmount: updatedDueAmount, status } : b
        )
      );
      setUpdateModalOpen(false);
    } catch (err) {
      alert("Failed to update borrower");
    }
  };

  // View details
  const handleViewDetailsClick = async (borrower) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8080/borrowers/${borrower.id}/transactions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Transaction details:", res.data);
      setTransactions(res.data);
      setDetailsModalOpen(true);
    } catch (err) {
      alert("Failed to fetch transaction details");
    }
  };

  return (
    <div className="view-customers">
      <h1>Borrowers</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by ID, Name, Vehicle, Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading borrowers...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="customers-table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Vehicle</th>
                <th>Last Borrowed</th>
                <th>Due Amount (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrowers.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.customerName}</td>
                  <td>{b.phone}</td>
                  <td>{b.customerVehicle}</td>
                  <td>{new Date(b.borrowDate).toLocaleDateString()}</td>
                  <td>{b.amountBorrowed?.toLocaleString("en-IN")}</td>
                  <td>
                    <button className="update-btn" onClick={() => handleUpdateClick(b)}>
                      Update
                    </button>
                    <button
                      className="details-btn"
                      onClick={() => handleViewDetailsClick(b)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Modal */}
      {updateModalOpen && selectedBorrower && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Borrower</h2>
            <p>
              <strong>{selectedBorrower.customerName}</strong> (ID:{" "}
              {selectedBorrower.id})
            </p>
            <p>Current Due Amount: ₹ {selectedBorrower.amountBorrowed}</p>
            <label>
              Due Paid:
              <input
                type="number"
                value={selectedBorrower.duePaid}
                onChange={(e) =>
                  setSelectedBorrower({ ...selectedBorrower, duePaid: e.target.value })
                }
              />
            </label>
            <label>
              Extra Borrowed:
              <input
                type="number"
                value={selectedBorrower.extraBorrowed}
                onChange={(e) =>
                  setSelectedBorrower({
                    ...selectedBorrower,
                    extraBorrowed: e.target.value,
                  })
                }
              />
            </label>
            <p>Updated Due Amount: ₹ {getUpdatedDue()}</p>
            <label>
              Status:
              <select
                value={selectedBorrower.status}
                onChange={(e) =>
                  setSelectedBorrower({ ...selectedBorrower, status: e.target.value })
                }
              >
                <option>Pending</option>
                <option>Closed</option>
                <option>Overdue</option>
              </select>
            </label>
            <div className="modal-actions">
              <button onClick={handleUpdateSubmit} className="submit-btn">
                Save
              </button>
              <button onClick={() => setUpdateModalOpen(false)} className="clear-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Transaction Details</h2>
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount Borrowed</th>
                  <th>Due Paid</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={i}>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td>{t.amountBorrowed}</td>
                    <td>{t.duePaid}</td>
                    <td>{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="modal-actions">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="clear-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCustomers;
