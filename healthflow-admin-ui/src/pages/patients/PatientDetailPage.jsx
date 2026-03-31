import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Alert from "../../components/common/Alert";
import Loader from "../../components/common/Loader";
import { getPatientById } from "../../services/patientService";
import { getErrorMessage } from "../../utils/helpers";

function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoading(true);
        const data = await getPatientById(id);
        setPatient(data);
      } catch (err) {
        setError(getErrorMessage(err, "Could not load patient details."));
      } finally {
        setLoading(false);
      }
    };
    loadPatient();
  }, [id]);

  if (loading) return <Loader text="Loading patient details..." />;

  return (
    <section>
      <div className="page-header">
        <h2>Patient Detail</h2>
        <Link className="btn btn-secondary" to="/patients">
          Back to list
        </Link>
      </div>
      <Alert type="error" message={error} />
      {patient ? (
        <div className="detail-card">
          <p>
            <strong>ID:</strong> {patient?.id ?? "-"}
          </p>
          <p>
            <strong>Name:</strong> {patient?.name ?? "-"}
          </p>
          <p>
            <strong>Email:</strong> {patient?.email ?? "-"}
          </p>
          <p>
            <strong>Phone:</strong> {patient?.phoneNumber ?? "-"}
          </p>
          <p>
            <strong>Age:</strong> {patient?.age ?? "-"}
          </p>
          <p>
            <strong>Gender:</strong> {patient?.gender ?? "-"}
          </p>
          <p>
            <strong>Concern / notes:</strong> {patient?.concern ?? "-"}
          </p>
          <p>
            <strong>Assigned doctor:</strong> {patient?.assignedDoctorName ?? "-"}
          </p>
          <p>
            <strong>Doctor specialization:</strong> {patient?.assignedDoctorSpecialization ?? "-"}
          </p>
        </div>
      ) : null}
    </section>
  );
}

export default PatientDetailPage;
