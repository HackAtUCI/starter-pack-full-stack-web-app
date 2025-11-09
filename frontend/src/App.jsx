import { useState } from "react";
/*
*/
import axios from 'axios';

function GiveList(text) {
  const responseList = text.split("|")
  return responseList
}

function FileUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          
        },
      });
      
      setResult(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Error uploading file");
      setLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>PDF File Processor</h2>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept=".pdf"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Upload PDF'}
        </button>
      </form>

      {error && (
        <div className="error">
          <p>Error: {error}</p>
        </div>
      )}

      {result && (
        <div className="results">
          <h3>Results:</h3>
          <p><strong>Message:</strong>
          <ul>
            {GiveList(result.message).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          </p>
        </div>
      )}
    </div>
  );
}

export default FileUpload;