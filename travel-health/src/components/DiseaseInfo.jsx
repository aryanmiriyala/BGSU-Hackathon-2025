// src/components/DiseaseInfo.jsx
import React, { useEffect, useState } from "react";

const DiseaseInfo = ({ country }) => {
    const [diseaseData, setDiseaseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (country) {
            setLoading(true);
            setError(null);

            fetch(`http://localhost:5000/api/diseases/${encodeURIComponent(country)}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setDiseaseData(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching disease data:', error);
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [country]);

    if (!country) return null;
    if (loading) return <div>Loading disease data...</div>;
    if (error) return <div>Error loading data: {error}</div>;
    if (!diseaseData || diseaseData.length === 0) return <div>No disease data available for {country}</div>;

    return (
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <h3>Disease Information for {country}</h3>
            {diseaseData.map((disease, index) => (
                <div key={index} style={{
                    backgroundColor: "white",
                    padding: "15px",
                    marginBottom: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#2563eb" }}>{disease.diseaseName}</h4>
                    <div style={{ fontSize: "14px" }}>
                        <p style={{ margin: "5px 0" }}><strong>Category:</strong> {disease.diseaseCategory}</p>
                        <p style={{ margin: "5px 0" }}><strong>Population Affected:</strong> {disease.populationAffected.toLocaleString()}</p>
                        <p style={{ margin: "5px 0" }}><strong>Healthcare Access:</strong> {disease.healthcareAccess}%</p>
                        <p style={{ margin: "5px 0" }}><strong>Treatment:</strong> {disease.treatmentType}</p>
                        <p style={{ margin: "5px 0" }}><strong>Vaccines Available:</strong> {disease.availabilityOfVaccines}</p>
                        <p style={{ margin: "5px 0" }}><strong>Recovery Rate:</strong> {disease.recoveryRate}%</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DiseaseInfo;