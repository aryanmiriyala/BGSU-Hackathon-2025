import React, { useEffect, useState } from "react";
import WorldMap from "./components/WorldMap";
import DiseaseInfo from "./components/DiseaseInfo";
import Chatbot from "./components/Chatbot";
import HealthForm from "./components/HealthForm";
import styles from "./App.module.css";
import { FiMessageCircle } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [userId, setUserId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [diseaseData, setDiseaseData] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMaximized, setChatMaximized] = useState(false);
  const [hasHealthInfo, setHasHealthInfo] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) setUserId(storedId);
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5020/api/health/${userId}`)
      .then((res) => setHasHealthInfo(res.ok))
      .catch(() => setHasHealthInfo(false));
  }, [userId]);

  const fetchDiseaseData = async (country) => {
    try {
      const res = await fetch(
        `http://localhost:5020/api/diseases/${encodeURIComponent(country)}`
      );
      const data = await res.json();
      setDiseaseData(data);
    } catch (error) {
      console.error("Error fetching disease data:", error);
      setDiseaseData(null);
    }
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    fetchDiseaseData(country);
    setInfoVisible(true); // ensure panel always opens
  };

  const handleHealthFormSubmitted = () => setHasHealthInfo(true);

  if (hasHealthInfo === null) return <div>Loading...</div>;
  if (!hasHealthInfo)
    return <HealthForm onSubmit={handleHealthFormSubmitted} userId={userId} />;

  return (
    <div className={`${styles.appContainer} ${darkMode ? "dark" : ""}`}>
      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {darkMode ? "☀️" : "🌙"}
      </button>

      <header className={styles.header}>Travel Health Advisory Map</header>

      <main
        className={`${styles.main} ${chatMaximized ? styles.mainWithChat : ""}`}
      >
        <div className={styles.contentWrapper}>
          <WorldMap
            onCountryClick={handleCountryClick}
            selectedCountry={selectedCountry}
          />

          {selectedCountry && (
            <div className={styles.panel}>
              <button
                className={styles.toggleButton}
                onClick={() => setInfoVisible((prev) => !prev)}
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
                      Loading health data for {selectedCountry}...
                    </div>
                  ) : (
                    <DiseaseInfo country={selectedCountry} data={diseaseData} />
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <Chatbot
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          userId={userId}
          maximized={chatMaximized}
          setMaximized={setChatMaximized}
        />

        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className={styles.chatToggle}
          >
            <FiMessageCircle />
          </button>
        )}
      </main>

      <ToastContainer />
    </div>
  );

  function toggleDarkMode() {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  }
}

export default App;
