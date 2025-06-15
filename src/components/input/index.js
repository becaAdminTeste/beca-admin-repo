import React from "react";

export default function Input({
  icon,
  title,
  value,
  onChange,
  isZipCode,
  onClick,
  isLoading,
}) {
  return (
    <li
      style={{
        maxWidth: isZipCode ? 605 : 600,
        display: "flex",
        alignItems: "center",
        padding: 4,
        justifyContent: "space-between",
      }}
    >
      <div style={{ alignItems: "center", display: "flex" }}>
        <i style={{ width: 40, bottom: 0 }} className="material-icons">
          {icon}
        </i>
        <span style={{}}>{title}</span>
      </div>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <input
          style={{
            width: isZipCode ? 350 : 450,
            backgroundColor: "#FFF",
            height: 30,
            borderRadius: 8,
            padding: 10,
            border: "1px solid black",
            color: "black",
          }}
          onChange={onChange}
          value={value}
        />
        {isZipCode && (
          <button
            className="mc-btns"
            onClick={onClick}
            style={{ width: 100, height: 30, padding: 6 }}
          >
            {isLoading ? <span className="spinner" /> : "Buscar"}
          </button>
        )}
      </div>
    </li>
  );
}
