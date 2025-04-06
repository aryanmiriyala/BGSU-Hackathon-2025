import React, { useState } from "react";
import styles from "./HealthForm.module.css";

const HealthForm = ({ onSubmit, userId }) => {
  const [formData, setFormData] = useState({
    chronicConditions: [],
    pastSurgeries: "",
    medications: "",
    symptoms: [],
    onsetDate: "",
    severity: "",
    requiresAccommodations: false,
    accommodationDetails: "",
    assistiveDevices: [],
    allergies: "",
  });

  const chronicOptions = [
    "Diabetes",
    "Asthma",
    "Hypertension",
    "Heart Disease",
    "Autoimmune Disorders",
  ];

  const symptomOptions = [
    "Fever",
    "Cough",
    "Shortness of breath",
    "Fatigue",
    "Loss of taste/smell",
    "Rash or skin issues",
    "Headaches",
    "Digestive issues",
  ];

  const assistiveOptions = ["Wheelchair", "Hearing Aid", "Cane/Walker"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "requiresAccommodations") {
      setFormData((prev) => ({ ...prev, requiresAccommodations: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelect = (e, key) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const current = new Set(prev[key]);
      checked ? current.add(value) : current.delete(value);
      return { ...prev, [key]: [...current] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.error("User ID is missing.");
      return;
    }

    // Fill in empty fields as "none"
    const sanitizedData = {
      ...formData,
      pastSurgeries: formData.pastSurgeries.trim() || "none",
      medications: formData.medications.trim() || "none",
      onsetDate: formData.onsetDate || "none",
      severity: formData.severity || "none",
      accommodationDetails: formData.requiresAccommodations
        ? formData.accommodationDetails.trim() || "none"
        : "none",
      allergies: formData.requiresAccommodations
        ? formData.allergies.trim() || "none"
        : "none",
    };

    try {
      const res = await fetch(`http://localhost:5020/api/health/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      });

      if (res.ok) {
        onSubmit(); // Notify App to switch view
      } else {
        console.error("Failed to save health info.");
      }
    } catch (err) {
      console.error("Error submitting health form:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.heading}>Health Information Form</h2>

      {/* Medical History */}
      <h3 className={styles.sectionTitle}>Medical History</h3>

      <label className={styles.label}>Chronic Conditions:</label>
      <div className={styles.checkboxGroup}>
        {chronicOptions.map((condition) => (
          <label key={condition} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              value={condition}
              checked={formData.chronicConditions.includes(condition)}
              onChange={(e) => handleMultiSelect(e, "chronicConditions")}
            />
            {condition}
          </label>
        ))}
      </div>

      <label className={styles.label}>
        Past Surgeries or Hospitalizations:
      </label>
      <textarea
        name="pastSurgeries"
        value={formData.pastSurgeries}
        onChange={handleChange}
        className={styles.textarea}
      />

      <label className={styles.label}>Current Medications:</label>
      <input
        name="medications"
        value={formData.medications}
        onChange={handleChange}
        className={styles.input}
      />

      {/* Symptoms */}
      <h3 className={styles.sectionTitle}>Current Symptoms</h3>

      <div className={styles.checkboxGroup}>
        {symptomOptions.map((symptom) => (
          <label key={symptom} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              value={symptom}
              checked={formData.symptoms.includes(symptom)}
              onChange={(e) => handleMultiSelect(e, "symptoms")}
            />
            {symptom}
          </label>
        ))}
      </div>

      <label className={styles.label}>Symptom Onset Date:</label>
      <input
        type="date"
        name="onsetDate"
        value={formData.onsetDate}
        onChange={handleChange}
        className={styles.input}
      />

      <label className={styles.label}>Severity:</label>
      <select
        name="severity"
        value={formData.severity}
        onChange={handleChange}
        className={styles.select}
      >
        <option value="">Select...</option>
        <option value="Mild">Mild</option>
        <option value="Moderate">Moderate</option>
        <option value="Severe">Severe</option>
      </select>

      {/* Accommodations */}
      <h3 className={styles.sectionTitle}>Accommodations</h3>

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          name="requiresAccommodations"
          checked={formData.requiresAccommodations}
          onChange={handleChange}
        />
        I require medical or accessibility accommodations
      </label>

      {formData.requiresAccommodations && (
        <>
          <label className={styles.label}>Accommodation Details:</label>
          <textarea
            name="accommodationDetails"
            value={formData.accommodationDetails}
            onChange={handleChange}
            className={styles.textarea}
          />

          <label className={styles.label}>Assistive Devices:</label>
          <div className={styles.checkboxGroup}>
            {assistiveOptions.map((device) => (
              <label key={device} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  value={device}
                  checked={formData.assistiveDevices.includes(device)}
                  onChange={(e) => handleMultiSelect(e, "assistiveDevices")}
                />
                {device}
              </label>
            ))}
          </div>

          <label className={styles.label}>Allergies:</label>
          <input
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            className={styles.input}
          />
        </>
      )}

      <button type="submit" className={styles.button}>
        Submit
      </button>
    </form>
  );
};

export default HealthForm;
