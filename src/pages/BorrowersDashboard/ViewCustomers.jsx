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
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        // Adjust API endpoint as per your backend
        const response = await fetch('https://your-api.com/api/customers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to load customers');
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Filter customers by customer_id or phone_number
  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase();
    return (
      String(customer.customer_id).toLowerCase().includes(search) ||
      String(customer.phone_number).toLowerCase().includes(search)
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Customers
      </Typography>
      <TextField
        label="Search by ID or Phone"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : customers.length === 0 ? (
        <Typography>No customers found</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Customer ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Date Joined</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.customer_id}>
                  <TableCell>{customer.customer_id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                  <TableCell>{customer.email || '-'}</TableCell>
                  <TableCell>
                    {new Date(customer.created_at).toLocaleDateString()}
                  </TableCell>
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
