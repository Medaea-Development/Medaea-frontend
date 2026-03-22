import React, { useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  formatFullName,
  formatRole,
  getInitials,
} from "../../utils/stringUtils";

import "../../assets/css/profile.css";
import Button from "../../components/ui/Button";
import { useToast } from "../../hooks/useToast";
import { getAssetUrl } from "../../api/client";
import { uploadAvatar, updateProfile } from "../../api/user";

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth(); // refreshUser handles state + localStorage
  const { showToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
  });

  const displayName = formatFullName(user?.first_name, user?.last_name);
  const initials = getInitials(user?.first_name, user?.last_name);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Text Profile Updates
  const handleToggleEdit = async () => {
    if (isEditing) {
      try {
        const updatedUser = await updateProfile(formData);
        refreshUser(updatedUser); // Sync global state
        showToast("Profile updated successfully", "success");
      } catch (error) {
        console.warn(error);
        showToast("Failed to update profile", "error");
      }
    }
    setIsEditing(!isEditing);
  };

  // Handle Image Upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("File is too large (Max 2MB)", "error");
      return;
    }

    try {
      setUploading(true);
      const response = await uploadAvatar(file);

      // Patch local user state with new URL
      if (user) {
        refreshUser({ ...user, avatar_url: response.avatar_url });
      }

      showToast("Profile picture updated!", "success");
    } catch (error) {
      console.warn(error);
      showToast("Failed to upload image", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  return (
    <div className="container-fluid main-content">
      <div className="profile-container">
        <div className="profile-header-content mb-4">
          <div className="profile-av-wrapper">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              style={{ display: "none" }}
            />
            <div className={`profile-av-big ${uploading ? "opacity-50" : ""}`}>
              {user?.avatar_url ? (
                <img
                  src={getAssetUrl(user.avatar_url)}
                  alt="Profile"
                  className="av-img-fill"
                />
              ) : (
                initials
              )}
              {uploading && (
                <div className="spinner-border spinner-border-sm position-absolute text-light"></div>
              )}
            </div>
            <button
              className="av-edit-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <i className="fa fa-camera"></i>
            </button>
          </div>
          <div className="profile-meta">
            <h2 className="profile-name">{displayName}</h2>
            <p className="profile-role">{formatRole(user?.role)}</p>
            <span className="badge-active">Active Account</span>
          </div>
          <div className="pe-4" style={{ alignSelf: "end" }}>
            <Button className={"edit-btn"} onClick={handleToggleEdit}>
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
            <div className="cal-card">
              <h5 className="section-title">General Information</h5>
              <hr />
              <div className="row g-4 mt-1">
                <div className="col-md-6">
                  <label className="field-label">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    className="form-control med-input"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-6">
                  <label className="field-label">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    className="form-control med-input"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-6">
                  <label className="field-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control med-input"
                    defaultValue={user?.email}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HIPAA Compliance Footer (Matching Calendar) */}
      <div className="cld-box mt-auto">
        <div className="text-center">
          <span>
            Security changes are logged and monitored in accordance with
            <a href="#" className="link-primary mx-1">
              HIPAA Privacy Notice
            </a>
            <a href="#" className="link-primary mx-1">
              Audit Logs
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
