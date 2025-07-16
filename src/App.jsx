import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Auth pages
import Login from './pages/Login/login';
import Registration from './pages/Registration/Registration';

// Layout
import DashboardLayout from './pages/DashboardLayout/DashboardLayout';

// Dashboard pages
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard/ManagerDashboard';
import OwnerDashboard from './pages/OwnerDashboard/OwnerDashboard';
import ProductManagement from './pages/ProductManagement/ProductManagement';
import SalesCollections from './pages/SalesCollections/SalesCollections';
import BorrowersDashboard from './pages/BorrowersDashboard/BorrowersDashboard';

// Inventory sub-pages
import ViewInventory from './pages/InventoryDashboard/ViewInventory';
import AddProduct from './pages/InventoryDashboard/AddProduct';
import UpdateInventory from './pages/InventoryDashboard/UpdateInventory';
import UpdatePrice from './pages/InventoryDashboard/UpdatePrice';

// Route protection component
import ProtectedRoute from './Components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Registration />} />

      {/* Protected dashboard routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="sales-collections" replace />} />
        <Route path="employee" element={<EmployeeDashboard />} />
        <Route path="manager" element={<ManagerDashboard />} />
        <Route path="owner" element={<OwnerDashboard />} />
        <Route path="product" element={<ProductManagement />} />
        <Route path="sales-collections" element={<SalesCollections />} />
        <Route path="borrowers" element={<BorrowersDashboard />} />
        <Route path="inventory" element={<Navigate to="inventory/view" replace />} />
        <Route path="inventory/view" element={<ViewInventory />} />
        <Route path="inventory/add-product" element={<AddProduct />} />
        <Route path="inventory/update" element={<UpdateInventory />} />
        <Route path="inventory/price" element={<UpdatePrice />} />
      </Route>

      {/* Catch all: redirect unknown paths */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
