import React, { useState, useEffect } from 'react';
import './ViewCustomers.css';
import axios from 'axios';
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';

const ViewCustomers = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all borrowers
  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/borrowers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // Filter borrowers by any searchable field
  const filteredBorrowers = borrowers.filter((borrower) => {
    const search = searchTerm.toLowerCase();
    return (
      String(borrower.borrowId).toLowerCase().includes(search) ||
      String(borrower.customerId).toLowerCase().includes(search) ||
      String(borrower.customerName).toLowerCase().includes(search) ||
      String(borrower.customerPhone).toLowerCase().includes(search) ||
      (borrower.customerEmail && borrower.customerEmail.toLowerCase().includes(search))
    );
  });

  // Calculate total borrowed amount from filtered results
  const totalBorrowedAmount = filteredBorrowers.reduce(
    (sum, borrower) => sum + (borrower.amountBorrowed || 0),
    0
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Borrowers
      </Typography>
      <TextField
        label="Search by ID, Name, Phone, or Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={loading}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : borrowers.length === 0 ? (
        <Typography>No borrower records found</Typography>
      ) : (
        <>
          {/* Show total borrowed amount */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Total Borrowed Amount: ₹ {totalBorrowedAmount.toLocaleString('en-IN')}
          </Typography>

          <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 650 }} aria-label="borrowers">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Borrow ID</TableCell>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Customer Vehicle</TableCell>
                  <TableCell>Amount (₹)</TableCell>
                  <TableCell>Borrow Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBorrowers.map((borrower, index) => (
                  <TableRow key={borrower.borrowId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{borrower.borrowId}</TableCell>
                    <TableCell>{borrower.customerId}</TableCell>
                    <TableCell>{borrower.customerName}</TableCell>
                    <TableCell>{borrower.customerVehicle}</TableCell>
                    <TableCell>{borrower.amountBorrowed.toLocaleString('en-IN')}</TableCell>
                    <TableCell>{new Date(borrower.borrowDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(borrower.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{borrower.status}</TableCell>
                    <TableCell>{borrower.notes || '—'}</TableCell>
                    <TableCell>{borrower.customerPhone}</TableCell>
                    <TableCell>{borrower.customerEmail || '—'}</TableCell>
                    <TableCell>{borrower.customerAddress}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default ViewCustomers;
