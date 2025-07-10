import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// Import all components from /pages
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import Registration from './pages/Registration';
import DashboardLayout from './pages/DashboardLayout';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import InventoryDashboard from './pages/InventoryDashboard';
import ProductManagement from './pages/ProductManagement';
import SalesCollections from './pages/SalesCollections';
import BorrowersDashboard from './pages/BorrowersDashboard';

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Registration />} />

      {/* Private routes under dashboard layout */}
      <Route path="/dashboard/*" element={<DashboardLayout />}>
        <Route index element={<Navigate to="sales-collections" replace />} />
        <Route path="employee" element={<EmployeeDashboard />} />
        <Route path="manager" element={<ManagerDashboard />} />
        <Route path="owner" element={<OwnerDashboard />} />
        <Route path="inventory" element={<InventoryDashboard />} />
        <Route path="product" element={<ProductManagement />} />
        <Route path="sales-collections" element={<SalesCollections />} />
        <Route path="borrowers" element={<BorrowersDashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
