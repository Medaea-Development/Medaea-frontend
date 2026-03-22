import React from "react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  icon?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon = "fa-construction" }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    minHeight: "60vh", padding: "40px 24px", textAlign: "center",
  }}>
    <div style={{
      width: 72, height: 72, borderRadius: "50%", background: "#f0fffe",
      border: "2px solid #00bba7", display: "flex", alignItems: "center",
      justifyContent: "center", marginBottom: 20,
    }}>
      <i className={`fa ${icon}`} style={{ fontSize: 28, color: "#00bba7" }} />
    </div>
    <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{title}</h2>
    <p style={{ fontSize: 14, color: "#6b7280", maxWidth: 380, lineHeight: 1.6, marginBottom: 24 }}>
      This section is coming soon. The {title} module is currently under development
      and will be available in a future update.
    </p>
    <Link
      to="/calendar"
      style={{
        display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px",
        background: "#0891b2", color: "#fff", borderRadius: 8, textDecoration: "none",
        fontSize: 14, fontWeight: 600, transition: "all 0.2s",
      }}
    >
      <i className="fa fa-arrow-left" /> Back to My Schedule
    </Link>
  </div>
);

export default PlaceholderPage;
