import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = ({ onCountryClick }) => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ComposableMap
        projectionConfig={{ scale: 160 }}
        width={980}
        height={480}
        style={{ width: "100%", height: "100%" }}
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
                    fill: "#E0E0E0",
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
