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

// Customers sub-pages
import ViewCustomers from './pages/BorrowersDashboard/ViewCustomers';
import AddNewCustomer from './pages/BorrowersDashboard/AddNewCustomer'; // Add this later

// Route protection
import ProtectedRoute from './Components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Registration />} />

      {/* Standalone Dashboard Home */}
      <Route
        path="/dashboard/home"
        element={
          <ProtectedRoute>
            <DashboardHome />
          </ProtectedRoute>
        }
      />

      {/* Protected Dashboard Layout for all other dashboard pages */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="home" />} />
        <Route path="employee" element={<EmployeeDashboard />} />
        <Route path="manager" element={<ManagerDashboard />} />
        <Route path="owner" element={<OwnerDashboard />} />
        <Route path="product" element={<ProductManagement />} />
        <Route path="sales-collections" element={<SalesCollections />} />
        <Route path="borrowers" element={<BorrowersDashboard />} />
        {/* Inventory subroutes */}
        <Route path="inventory" element={<Navigate to="view" />} />
        <Route path="inventory/view" element={<ViewInventory />} />
        <Route path="inventory/add-product" element={<AddProduct />} />
        <Route path="inventory/update" element={<UpdateInventory />} />
        <Route path="inventory/price" element={<UpdatePrice />} />
        {/* Customers subroutes */}
        <Route path="customers" element={<Navigate to="view" />} />
        <Route path="customers/view" element={<ViewCustomers />} />
        <Route path="customers/add" element={<AddNewCustomer />} />
      </Route>

      {/* Redirect any unknown route to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
