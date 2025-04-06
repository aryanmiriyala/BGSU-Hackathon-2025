import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HealthForm.module.css";

const HealthForm = () => {
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Health Info Submitted:", formData);
    localStorage.setItem("healthInfo", JSON.stringify(formData));
    navigate("/map");
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
