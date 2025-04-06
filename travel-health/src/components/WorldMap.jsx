import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import styles from "./WorldMap.module.css";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = ({ onCountryClick, selectedCountry }) => {
  return (
    <div className={styles.container}>
      <ComposableMap
        projectionConfig={{ scale: 160 }}
        width={980}
        height={480}
        className={styles.map}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => onCountryClick(geo.properties.name)}
                style={{
                  default: {
                    fill:
                      selectedCountry === geo.properties.name
                        ? "#42A5F5"
                        : "#E0E0E0",
                    stroke: "#607D8B",
                    strokeWidth: 0.5,
                    outline: "none",
                  },
                  hover: {
                    fill: "#90CAF9",
                    outline: "none",
                  },
                  pressed: {
                    fill: "#42A5F5",
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default WorldMap;
