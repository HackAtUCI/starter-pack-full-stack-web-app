import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [jobTitle, setJobTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileUpload = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleStart = () => {
    console.log("Job Title:", jobTitle);
    console.log("PDF File:", pdfFile);
    setCount(count + 1);
  };

  return (
    <div id="root">
      {/* Header */}
      <header className="header">
        <h1 className="header-title">Resume Builder</h1>
        <h2 className="header-subtitle">Build your professional resume quickly</h2>
      </header>

      {/* Main content */}
      <main className="main-content">
        <p className="main-text">Welcome! Start building your resume.</p>

        {/* Job Title Input */}
        <div className="input-section">
          <label htmlFor="jobTitle">What job are you applying for?</label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Type here"
          />
        </div>

        {/* Upload PDF */}
        <div className="input-section">
          <label htmlFor="pdfUpload">Upload your PDF resume:</label>
          <input
            type="file"
            id="pdfUpload"
            accept=".pdf"
            onChange={handleFileUpload}
          />
          {pdfFile && <p>Selected file: {pdfFile.name}</p>}
        </div>
      </main>

      {/* Footer button */}
      <footer className="footer">
        <button className="start-button" onClick={handleStart}>
          Get Started
        </button>
      </footer>
    </div>
  );
}

export default App;
