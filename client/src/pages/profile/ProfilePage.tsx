import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { updateProfile } from "../../api/user";
import Footer from "../../components/layout/Footer";
import { formatFullName, formatRole, getInitials } from "../../utils/stringUtils";
import "../../assets/css/profile.css";

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updateProfile({ first_name: firstName, last_name: lastName });
      refreshUser(updated);
      showToast("Profile updated successfully!", "success");
      setIsEditing(false);
    } catch {
      showToast("Failed to update profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setIsEditing(false);
  };

  const initials = getInitials(user?.first_name, user?.last_name);
  const displayName = formatFullName(user?.first_name, user?.last_name);
  const org = user?.organizations?.[0];

  return (
    <div className="profile-container">
      <div className="profile-header-content">
        <div className="profile-av-wrapper">
          <div className="profile-av-big">
            {user?.avatar_url ? <img src={user.avatar_url} className="av-img-fill" alt="Avatar" /> : initials}
          </div>
        </div>
        <div className="profile-meta">
          <div className="profile-name">{displayName}</div>
          <div className="profile-role">{formatRole(user?.role)} {user?.specialty ? `· ${user.specialty}` : ""}</div>
          <span className="badge-active">Active</span>
          {org && <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}><i className="fa fa-building me-1" />{org.name}</div>}
        </div>
        <div style={{ marginLeft: "auto" }}>
          {!isEditing ? (
            <button className="edit-btn" onClick={() => setIsEditing(true)}><i className="fa fa-pen me-1" />Edit Profile</button>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }} onClick={handleCancel}>Cancel</button>
              <button className="edit-btn" onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</button>
            </div>
          )}
        </div>
      </div>

      <div className="page-card" style={{ padding: "24px" }}>
        <div className="section-title" style={{ marginBottom: "16px" }}>Personal Information</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label className="field-label">First Name</label>
            <input className="med-input" value={isEditing ? firstName : (user?.first_name || "")} onChange={(e) => setFirstName(e.target.value)} disabled={!isEditing} />
          </div>
          <div>
            <label className="field-label">Last Name</label>
            <input className="med-input" value={isEditing ? lastName : (user?.last_name || "")} onChange={(e) => setLastName(e.target.value)} disabled={!isEditing} />
          </div>
          <div>
            <label className="field-label">Email Address</label>
            <input className="med-input" value={user?.email || ""} disabled />
          </div>
          <div>
            <label className="field-label">Phone Number</label>
            <input className="med-input" value={user?.phone || ""} disabled />
          </div>
          <div>
            <label className="field-label">Role</label>
            <input className="med-input" value={formatRole(user?.role)} disabled />
          </div>
          <div>
            <label className="field-label">Specialty</label>
            <input className="med-input" value={user?.specialty || "—"} disabled />
          </div>
        </div>
      </div>

      {user?.organizations && user.organizations.length > 0 && (
        <div className="page-card" style={{ padding: "24px", marginTop: "16px" }}>
          <div className="section-title" style={{ marginBottom: "16px" }}>Organization</div>
          {user.organizations.map((org) => (
            <div key={org.id} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", background: "#e0f2fe", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fa fa-hospital" style={{ color: "#0891b2" }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "#1a1a1a", fontSize: "14px" }}>{org.name}</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>{org.role} {org.dept ? `· ${org.dept}` : ""}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProfilePage;
