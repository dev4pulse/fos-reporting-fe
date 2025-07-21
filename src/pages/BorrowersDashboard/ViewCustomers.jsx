import React, { useState, useEffect } from 'react';
import './ViewCustomers.css'
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
        const response = await fetch('http://localhost:8080/api/borrowers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to load borrower records');
        const data = await response.json();
        setBorrowers(data);
      } catch (err) {
        setError(err.message);
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
      )}
    </Box>
  );
};

export default ViewCustomers;
