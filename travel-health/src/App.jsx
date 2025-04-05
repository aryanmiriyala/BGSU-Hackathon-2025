import React, { useState } from "react";
import WorldMap from "./components/WorldMap";

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountryClick = (countryName) => {
    setSelectedCountry(countryName);
    // Here you'll later call API or fetch metrics
    console.log("Selected country:", countryName);
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">🌍 Travel Health Advisory</h1>
      <WorldMap onCountryClick={handleCountryClick} />
      {selectedCountry && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Health Advisory for {selectedCountry}
          </h2>
          <p>Loading health metrics...</p>
        </div>
      )}
    </div>
  );
}

export default App;
