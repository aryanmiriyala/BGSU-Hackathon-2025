import React, { useState } from "react";
import WorldMap from "./components/WorldMap";
import DiseaseInfo from "./components/DiseaseInfo";
import Chatbot from "./components/Chatbot";
import styles from "./App.module.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const storedMode = localStorage.getItem("darkMode");
    return storedMode === "true";
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [diseaseData, setDiseaseData] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const fetchDiseaseData = async (country) => {
    try {
      const res = await fetch(
        `http://localhost:5020/api/diseases/${encodeURIComponent(country)}`
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
      setDiseaseData(null);
      fetchDiseaseData(country);
      setInfoVisible(true);
    }
  };

  return (
    <div className={`${styles.appContainer} ${darkMode ? "dark" : ""}`}>
      <button
        onClick={toggleDarkMode}
        className="dark-mode-toggle"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <header className={styles.header}>Travel Health Advisory Map</header>

      <main className={styles.main}>
        <WorldMap
          onCountryClick={handleCountryClick}
          selectedCountry={selectedCountry}
        />

        {selectedCountry && (
          <div className={styles.panel}>
            <button
              className={styles.toggleButton}
              onClick={() => setInfoVisible((prev) => !prev)}
              title={infoVisible ? "Minimize" : "Expand"}
            >
              {infoVisible ? "_" : "▢"}
            </button>

            <div className={styles.countryHeader}>
              Selected Country: <strong>{selectedCountry}</strong>
            </div>

            {infoVisible && (
              <>
                {!diseaseData ? (
                  <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <div>
                      Loading health data for{" "}
                      <strong>{selectedCountry}</strong>...
                    </div>
                  </div>
                ) : (
                  <div className={styles.fadeIn}>
                    <DiseaseInfo
                      country={selectedCountry}
                      data={diseaseData}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <Chatbot open={chatOpen} onClose={() => setChatOpen(false)} />

        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className={styles.chatToggle}
            title="Open Chat"
          >
            💬
          </button>
        )}
      </main>

      {/* ✅ Toast messages appear here */}
      <ToastContainer />
    </div>
  );
}

export default App;
