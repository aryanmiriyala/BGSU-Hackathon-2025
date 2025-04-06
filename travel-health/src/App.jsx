import React, { useEffect, useState } from "react";
import WorldMap from "./components/WorldMap";
import DiseaseInfo from "./components/DiseaseInfo";
import Chatbot from "./components/Chatbot";
import HealthForm from "./components/HealthForm";
import styles from "./App.module.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiMinus, FiMaximize, FiMessageSquare } from "react-icons/fi";
import { Moon, Sun, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const storedMode = localStorage.getItem("darkMode");
    return storedMode === "false";
  });

  const [userId, setUserId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [diseaseData, setDiseaseData] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMaximized, setChatMaximized] = useState(false);
  const [hasHealthInfo, setHasHealthInfo] = useState(null);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) setUserId(storedId);
  }, []);

  useEffect(() => {
    const checkHealthInfo = async () => {
      if (!userId) return;
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
    return <HealthForm onSubmit={handleHealthFormSubmitted} userId={userId} />;
  }

  return (
    <div className={`${styles.appContainer} ${darkMode ? "dark" : ""}`}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          Travel <span className={styles.highlightTitle}>Health Advisory</span>{" "}
          Map
        </div>
        <div className={styles.headerRight}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className={styles.headerButton}
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className={styles.headerButton}
            title="Logout"
          >
            <LogOut size={22} className={styles.icon} />
            <span className={styles.buttonText}>Logout</span>
          </motion.button>
        </div>
      </header>

      <main className={styles.mainWrapper}>
        <div className={chatMaximized ? styles.mapShrunk : styles.mapFull}>
          <WorldMap
            onCountryClick={handleCountryClick}
            selectedCountry={selectedCountry}
          />

          {selectedCountry && (
            <div className={infoVisible ? styles.panel : styles.panelMinimized}>
              <button
                className={styles.toggleButton}
                onClick={() => setInfoVisible((prev) => !prev)}
                title={infoVisible ? "Minimize" : "Expand"}
              >
                {infoVisible ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
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
        </div>

        {chatOpen && (
          <Chatbot
            open={chatOpen}
            onClose={() => {
              setChatOpen(false);
              setChatMaximized(false);
            }}
            userId={userId}
            maximized={chatMaximized}
            onToggleMaximize={() => setChatMaximized((prev) => !prev)}
          />
        )}

        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className={styles.chatToggle}
            title="Open Chat"
          >
            <FiMessageSquare />
          </button>
        )}
      </main>

      <ToastContainer />
    </div>
  );
}

export default App;
