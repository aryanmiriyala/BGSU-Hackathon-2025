import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import styles from "./VaccinationChecklist.module.css";

// Define styles for PDF
const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    color: "#1e40af",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 10,
    color: "#666666",
  },
  vaccineItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
  },
  vaccineName: {
    fontSize: 14,
    marginBottom: 5,
    color: "#000000",
  },
  riskLevel: {
    fontSize: 12,
    color: "#dc2626",
  },
  dateText: {
    fontSize: 12,
    marginBottom: 20,
    color: "#666666",
  },
});

const VaccinationChecklistPDF = ({ country, vaccines }) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.header}>Travel Vaccination Checklist</Text>
        <Text style={pdfStyles.subHeader}>Country: {country}</Text>
        <Text style={pdfStyles.dateText}>Generated: {currentDate}</Text>

        {vaccines.map((vaccine, index) => (
          <View key={index} style={pdfStyles.vaccineItem}>
            <Text style={pdfStyles.vaccineName}>• {vaccine.diseaseName}</Text>
            <Text style={pdfStyles.riskLevel}>
              Risk Level:{" "}
              {vaccine.riskLevel.charAt(0).toUpperCase() +
                vaccine.riskLevel.slice(1)}
            </Text>
          </View>
        ))}

        <Text style={[pdfStyles.dateText, { marginTop: 20 }]}>
          Important: Consult with a healthcare provider before travel.
        </Text>
      </Page>
    </Document>
  );
};

const VaccinationChecklist = ({ country, diseaseData }) => {
  if (!diseaseData?.vaccineRequired?.length) return null;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>
        <span role="img" aria-label="checklist">
          📋
        </span>
        Vaccination Checklist
      </h3>

      <PDFDownloadLink
        document={
          <VaccinationChecklistPDF
            country={country}
            vaccines={diseaseData.vaccineRequired}
          />
        }
        fileName={`${country}-vaccination-checklist.pdf`}
      >
        {({ loading }) => (
          <button className={styles.downloadButton} disabled={loading}>
            <span role="img" aria-label="download">
              📥
            </span>
            {loading ? "Generating PDF..." : "Download Checklist"}
          </button>
        )}
      </PDFDownloadLink>

      <div className={styles.preview}>
        <h4 className={styles.previewTitle}>Required Vaccinations:</h4>
        {diseaseData.vaccineRequired.map((vaccine, index) => (
          <div key={index} className={styles.previewItem}>
            <span
              role="img"
              aria-label="syringe"
              style={{ marginRight: "10px" }}
            >
              💉
            </span>
            <div>
              <div className={styles.previewItemText}>
                {vaccine.diseaseName}
              </div>
              <div className={styles.riskLevel}>
                Risk Level:{" "}
                {vaccine.riskLevel.charAt(0).toUpperCase() +
                  vaccine.riskLevel.slice(1)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VaccinationChecklist;
