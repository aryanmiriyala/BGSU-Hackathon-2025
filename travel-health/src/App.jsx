import React, { useState } from "react";
import WorldMap from "./components/WorldMap";
import DiseaseInfo from "./components/DiseaseInfo";
import Chatbot from "./components/Chatbot";

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

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
        <WorldMap onCountryClick={setSelectedCountry} />

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
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              Selected Country: <strong>{selectedCountry}</strong>
            </div>
            <DiseaseInfo country={selectedCountry} />
          </div>
        )}

        <Chatbot open={chatOpen} onClose={() => setChatOpen(false)} />

        {/* Chat Toggle Button */}
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