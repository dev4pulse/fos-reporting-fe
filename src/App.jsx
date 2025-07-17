import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth pages
import Login from './pages/Login/login';
import Registration from './pages/Registration/Registration';

// Layout
import DashboardLayout from './pages/DashboardLayout/DashboardLayout';
import DashboardHome from './components/DashboardHome';

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

// Route protection
import ProtectedRoute from './Components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Registration />} />

      {/* Protected Dashboard layout with nested routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default page after login */}
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<DashboardHome />} />

        {/* Other dashboard pages */}
        <Route path="employee" element={<EmployeeDashboard />} />
        <Route path="manager" element={<ManagerDashboard />} />
        <Route path="owner" element={<OwnerDashboard />} />
        <Route path="product" element={<ProductManagement />} />
        <Route path="sales-collections" element={<SalesCollections />} />
        <Route path="borrowers" element={<BorrowersDashboard />} />

        {/* Inventory subroutes */}
        <Route path="inventory" element={<Navigate to="inventory/view" replace />} />
        <Route path="inventory/view" element={<ViewInventory />} />
        <Route path="inventory/add-product" element={<AddProduct />} />
        <Route path="inventory/update" element={<UpdateInventory />} />
        <Route path="inventory/price" element={<UpdatePrice />} />
      </Route>

      {/* Redirect any unknown route to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
