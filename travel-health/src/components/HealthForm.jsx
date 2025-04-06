import React, { useState } from "react";
import styles from "./HealthForm.module.css";

const HealthForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    allergies: "",
    chronicConditions: "",
    recentIllnesses: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let userId = sessionStorage.getItem("userId");
    if (!userId) {
      userId = "userHealthInfo"; // fallback
    }

    try {
      const res = await fetch(`http://localhost:5020/api/health/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSubmitSuccess();
      } else {
        alert("Failed to submit health info.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Health Information</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="allergies"
          placeholder="Any allergies?"
          value={formData.allergies}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="text"
          name="chronicConditions"
          placeholder="Chronic conditions?"
          value={formData.chronicConditions}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="text"
          name="recentIllnesses"
          placeholder="Recent illnesses?"
          value={formData.recentIllnesses}
          onChange={handleChange}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Continue to Map
        </button>
      </form>
    </div>
  );
};

export default HealthForm;
