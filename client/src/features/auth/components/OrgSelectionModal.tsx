import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import OrgIcon from "../../../assets/img/ic-4.svg";
import type { UserOrg } from "../../../types/auth.types";

interface OrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (orgId: string) => void;
  organizations: UserOrg[];
}

// Custom icon for organization modal
const CustomIcon = (
  <img
    src={OrgIcon}
    alt="Organization Icon"
    style={{ width: 28, height: 28 }}
  />
);

// Custom info icon
const InfoIcon = (
  <i
    className="fas-icon"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
        stroke="#155DFC"
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M9 6V9"
        stroke="#155DFC"
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M9 12H9.00729"
        stroke="#155DFC"
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  </i>
);

const OrgSelectionModal: React.FC<OrgModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  organizations = [],
}) => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredOrgs = (organizations || []).filter(
    (org) =>
      org.name?.toLowerCase().includes(search.toLowerCase()) ||
      org.role?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Organization"
      subtitle="You have access to multiple organizations. Please select the one you want to access."
      icon={CustomIcon}
      iconColor="teal"
      maxWidth="600px"
      preventClose
    >
      <div className="form-group-custom">
        <div className="search-input-wrapper">
          <i className="fas fa-search"></i>
          <input
            type="text"
            className="form-control-custom"
            placeholder="Search by name, role, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="organization-list">
        {filteredOrgs.map((org) => (
          <div
            key={org.id}
            className={`organization-item ${selectedId === org.id ? "selected" : ""}`}
            onClick={() => setSelectedId(org.id)}
          >
            <div className="organization-info">
              <div className="organization-icon">
                <i className={org.icon}></i>
              </div>
              <div className="organization-details">
                <div className="organization-name">{org.name}</div>
                <div className="organization-badges">
                  <span className="organization-badge role">{org.role}</span>
                  <span className="organization-badge type">{org.type}</span>
                </div>
              </div>
            </div>
            <div className="organization-arrow">
              <i className="fas fa-chevron-right"></i>
            </div>
          </div>
        ))}
      </div>

      <Button
        disabled={!selectedId}
        onClick={() => selectedId && onSelect(selectedId)}
      >
        Continue
      </Button>

      <div className="modal-info-box blue mt-4">
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          {InfoIcon}
          <div className="info-box-content">
            <h4 style={{ fontSize: "13px" }}>Organization Context</h4>
            <p className="text-muted-custom" style={{ fontSize: "12px" }}>
              Your access is limited to the selected organization.
              Cross-organization access is not permitted.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrgSelectionModal;
