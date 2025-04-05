import React, { useState } from "react";
import WorldMap from "./components/WorldMap";

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <div style={{ height: "100vh", width: "100vw", textAlign: "center" }}>
      <h1 style={{ margin: "16px 0", fontSize: "24px" }}>
        Travel Health Advisory Map
      </h1>
      <WorldMap onCountryClick={setSelectedCountry} />
      {selectedCountry && (
        <p style={{ marginTop: "16px" }}>
          Selected Country: <strong>{selectedCountry}</strong>
        </p>
      )}
    </div>
  );
}

export default App;
