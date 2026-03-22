import { useCallback, useEffect, useState } from "react";
import PatientSearchPage from "./PatientSearchPage";
import "../../assets/css/patient.css";
import type { PatientProfile } from "../../types/patient.type";
import { getAllPatients } from "../../api/patient";

function PatientPage() {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPatients = useCallback(async () => {
    try {
      const data = await getAllPatients();
      setPatients(data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Patients...</span>
        </div>
      </div>
    );
  }

  return <PatientSearchPage patients={patients} onPatientAdded={loadPatients} />;
}

export default PatientPage;
