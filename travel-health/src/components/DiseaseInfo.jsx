// src/components/DiseaseInfo.jsx
import React, { useEffect, useState } from "react";

const DiseaseInfo = ({ country }) => {
    const [diseaseData, setDiseaseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (country) {
            setLoading(true);
            fetch(`http://localhost:5000/api/diseases/${encodeURIComponent(country)}`, {
                headers: { 'Accept': 'application/json' }
            })
                .then(response => response.json())
                .then(data => {
                    const organized = organizeData(data);
                    setDiseaseData(organized);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [country]);

    const organizeData = (diseases) => {
        return diseases.reduce((acc, disease) => {
            const requiresVaccination = disease.availabilityOfVaccines.toLowerCase().includes('yes') ||
                disease.availabilityOfVaccines.toLowerCase().includes('available');
            const riskLevel = calculateRiskLevel(disease);

            if (requiresVaccination) {
                acc.vaccineRequired.push({ ...disease, riskLevel });
            } else {
                acc.other.push({ ...disease, riskLevel });
            }
            return acc;
        }, { vaccineRequired: [], other: [] });
    };

    const calculateRiskLevel = (disease) => {
        const populationRisk = disease.populationAffected > 100000;
        const lowHealthcareAccess = disease.healthcareAccess < 70;
        const lowRecoveryRate = disease.recoveryRate < 85;

        if (populationRisk && (lowHealthcareAccess || lowRecoveryRate)) {
            return 'high';
        } else if (populationRisk || lowHealthcareAccess || lowRecoveryRate) {
            return 'medium';
        }
        return 'low';
    };

    if (!country) return null;
    if (loading) return <div>Loading health information...</div>;
    if (error) return <div>Error loading data: {error}</div>;
    if (!diseaseData) return <div>No health data available for {country}</div>;

    return (
        <div style={{ maxHeight: "80vh", overflowY: "auto", padding: "15px" }}>
            <h3 style={{ color: "#1e40af", marginBottom: "20px" }}>
                Travel Health Advisory for {country}
            </h3>

            {/* Required Vaccinations Section */}
            {diseaseData.vaccineRequired.length > 0 && (
                <div style={{
                    backgroundColor: "#fee2e2",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    border: "1px solid #fecaca"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "15px"
                    }}>
                        <span style={{ fontSize: "24px" }}>💉</span>
                        <h4 style={{
                            margin: 0,
                            color: "#dc2626",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}>
                            Required Vaccinations
                            <span style={{
                                fontSize: "14px",
                                backgroundColor: "#dc2626",
                                color: "white",
                                padding: "2px 8px",
                                borderRadius: "12px"
                            }}>
                                {diseaseData.vaccineRequired.length} diseases
                            </span>
                        </h4>
                    </div>

                    {diseaseData.vaccineRequired.map((disease, index) => (
                        <div key={index} style={{
                            backgroundColor: "white",
                            padding: "15px",
                            marginBottom: "10px",
                            borderRadius: "8px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                        }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: "10px"
                            }}>
                                <div>
                                    <h5 style={{ margin: "0", fontSize: "16px" }}>{disease.diseaseName}</h5>
                                    {disease.occurrences > 1 && (
                                        <span style={{
                                            fontSize: "12px",
                                            color: "#666",
                                            marginTop: "4px",
                                            display: "block"
                                        }}>
                                            Reported in {disease.occurrences} regions
                                        </span>
                                    )}
                                </div>
                                <span style={{
                                    backgroundColor: disease.riskLevel === 'high' ? '#dc2626' :
                                        disease.riskLevel === 'medium' ? '#f59e0b' : '#10b981',
                                    color: "white",
                                    padding: "2px 8px",
                                    borderRadius: "4px",
                                    fontSize: "12px"
                                }}>
                                    {disease.riskLevel.charAt(0).toUpperCase() + disease.riskLevel.slice(1)} Risk
                                </span>
                            </div>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                                gap: "10px",
                                fontSize: "14px"
                            }}>
                                <div>
                                    <strong>Category:</strong><br />
                                    {disease.diseaseCategory}
                                </div>
                                <div>
                                    <strong>Population Affected:</strong><br />
                                    {disease.populationAffected.toLocaleString()}
                                </div>
                                <div>
                                    <strong>Healthcare Access:</strong><br />
                                    {disease.healthcareAccess}%
                                </div>
                                <div>
                                    <strong>Treatment:</strong><br />
                                    {disease.treatmentType}
                                </div>
                                <div>
                                    <strong>Recovery Rate:</strong><br />
                                    {disease.recoveryRate}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Travel Recommendations */}
            <div style={{
                backgroundColor: "#e0f2fe",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #bae6fd"
            }}>
                <h4 style={{ margin: "0 0 15px 0", color: "#0369a1" }}>
                    Travel Recommendations
                </h4>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {diseaseData.vaccineRequired.length > 0 && (
                        <>
                            <li>Get required vaccinations at least 4-6 weeks before travel</li>
                            <li>Consult with a healthcare provider about vaccinations</li>
                            <li>Bring vaccination records with you during travel</li>
                        </>
                    )}
                    <li>Check your travel insurance coverage for medical emergencies</li>
                    <li>Research local healthcare facilities at your destination</li>
                    <li>Pack appropriate medical supplies and medications</li>
                </ul>
            </div>

            {/* Other Health Risks */}
            {diseaseData.other.length > 0 && (
                <div style={{
                    backgroundColor: "#f8fafc",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0"
                }}>
                    <h4 style={{
                        margin: "0 0 15px 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}>
                        Other Health Considerations
                        <span style={{
                            fontSize: "14px",
                            backgroundColor: "#64748b",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "12px"
                        }}>
                            {diseaseData.other.length} diseases
                        </span>
                    </h4>

                    {diseaseData.other
                        .filter(disease => disease.riskLevel !== 'low')
                        .map((disease, index) => (
                            <div key={index} style={{
                                backgroundColor: "white",
                                padding: "15px",
                                marginBottom: "10px",
                                borderRadius: "8px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                            }}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start"
                                }}>
                                    <div>
                                        <h5 style={{ margin: "0", fontSize: "16px" }}>{disease.diseaseName}</h5>
                                        {disease.occurrences > 1 && (
                                            <span style={{
                                                fontSize: "12px",
                                                color: "#666",
                                                marginTop: "4px",
                                                display: "block"
                                            }}>
                                                Reported in {disease.occurrences} regions
                                            </span>
                                        )}
                                    </div>
                                    <span style={{
                                        backgroundColor: disease.riskLevel === 'medium' ? '#f59e0b' : '#64748b',
                                        color: "white",
                                        padding: "2px 8px",
                                        borderRadius: "4px",
                                        fontSize: "12px"
                                    }}>
                                        {disease.riskLevel.charAt(0).toUpperCase() + disease.riskLevel.slice(1)} Risk
                                    </span>
                                </div>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                                    gap: "10px",
                                    fontSize: "14px",
                                    marginTop: "8px"
                                }}>
                                    <div>
                                        <strong>Category:</strong><br />
                                        {disease.diseaseCategory}
                                    </div>
                                    <div>
                                        <strong>Population Affected:</strong><br />
                                        {disease.populationAffected.toLocaleString()}
                                    </div>
                                    <div>
                                        <strong>Treatment:</strong><br />
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