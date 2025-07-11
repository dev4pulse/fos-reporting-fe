import React, { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import './SalesCollections.css'; // Your custom CSS for this component

const SalesCollections = () => {
  // State for the main form fields
  const [entryDate, setEntryDate] = useState(new Date());
  const [employeeId, setEmployeeId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [employeeFetchError, setEmployeeFetchError] = useState(''); // To display API fetch errors for employees

  // State for the dynamic products section
  const [products, setProducts] = useState([]);

  // State for the dynamic borrowers section
  const [borrowers, setBorrowers] = useState([]);

  // State for collection amounts (initialized as empty strings to allow user input from blank)
  const [cashReceived, setCashReceived] = useState('');
  const [phonePay, setPhonePay] = useState('');
  const [creditCard, setCreditCard] = useState('');

  // --- Effect Hook to Fetch Initial Data (Employees) ---
  useEffect(() => {
    // Fetch active employees when the component mounts
    fetch('/api/active') // This will be proxied by your React dev server to your backend
      .then(res => {
        if (!res.ok) { // Check if the HTTP response status is an error (e.g., 404, 500)
          throw new Error(`HTTP error! Status: ${res.status} - ${res.statusText}`);
        }
        return res.json(); // Parse the response body as JSON
      })
      .then(data => {
        setEmployees(data);
        setEmployeeFetchError(''); // Clear any previous error if fetch succeeds
      })
      .catch(error => {
        // Log detailed error to console for debugging
        console.error('Failed to load employees:', error);
        // Set user-friendly error message for display
        setEmployeeFetchError(`Failed to load employees: ${error.message}. Please ensure the backend API is running and accessible.`);
        // Optionally alert the user (less intrusive than console.error)
        alert(`Failed to load employees. Check browser console for details.`);
      });
  }, []); // Empty dependency array means this effect runs only once after the initial render

  // --- Handlers for Product Section ---
  const handleAddProduct = () => {
    setProducts(prev => [...prev, {
      productName: '',
      gun: '',
      opening: '', // Using empty string for number inputs initially
      closing: '',
      price: '',
      testing: '',
      salesLiters: 0, // Calculated, starts at 0
      salesRupees: 0  // Calculated, starts at 0
    }]);
  };

  const handleRemoveProduct = (index) => {
    setProducts(prev => prev.filter((_, i) => i !== index));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value; // Update the specific field with the new value

    // Logic to fetch last opening meter reading and price when product/gun changes
    if (['productName', 'gun'].includes(field)) {
        const { productName, gun } = updatedProducts[index];
        if (productName && gun) {
            // Fetch last closing data and price in parallel using Promise.all
            Promise.all([
                fetch(`/api/sales/last?productName=${encodeURIComponent(productName)}&gun=${encodeURIComponent(gun)}`).then(res => {
                  if (!res.ok) throw new Error(`Failed to fetch last sales: ${res.status}`);
                  return res.json();
                }),
                fetch(`/api/sales/price?productName=${encodeURIComponent(productName)}&gun=${encodeURIComponent(gun)}`).then(res => {
                  if (!res.ok) throw new Error(`Failed to fetch price: ${res.status}`);
                  return res.json();
                })
            ])
            .then(([lastData, priceData]) => {
                // Update opening and price based on fetched data
                updatedProducts[index].opening = lastData.lastClosing || 0;
                updatedProducts[index].price = priceData || 0;
                calculateSales(updatedProducts[index]); // Recalculate sales after new data
                setProducts(updatedProducts); // Update state only once after both fetches
            })
            .catch(error => {
                console.error(`Failed to fetch product data for ${productName} - ${gun}:`, error);
                alert(`Failed to fetch data for ${productName} - ${gun}. Check console for details.`);
                // Reset related fields if fetch fails
                updatedProducts[index].opening = 0;
                updatedProducts[index].price = 0;
                calculateSales(updatedProducts[index]);
                setProducts(updatedProducts);
            });
        } else {
            // If product name or gun is cleared, reset dependent fields and recalculate
            updatedProducts[index].opening = '';
            updatedProducts[index].price = '';
            calculateSales(updatedProducts[index]);
            setProducts(updatedProducts); // Update immediately for UI responsiveness
        }
    } else {
      // For other fields (opening, closing, testing), just recalculate sales and update
      calculateSales(updatedProducts[index]);
      setProducts(updatedProducts);
    }
  };

  // Helper function to calculate sales liters and rupees for a product row
  const calculateSales = (row) => {
    // Ensure values are numbers for calculation, default to 0 if empty or invalid
    const opening = parseFloat(row.opening) || 0;
    const closing = parseFloat(row.closing) || 0;
    const testing = parseFloat(row.testing) || 0;
    const price = parseFloat(row.price) || 0;

    const liters = Math.max((closing - opening - testing), 0); // Sales liters cannot be negative
    row.salesLiters = liters;
    row.salesRupees = parseFloat((liters * price).toFixed(2)); // Round to 2 decimal places
  };

  // --- Handlers for Borrower Section ---
  const handleAddBorrower = () => {
    setBorrowers(prev => [...prev, { name: '', amount: '' }]); // Initialize amount as empty string
  };

  const handleRemoveBorrower = (index) => {
    setBorrowers(prev => prev.filter((_, i) => i !== index));
  };

  const handleBorrowerChange = (index, field, value) => {
    const updated = [...borrowers];
    updated[index][field] = value;
    setBorrowers(updated);
  };

  // --- Calculations for Collections Summary ---
  // Ensure parsing to float for calculations, default to 0 if input is empty string
  const totalSales = products.reduce((sum, p) => sum + (parseFloat(p.salesRupees) || 0), 0);
  const totalCollection = (parseFloat(cashReceived) || 0) + (parseFloat(phonePay) || 0) + (parseFloat(creditCard) || 0);
  const shortCollections = (totalCollection - totalSales).toFixed(2); // Keep as string for display

  // --- Form Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission (page reload)

    if (!employeeId) {
      return alert('Please select an employee before submitting.');
    }

    // Prepare sales payload, ensuring all numeric fields are correctly parsed
    const payloadSales = {
      date: entryDate.toISOString(), // Send date as ISO string for backend
      employeeId: parseInt(employeeId),
      products: products.map(p => ({
        ...p,
        opening: parseFloat(p.opening) || 0,
        closing: parseFloat(p.closing) || 0,
        price: parseFloat(p.price) || 0,
        testing: parseFloat(p.testing) || 0,
        salesLiters: parseFloat(p.salesLiters) || 0,
        salesRupees: parseFloat(p.salesRupees) || 0,
      }))
    };

    // Prepare collections payload, ensuring all numeric fields are correctly parsed
    const payloadCollections = {
      date: entryDate.toISOString(), // Send date as ISO string
      employeeId: parseInt(employeeId),
      cashReceived: parseFloat(cashReceived) || 0,
      phonePay: parseFloat(phonePay) || 0,
      creditCard: parseFloat(creditCard) || 0,
      shortCollections: parseFloat(shortCollections), // Already float from toFixed
      borrowers: borrowers.map(b => ({
        ...b,
        amount: parseFloat(b.amount) || 0,
      }))
    };

    try {
      // Send both sales and collections data concurrently
      const [salesResponse, collectionsResponse] = await Promise.all([
        fetch('/api/sales', { // Use relative path, relies on proxy
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadSales)
        }),
        fetch('/api/collections', { // Use relative path, relies on proxy
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadCollections)
        })
      ]);

      // Check for success of each response
      if (!salesResponse.ok) {
        const salesError = await salesResponse.text();
        throw new Error(`Sales submission failed: HTTP ${salesResponse.status} - ${salesError}`);
      }
      if (!collectionsResponse.ok) {
        const collectionsError = await collectionsResponse.text();
        throw new Error(`Collections submission failed: HTTP ${collectionsResponse.status} - ${collectionsError}`);
      }

      // Get success messages from backend
      const salesMsg = await salesResponse.text();
      const collectionsMsg = await collectionsResponse.text();

      // Show success message and reload page
      alert(`Submission Successful!\nSales Response: ${salesMsg}\nCollections Response: ${collectionsMsg}`);
      window.location.reload(); // Reloads the entire page to reset state and refetch data
    } catch (err) {
      console.error('Error during submission:', err);
      alert('Error during submission: ' + err.message + '. Please check the console for details and ensure backend is working.');
    }
  };

  // --- JSX Rendering ---
  return (
    <div className="container">
      <h2 className="text-center">Sales & Collections Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-6"> {/* Already 2 columns */}
            <label htmlFor="entryDate" className="form-label">Entry Date & Time</label>
            <Flatpickr
              id="entryDate"
              className="form-control"
              value={entryDate}
              options={{ enableTime: true, dateFormat: "Y-m-d H:i:S" }}
              onChange={([date]) => setEntryDate(date)}
            />
          </div>
          <div className="col-6"> {/* Already 2 columns */}
            <label htmlFor="employeeDropdown" className="form-label">Employee</label>
            <select
              id="employeeDropdown"
              className="form-select"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            >
              <option value="">Select Employee</option>
              {employeeFetchError && (
                <option value="" disabled style={{color: 'red'}}>
                  {employeeFetchError.split('. ')[0]}
                </option>
              )}
              {employees.map(emp => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.employeeId} - {emp.employeeFirstName} {emp.employeeLastName}
                </option>
              ))}
            </select>
            {employeeFetchError && (
                <small className="text-danger mt-1 d-block">{employeeFetchError}</small>
            )}
          </div>
        </div>

        <h4 className="mt-4">Sales Entry</h4>
        {products.map((p, i) => (
          <div key={i} className="row product-block"> {/* Using product-block class for styling */}
            {['Product Name', 'Gun', 'Opening', 'Closing', 'Price', 'Testing', 'Sales Liters', 'Sales Rupees'].map((label, j) => {
              const fieldMap = ['productName', 'gun', 'opening', 'closing', 'price', 'testing', 'salesLiters', 'salesRupees'];
              const field = fieldMap[j];
              const isReadOnly = field === 'salesLiters' || field === 'salesRupees';
              const value = p[field];

              return (
                <div key={j} className="col-4"> {/* Keeps 4 columns on large, adapts to 2 on tablets/mobiles */}
                  <label className="form-label">{label}</label>
                  {['productName', 'gun'].includes(field) ? (
                    <select
                      className="form-select"
                      value={value}
                      onChange={e => handleProductChange(i, field, e.target.value)}
                      required
                    >
                      <option value="">Select</option>
                      {field === 'productName' && ['Petrol', 'Diesel', 'Other'].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                      {field === 'gun' && ['G1', 'G2', 'G3'].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={['opening', 'closing', 'price', 'testing'].includes(field) ? "number" : "text"}
                      className="form-control"
                      value={value}
                      readOnly={isReadOnly}
                      onChange={e => handleProductChange(i, field, e.target.value)}
                      required={!isReadOnly && ['opening', 'closing', 'price'].includes(field)}
                    />
                  )}
                </div>
              );
            })}
            <div className="col-4 d-flex align-items-end"> {/* Use col-4 for alignment, adapts */}
              <button type="button" className="btn btn-remove" onClick={() => handleRemoveProduct(i)}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-add" onClick={handleAddProduct}>Add Product</button>

        <h4 className="mt-4">Collections</h4>
        <div className="row mb-3">
          {[
            { label: 'Cash Received', value: cashReceived, setter: setCashReceived },
            { label: 'Phone Pay', value: phonePay, setter: setPhonePay },
            { label: 'Credit Card', value: creditCard, setter: setCreditCard },
            { label: 'Short Collections', value: shortCollections, readOnly: true },
            { label: 'Total Collection', value: totalCollection.toFixed(2), readOnly: true },
          ].map(({ label, value, setter, readOnly }, i) => (
            <div key={i} className="col-6"> {/* Changed to col-6 for 2-column layout */}
              <label className="form-label">{label}</label>
              <input
                type="number"
                className="form-control"
                value={value}
                onChange={e => setter?.(e.target.value)}
                readOnly={readOnly}
              />
            </div>
          ))}
        </div>

        <h4 className="mt-4">Borrowers</h4>
        {borrowers.map((b, i) => (
          <div key={i} className="row borrower-block"> {/* Using borrower-block class for styling */}
            <div className="col-6"> {/* Changed to col-6 for 2-column layout */}
              <label className="form-label">Borrower Name</label>
              <input type="text" className="form-control" value={b.name} onChange={e => handleBorrowerChange(i, 'name', e.target.value)} />
            </div>
            <div className="col-6"> {/* Changed to col-6 for 2-column layout */}
              <label className="form-label">Amount</label>
              <input type="number" className="form-control" value={b.amount} onChange={e => handleBorrowerChange(i, 'amount', e.target.value)} />
            </div>
            <div className="col-12 d-flex align-items-end"> {/* Use col-12 for remove button on its own row */}
              <button type="button" className="btn btn-remove" onClick={() => handleRemoveBorrower(i)}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-4" onClick={handleAddBorrower}>Add Borrower</button>

        <button type="submit" className="btn btn-submit">Submit All</button>
      </form>
    </div>
  );
};

export default SalesCollections;
