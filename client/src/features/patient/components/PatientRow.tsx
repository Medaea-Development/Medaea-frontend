import React from "react";
import { useNavigate } from "react-router-dom";
import PatientAvatar from "./PatientAvatar";
import { calculateAge } from "../../../utils/dateUtils";
import type { PatientProfile } from "../../../types/patient.type";

const PatientRow: React.FC<{ patient: PatientProfile }> = ({ patient }) => {
  const navigate = useNavigate();
  const goToPatient = () => navigate(`/patient/${patient.id}`);

  return (
    <tr
      style={{ cursor: "pointer" }}
      onClick={goToPatient}
      data-testid={`row-patient-${patient.id}`}
    >
      <td>
        <div className="pat-cell">
          <PatientAvatar
            firstName={patient.first_name}
            lastName={patient.last_name}
          />
          <div>
            <div className="pats-name" style={{ color: "#0891b2" }}>
              {patient.first_name} {patient.last_name}
            </div>
            <div className="pat-email">{patient.email}</div>
          </div>
        </div>
      </td>
      <td>{patient.id_number || "—"}</td>
      <td>
        {patient.date_of_birth ? calculateAge(patient.date_of_birth) : "—"}
      </td>
      <td>{patient.gender}</td>
      <td>{patient.last_visit_reason || "—"}</td>
      <td>
        <span
          className={`badge-${(patient.status || "confirmed").toLowerCase().replace(/\s+/g, "-")}`}
        >
          {patient.status || "Confirmed"}
        </span>
      </td>
      <td>{patient.current_room || "—"}</td>
      <td>
        <span className={`enc-${(patient.encounter || "not-started").toLowerCase().replace(/\s+/g, "-")}`}>
          {patient.encounter || "Not Started"}
        </span>
      </td>
      <td onClick={(e) => e.stopPropagation()}>
        <button
          className="btn-view-details"
          data-testid={`btn-view-details-${patient.id}`}
          onClick={goToPatient}
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

export default PatientRow;
