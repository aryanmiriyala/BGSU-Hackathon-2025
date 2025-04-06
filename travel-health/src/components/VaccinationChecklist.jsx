import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';

// Define styles for PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30
    },
    header: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        color: '#1e40af',
        fontWeight: 'bold'
    },
    subHeader: {
        fontSize: 14,
        marginBottom: 10,
        color: '#666666'
    },
    vaccineItem: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f3f4f6',
        borderRadius: 4
    },
    vaccineName: {
        fontSize: 14,
        marginBottom: 5,
        color: '#000000'
    },
    riskLevel: {
        fontSize: 12,
        color: '#dc2626'
    },
    dateText: {
        fontSize: 12,
        marginBottom: 20,
        color: '#666666'
    }
});

// PDF Document component
const VaccinationChecklistPDF = ({ country, vaccines }) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>
                    Travel Vaccination Checklist
                </Text>
                <Text style={styles.subHeader}>
                    Country: {country}
                </Text>
                <Text style={styles.dateText}>
                    Generated: {currentDate}
                </Text>

                {vaccines.map((vaccine, index) => (
                    <View key={index} style={styles.vaccineItem}>
                        <Text style={styles.vaccineName}>
                            • {vaccine.diseaseName}
                        </Text>
                        <Text style={styles.riskLevel}>
                            Risk Level: {vaccine.riskLevel.charAt(0).toUpperCase() + vaccine.riskLevel.slice(1)}
                        </Text>
                    </View>
                ))}

                <Text style={[styles.dateText, { marginTop: 20 }]}>
                    Important: Consult with a healthcare provider before travel.
                </Text>
            </Page>
        </Document>
    );
};

// Main component
const VaccinationChecklist = ({ country, diseaseData }) => {
    if (!diseaseData?.vaccineRequired?.length) return null;

    return (
        <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <h3 style={{
                color: '#1e40af',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <span role="img" aria-label="checklist">📋</span>
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
                {({ blob, url, loading, error }) => (
                    <button
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#1e40af',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        disabled={loading}
                    >
                        <span role="img" aria-label="download">📥</span>
                        {loading ? 'Generating PDF...' : 'Download Checklist'}
                    </button>
                )}
            </PDFDownloadLink>

            {/* Preview section */}
            <div style={{ marginTop: '20px' }}>
                <h4 style={{ color: '#4b5563', marginBottom: '10px' }}>
                    Required Vaccinations:
                </h4>
                {diseaseData.vaccineRequired.map((vaccine, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px',
                        backgroundColor: '#f3f4f6',
                        marginBottom: '8px',
                        borderRadius: '4px'
                    }}>
                        <span role="img" aria-label="syringe" style={{ marginRight: '10px' }}>💉</span>
                        <div>
                            <div style={{ fontWeight: '500' }}>
                                {vaccine.diseaseName}
                            </div>
                            <div style={{
                                fontSize: '0.875rem',
                                color: '#dc2626'
                            }}>
                                Risk Level: {vaccine.riskLevel.charAt(0).toUpperCase() + vaccine.riskLevel.slice(1)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VaccinationChecklist;
