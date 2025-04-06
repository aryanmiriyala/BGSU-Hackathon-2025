import React from "react";
import styles from "./DiseaseInfo.module.css";
import VaccinationChecklist from "./VaccinationChecklist";

const DiseaseInfo = ({ country, data }) => {
  if (!country || !data) return null;

  const organizeData = (diseases) => {
    return diseases.reduce(
      (acc, disease) => {
        const requiresVaccination =
          disease.availabilityOfVaccines.toLowerCase().includes("yes") ||
          disease.availabilityOfVaccines.toLowerCase().includes("available");

        const riskLevel = calculateRiskLevel(disease);
        const diseaseWithRisk = { ...disease, riskLevel };

        if (requiresVaccination) {
          acc.vaccineRequired.push(diseaseWithRisk);
        } else {
          acc.other.push(diseaseWithRisk);
        }
        return acc;
      },
      { vaccineRequired: [], other: [] }
    );
  };

  const calculateRiskLevel = (disease) => {
    const populationRisk = disease.populationAffected > 100000;
    const lowHealthcareAccess = disease.healthcareAccess < 70;
    const lowRecoveryRate = disease.recoveryRate < 85;

    if (populationRisk && (lowHealthcareAccess || lowRecoveryRate))
      return "high";
    if (populationRisk || lowHealthcareAccess || lowRecoveryRate)
      return "medium";
    return "low";
  };

  const diseaseData = organizeData(data);

  return (
    <div style={{ maxHeight: "80vh", overflowY: "auto", padding: "15px" }}>
      <h3 style={{ color: "#1e40af", marginBottom: "20px" }}>
        Travel Health Advisory for {country}
      </h3>

      <VaccinationChecklist
        country={country}
        diseaseData={diseaseData}
      />

      {diseaseData.vaccineRequired.length > 0 && (
        <div className={styles.vaccineSection}>
          <div className={styles.sectionHeader}>
            <span style={{ fontSize: "24px" }}>💉</span>
            <h4 className={styles.sectionTitle}>
              Required Vaccinations
              <span className={styles.tag}>
                {diseaseData.vaccineRequired.length} diseases
              </span>
            </h4>
          </div>

          {diseaseData.vaccineRequired.map((disease, index) => (
            <div key={index} className={styles.diseaseCard}>
              <div className={styles.diseaseHeader}>
                <div>
                  <h5 style={{ margin: "0", fontSize: "16px" }}>
                    {disease.diseaseName}
                  </h5>
                  {disease.occurrences > 1 && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        display: "block",
                      }}
                    >
                      Reported in {disease.occurrences} regions
                    </span>
                  )}
                </div>
                <span
                  className={styles.riskBadge}
                  style={{
                    backgroundColor:
                      disease.riskLevel === "high"
                        ? "#dc2626"
                        : disease.riskLevel === "medium"
                          ? "#f59e0b"
                          : "#10b981",
                  }}
                >
                  {disease.riskLevel.charAt(0).toUpperCase() +
                    disease.riskLevel.slice(1)}{" "}
                  Risk
                </span>
              </div>

              <div className={styles.diseaseMeta}>
                <div>
                  <strong>Category:</strong>
                  <br />
                  {disease.diseaseCategory}
                </div>
                <div>
                  <strong>Population Affected:</strong>
                  <br />
                  {disease.populationAffected.toLocaleString()}
                </div>
                <div>
                  <strong>Healthcare Access:</strong>
                  <br />
                  {disease.healthcareAccess}%
                </div>
                <div>
                  <strong>Treatment:</strong>
                  <br />
                  {disease.treatmentType}
                </div>
                <div>
                  <strong>Recovery Rate:</strong>
                  <br />
                  {disease.recoveryRate}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.recommendations}>
        <h4>Travel Recommendations</h4>
        <ul>
          {diseaseData.vaccineRequired.length > 0 && (
            <>
              <li>
                Get required vaccinations at least 4–6 weeks before travel
              </li>
              <li>Consult with a healthcare provider about vaccinations</li>
              <li>Bring vaccination records with you during travel</li>
            </>
          )}
          <li>Check your travel insurance coverage for medical emergencies</li>
          <li>Research local healthcare facilities at your destination</li>
          <li>Pack appropriate medical supplies and medications</li>
        </ul>
      </div>

      {diseaseData.other.length > 0 && (
        <div className={styles.otherSection}>
          <h4 className={styles.otherSectionTitle}>
            Other Health Considerations
            <span className={styles.otherTag}>
              {diseaseData.other.length} diseases
            </span>
          </h4>

          {diseaseData.other
            .filter((disease) => disease.riskLevel !== "low")
            .map((disease, index) => (
              <div key={index} className={styles.diseaseCard}>
                <div className={styles.diseaseHeader}>
                  <div>
                    <h5 style={{ margin: "0", fontSize: "16px" }}>
                      {disease.diseaseName}
                    </h5>
                    {disease.occurrences > 1 && (
                      <span style={{ fontSize: "12px", color: "#666" }}>
                        Reported in {disease.occurrences} regions
                      </span>
                    )}
                  </div>
                  <span
                    className={styles.riskBadge}
                    style={{
                      backgroundColor:
                        disease.riskLevel === "medium" ? "#f59e0b" : "#64748b",
                    }}
                  >
                    {disease.riskLevel.charAt(0).toUpperCase() +
                      disease.riskLevel.slice(1)}{" "}
                    Risk
                  </span>
                </div>

                <div
                  className={styles.diseaseMeta}
                  style={{ marginTop: "8px" }}
                >
                  <div>
                    <strong>Category:</strong>
                    <br />
                    {disease.diseaseCategory}
                  </div>
                  <div>
                    <strong>Population Affected:</strong>
                    <br />
                    {disease.populationAffected.toLocaleString()}
                  </div>
                  <div>
                    <strong>Treatment:</strong>
                    <br />
                    {disease.treatmentType}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DiseaseInfo;
