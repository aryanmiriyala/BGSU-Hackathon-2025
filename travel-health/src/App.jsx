import React, { useEffect, useState } from "react";
import WorldMap from "./components/WorldMap";
import DiseaseInfo from "./components/DiseaseInfo";
import Chatbot from "./components/Chatbot";
import HealthForm from "./components/HealthForm";
import styles from "./App.module.css";

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [diseaseData, setDiseaseData] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [hasHealthInfo, setHasHealthInfo] = useState(null);

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const checkHealthInfo = async () => {
      if (!userId) {
        setHasHealthInfo(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5020/api/health/${userId}`);
        setHasHealthInfo(res.ok);
      } catch {
        setHasHealthInfo(false);
      }
    };

    checkHealthInfo();
  }, [userId]);

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

  const handleHealthFormSubmitted = () => {
    setHasHealthInfo(true);
  };

  if (hasHealthInfo === null) return <div>Loading...</div>;

  if (!hasHealthInfo) {
    return <HealthForm onSubmit={handleHealthFormSubmitted} />;
  }

  return (
    <div className={styles.appContainer}>
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
                      Loading health data for <strong>{selectedCountry}</strong>
                      ...
                    </div>
                  </div>
                ) : (
                  <div className={styles.fadeIn}>
                    <DiseaseInfo country={selectedCountry} data={diseaseData} />
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
    </div>
  );
}

export default App;
