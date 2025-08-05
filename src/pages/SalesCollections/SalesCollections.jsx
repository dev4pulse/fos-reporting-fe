import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SalesCollections.css";

const SalesCollections = () => {
  const [entryDate, setEntryDate] = useState(new Date());
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeFetchError, setEmployeeFetchError] = useState("");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [cashReceived, setCashReceived] = useState("");
  const [phonePay, setPhonePay] = useState("");
  const [creditCard, setCreditCard] = useState("");

  // Fetch employees
  useEffect(() => {
    axios
      .get("https://pulse-766719709317.asia-south1.run.app/active")
      .then((res) => setEmployees(res.data))
      .catch((err) => {
        setEmployeeFetchError("Failed to load employees.");
        console.error(err);
      });
  }, []);

  // Fetch active products
  useEffect(() => {
    axios
      .get("https://pulse-766719709317.asia-south1.run.app/products")
      .then((res) => {
        const activeProducts = res.data.filter(
          (p) => p.status && p.status.toUpperCase() === "ACTIVE"
        );
        setAllProducts(activeProducts);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        alert("Unable to load products");
      });
  }, []);

  const handleAddProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        productId: "",
        productName: "",
        gun: "",
        opening: "",
        closing: "",
        price: "",
        testing: "",
        salesLiters: 0,
        salesRupees: 0,
        currentLevel: 0,
        tankCapacity: 0,
        refillSpace: 0,
        metric: "liters",
        error: "",
      },
    ]);
  };

  const handleRemoveProduct = (index) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const recalculateRow = (row) => {
    const opening = parseFloat(row.opening) || 0;
    const closing = parseFloat(row.closing) || 0;
    const testing = parseFloat(row.testing) || 0;
    const price = parseFloat(row.price) || 0;

    let liters = closing - opening - testing;
    if (liters < 0) liters = 0;

    // Validate against current tank capacity
    if (liters > row.currentLevel) {
      row.error = `Sales (${liters.toFixed(
        2
      )} L) exceed current tank level (${row.currentLevel} L).`;
      row.salesLiters = 0;
      row.salesRupees = 0;
      return;
    }

    row.error = "";
    row.salesLiters = liters;
    row.salesRupees = parseFloat((liters * price).toFixed(2));
    row.refillSpace = Math.max(
      (row.tankCapacity ?? 0) - (row.currentLevel - liters),
      0
    );
  };

  const handleProductChange = async (index, field, value) => {
    const updated = [...products];
    const row = updated[index];
    row[field] = value;

    // When selecting product, load price and tank info
    if (field === "productName") {
      const selectedProduct = allProducts.find((p) => p.productName === value);
      if (selectedProduct) {
        row.price = selectedProduct.price;
        row.productId = selectedProduct.productId;

        try {
          const invRes = await axios.get(
            "https://pulse-766719709317.asia-south1.run.app/inventory/latest"
          );
          const invProduct = invRes.data.find(
            (p) => p.productId === selectedProduct.productId
          );
          if (invProduct) {
            row.currentLevel = invProduct.currentLevel ?? 0;
            row.tankCapacity = invProduct.tankCapacity ?? 0;
            row.refillSpace =
              (invProduct.tankCapacity ?? 0) - (invProduct.currentLevel ?? 0);
            row.metric = invProduct.metric || "liters";
          }
        } catch (err) {
          console.error("Failed to fetch inventory details:", err);
        }
      }
    }

    // Fetch last closing for gun
    if (
      (field === "productName" || field === "gun") &&
      row.productName &&
      row.gun
    ) {
      try {
        const res = await axios.get(
          "https://pulse-766719709317.asia-south1.run.app/sales/last",
          { params: { productName: row.productName, gun: row.gun } }
        );
        row.opening = res.data.lastClosing || 0;
      } catch (err) {
        alert(`Error fetching last closing for ${row.productName} - ${row.gun}`);
        console.error(err);
      }
    }

    recalculateRow(row);
    setProducts(updated);
  };

  const totalSales = products.reduce(
    (sum, p) => sum + (parseFloat(p.salesRupees) || 0),
    0
  );
  const totalCollection =
    (parseFloat(cashReceived) || 0) +
    (parseFloat(phonePay) || 0) +
    (parseFloat(creditCard) || 0);
  const shortCollections = (totalCollection - totalSales).toFixed(2);

  const formatDate = (date) => {
    const pad = (n) => (n < 10 ? "0" + n : n);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId) return alert("Select employee");

    if (products.some((p) => p.error)) {
      alert("Please correct errors before submitting.");
      return;
    }

    if (parseFloat(shortCollections) < -10) {
      alert("Short Collections cannot be less than -10");
      return;
    }

    const payloadSales = {
      date: formatDate(entryDate),
      employeeId: parseInt(employeeId),
      products: products.map((p) => ({
        ...p,
        opening: parseFloat(p.opening) || 0,
        closing: parseFloat(p.closing) || 0,
        price: parseFloat(p.price) || 0,
        testing: parseFloat(p.testing) || 0,
        salesLiters: parseFloat(p.salesLiters) || 0,
        salesRupees: parseFloat(p.salesRupees) || 0,
      })),
    };

    const payloadCollections = {
      date: formatDate(entryDate),
      employeeId: parseInt(employeeId),
      cashReceived: parseFloat(cashReceived) || 0,
      phonePay: parseFloat(phonePay) || 0,
      creditCard: parseFloat(creditCard) || 0,
      shortCollections: parseFloat(shortCollections),
    };

    try {
      const inventoryUpdates = products.map((p) =>
        axios.post("https://pulse-766719709317.asia-south1.run.app/inventory", {
          productId: p.productId,
          quantity: -p.salesLiters,
          metric: p.metric,
          employeeId: parseInt(employeeId),
        })
      );

      await Promise.all([
        axios.post(
          "https://pulse-766719709317.asia-south1.run.app/sales",
          payloadSales
        ),
        axios.post(
          "https://pulse-766719709317.asia-south1.run.app/collections",
          payloadCollections
        ),
        ...inventoryUpdates,
      ]);

      alert("Submitted successfully!");
      window.location.reload();
    } catch (err) {
      alert("Error submitting form");
      console.error(err);
    }
  };

  return (
    <div className="sales-collections-container">
      <h2 className="section-title">Sales & Collections</h2>
      <form onSubmit={handleSubmit}>
        {/* Date and Employee */}
        <div className="sales-form">
          <div className="form-group">
            <label>Entry Date & Time</label>
            <DatePicker
              selected={entryDate}
              onChange={setEntryDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd-MM-yyyy HH:mm"
              maxDate={new Date()}
              className="datetime-input"
            />
          </div>

          <div className="form-group">
            <label>Employee</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.employeeId} - {emp.employeeFirstName} {emp.employeeLastName}
                </option>
              ))}
            </select>
            {employeeFetchError && <small>{employeeFetchError}</small>}
          </div>
        </div>

        {/* Sales Section */}
        <h4 className="section-title">Sales</h4>
        {products.map((p, i) => (
          <div className="sales-form" key={i}>
            {[
              "productName",
              "gun",
              "opening",
              "closing",
              "price",
              "testing",
              "salesLiters",
              "salesRupees",
              "currentLevel",
              "refillSpace",
            ].map((field, j) => (
              <div className="form-group" key={j}>
                <label>{field.replace(/([A-Z])/g, " $1")}</label>
                {field === "productName" ? (
                  <select
                    value={p[field]}
                    onChange={(e) =>
                      handleProductChange(i, field, e.target.value)
                    }
                    required
                  >
                    <option value="">Select Product</option>
                    {allProducts.map((prod) => (
                      <option key={prod.productId} value={prod.productName}>
                        {prod.productName}
                      </option>
                    ))}
                  </select>
                ) : field === "gun" ? (
                  <select
                    value={p[field]}
                    onChange={(e) =>
                      handleProductChange(i, field, e.target.value)
                    }
                    required
                  >
                    <option value="">Select Gun</option>
                    {["G1", "G2", "G3"].map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    value={p[field]}
                    onChange={(e) =>
                      handleProductChange(i, field, e.target.value)
                    }
                    readOnly={[
                      "salesLiters",
                      "salesRupees",
                      "price",
                      "opening",
                      "currentLevel",
                      "refillSpace",
                    ].includes(field)}
                    className={
                      field === "closing" && p.error ? "input-error" : ""
                    }
                  />
                )}
                {field === "closing" && p.error && (
                  <small style={{ color: "red" }}>{p.error}</small>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Add & Remove Buttons */}
        <div className="sales-actions">
          <button
            type="button"
            className="submit-btn"
            onClick={handleAddProduct}
          >
            Add Product
          </button>
          <button
            type="button"
            className="sc-remove-button"
            onClick={() => handleRemoveProduct(products.length - 1)}
            disabled={products.length === 0}
          >
            Remove Last Product
          </button>
        </div>

        {/* Collections Section */}
        <h4 className="section-title">Collections</h4>
        <div className="sales-form">
          {[
            { label: "Cash Received", value: cashReceived, setter: setCashReceived },
            { label: "Phone Pay", value: phonePay, setter: setPhonePay },
            { label: "Credit Card", value: creditCard, setter: setCreditCard },
            { label: "Total Collection", value: totalCollection.toFixed(2), readOnly: true },
            { label: "Short Collections", value: shortCollections, readOnly: true },
          ].map(({ label, value, setter, readOnly }, i) => (
            <div className="form-group" key={i}>
              <label>{label}</label>
              <input
                type="number"
                value={value}
                readOnly={readOnly}
                onChange={(e) => setter?.(e.target.value)}
                className={
                  label === "Short Collections" && parseFloat(shortCollections) < -10
                    ? "short-collection-error"
                    : ""
                }
              />
              {label === "Short Collections" && parseFloat(shortCollections) < -10 && (
                <small>Short collections cannot be less than -10</small>
              )}
            </div>
          ))}
        </div>

        <div className="sales-actions">
          <button type="submit" className="submit-btn">
            Submit All
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalesCollections;
