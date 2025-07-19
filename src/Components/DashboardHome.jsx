import React from 'react';
import { NavLink } from 'react-router-dom'; // Replace useNavigate with NavLink
import './DashboardHome.css';

const DashboardHome = () => {
  const cards = [
    {
      title: 'View Sales Data',
      description: 'Access detailed reports on daily, weekly, and monthly sales performance.',
      buttonText: 'Go to Sales',
      bgColor: '#e0f0ff',
      btnColor: '#007bff',
      path: '/dashboard/sales-collections',
    },
    {
      title: 'Manage Inventory',
      description: 'Keep track of fuel stock levels and manage your supplies efficiently.',
      buttonText: 'Manage Stock',
      bgColor: '#e6ffee',
      btnColor: '#28a745',
      path: '/dashboard/inventory',
    },
    {
      title: 'Staff Management',
      description: 'Oversee employee schedules, roles, and performance metrics.',
      buttonText: 'View Staff',
      bgColor: '#fff8e6',
      btnColor: '#ffc107',
      path: '/dashboard/employee',
    },
    {
      title: 'Customers',
      description: 'Manage customer accounts, loyalty programs, and feedback.',
      buttonText: 'View Customers',
      bgColor: '#ffe6e6',
      btnColor: '#dc3545',
      path: '/dashboard/customers',
    },
    {
      title: 'Settings & Profile',
      description: 'Update your account details and customize application settings.',
      buttonText: 'Edit Settings',
      bgColor: '#f0e6ff',
      btnColor: '#6f42c1',
      path: '/dashboard/settings',
    },
    {
      title: 'Expenses',
      description: 'Track and manage all operational expenses and financial outflows.',
      buttonText: 'Manage Expenses',
      bgColor: '#e6fff5',
      btnColor: '#20c997',
      path: '/dashboard/expenses',
    },
    {
      title: 'Documents',
      description: 'Access and manage important business documents and records.',
      buttonText: 'View Documents',
      bgColor: '#f3e6ff',
      btnColor: '#6610f2',
      path: '/dashboard/documents',
    },
    {
      title: 'Contact Us',
      description: 'Get support or send us your inquiries and feedback.',
      buttonText: 'Get Support',
      bgColor: '#f5f5f5',
      btnColor: '#343a40',
      path: '/dashboard/contact',
    },
  ];

  return (
    <div className="dashboard-container">
      <h1>Welcome to Pulse!</h1>
      <p className="subtitle">
        You have successfully logged in. This is your personalized dashboard where you can manage your petrol bunk operations.
      </p>
      <div className="card-grid">
        {cards.map((card, index) => (
          <div className="card" style={{ backgroundColor: card.bgColor }} key={index}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <NavLink
              to={card.path}
              className="dashboard-card-link"
              style={{ backgroundColor: card.btnColor }}
            >
              {card.buttonText}
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
