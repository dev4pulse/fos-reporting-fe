import React, { useState } from 'react';
import axios from 'axios';
import './UploadDocument.css';

const UploadDocument = () => {
  const [formData, setFormData] = useState({
    documentType: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
    renewalPeriodDays: '',
    responsibleParty: '',
    notes: ''
  });

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({
      documentType: '',
      issuingAuthority: '',
      issueDate: '',
      expiryDate: '',
      renewalPeriodDays: '',
      responsibleParty: '',
      notes: ''
    });
    setFile(null);
    document.getElementById('fileInput').value = ''; // Reset file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          data.append(key, value);
        }
      });
      data.append('file', file);

      await axios.post(
        'https://pulse-766719709317.asia-south1.run.app/api/documents',
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setMessage('✅ Document uploaded successfully.');
      resetForm();
    } catch (err) {
      console.error('Upload failed:', err);
      setError('❌ Failed to upload document. Please check all required fields and try again.');
    }
  };

  return (
    <div className="upload-doc-container">
      <h2>Upload New Document</h2>

      <form className="upload-doc-form" onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="form-row">
          <div className="form-group">
            <label>Document Type *</label>
            <input
              type="text"
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              required
              placeholder="e.g., Fitness Certificate"
            />
          </div>
          <div className="form-group">
            <label>Issuing Authority</label>
            <input
              type="text"
              name="issuingAuthority"
              value={formData.issuingAuthority}
              onChange={handleChange}
              placeholder="e.g., Regional Transport Office"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="form-row">
          <div className="form-group">
            <label>Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="form-row">
          <div className="form-group">
            <label>Renewal Period (Days)</label>
            <input
              type="number"
              name="renewalPeriodDays"
              value={formData.renewalPeriodDays}
              onChange={handleChange}
              min="0"
              placeholder="e.g., 365"
            />
          </div>
          <div className="form-group">
            <label>Responsible Party</label>
            <input
              type="text"
              name="responsibleParty"
              value={formData.responsibleParty}
              onChange={handleChange}
              placeholder="e.g., Rahul Sharma"
            />
          </div>
        </div>

        {/* File Input */}
        <div className="form-row">
          <div className="form-group form-group-full">
            <label>Scanned Copy / Digital File *</label>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
          </div>
        </div>

        {/* Notes */}
        <div className="form-row">
          <div className="form-group form-group-full">
            <label>Notes / Comments</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="e.g., Must renew before expiry via Parivahan portal"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="submit-row">
          <button type="submit" className="submit-btn">
            Save Document
          </button>
        </div>

        {/* Feedback */}
        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  );
};

export default UploadDocument;
