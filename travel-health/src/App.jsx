import React, { useState } from "react";
import WorldMap from "./components/WorldMap";

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);

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
      {/* Header */}
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
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        Travel Health Advisory Map
      </header>

      {/* Map + Floating Country Display */}
      <main style={{ flex: 1, position: "relative", overflow: "hidden" }}>
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
            }}
          >
            Selected Country: <strong>{selectedCountry}</strong>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
