import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewDocuments.css';

const ViewDocuments = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get('https://pulse-766719709317.asia-south1.run.app/api/documents');
        setDocuments(res.data || []);
        console.log(res.data)
      } catch (err) {
        console.error('Failed to fetch documents:', err);
      }
    };
    fetchDocuments();
  }, []);

  const handleDownload = (docUrl, docType) => {
    const link = document.createElement('a');
    link.href = docUrl;
    link.setAttribute('download', `${docType}.pdf`); // Change extension if needed
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="view-documents-container">
      <h2>All Documents</h2>
      <table className="documents-table">
        <thead>
          <tr>
            <th>Document Type</th>
            <th>Issuing Authority</th>
            <th>Issue Date</th>
            <th>Expiry Date</th>
            <th>Document Link</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((doc, index) => (
              <tr key={index}>
                <td>{doc.documentType}</td>
                <td>{doc.issuingAuthority}</td>
                <td>{doc.issueDate}</td>
                <td>{doc.expiryDate}</td>
                <td>
                  <button
                    className="view-document-link"
                    onClick={() => handleDownload(doc.documentUrl, doc.type)}
                  >
                    View Document
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">
                No documents available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="upload-button-container">
        <button
          className="upload-doc-button"
          onClick={() => (window.location.href = '/dashboard/documents/upload')}
        >
          Upload New Document
        </button>
      </div>
    </div>
  );
};

export default ViewDocuments;
