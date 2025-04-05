import React, { useState, useEffect } from "react";
import WorldMap from "./components/WorldMap";
import DiseaseInfo from "./components/DiseaseInfo";
import Chatbot from "./components/Chatbot";

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [diseaseData, setDiseaseData] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const fetchDiseaseData = async (country) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/diseases/${encodeURIComponent(country)}`,
        {
          credentials: "include",
          headers: { Accept: "application/json" },
        }
      );
      const data = await res.json();
      setDiseaseData(data);
    } catch (error) {
      console.error("Failed to fetch disease data:", error);
      setDiseaseData(null);
    }
  };

  const handleCountryClick = (country) => {
    if (country === selectedCountry) {
      setInfoVisible((prev) => !prev);
    } else {
      setSelectedCountry(country);
      fetchDiseaseData(country);
      setInfoVisible(true);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header
        style={{
          height: "60px",
          backgroundColor: "#1f2937",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "600",
        }}
      >
        Travel Health Advisory Map
      </header>

      <main style={{ flex: 1, position: "relative" }}>
        <WorldMap onCountryClick={handleCountryClick} />

        {/* Popup panel */}
        {selectedCountry && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              backgroundColor: "white",
              padding: "10px 16px",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              fontSize: "14px",
              zIndex: 10,
              minWidth: "300px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            {/* Top-right control: minimize/maximize */}
            <button
              onClick={() => setInfoVisible((prev) => !prev)}
              style={{
                position: "absolute",
                top: "6px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: "#888",
              }}
              title={infoVisible ? "Minimize" : "Expand"}
            >
              {infoVisible ? "_" : "▢"}
            </button>

            <div style={{ marginBottom: "10px", paddingTop: "10px" }}>
              Selected Country: <strong>{selectedCountry}</strong>
            </div>

            {/* Conditionally render only when visible */}
            {infoVisible && diseaseData && (
              <DiseaseInfo country={selectedCountry} data={diseaseData} />
            )}
          </div>
        )}

        {/* Chat widget */}
        <Chatbot open={chatOpen} onClose={() => setChatOpen(false)} />

        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              padding: "12px 16px",
              borderRadius: "50%",
              fontSize: "20px",
              backgroundColor: "#1f2937",
              color: "white",
              border: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              cursor: "pointer",
              zIndex: 10,
            }}
            title="Open Chat"
          >
            💬
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
