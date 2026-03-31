import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../../components/common/Alert";
import Loader from "../../components/common/Loader";
import { getAppointments } from "../../services/appointmentService";
import { getDoctors } from "../../services/doctorService";
import { getPatients } from "../../services/patientService";
import { getErrorMessage } from "../../utils/helpers";

function DashboardPage() {
  const [counts, setCounts] = useState({ doctors: 0, patients: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [doctors, patients, appointments] = await Promise.all([
          getDoctors(),
          getPatients(),
          getAppointments()
        ]);
        setCounts({
          doctors: doctors.length,
          patients: patients.length,
          appointments: appointments.length
        });
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load dashboard summary."));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <section>
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>
      <Alert type="error" message={error} />
      <div className="card-grid">
        <div className="summary-card">
          <h3>Total Doctors</h3>
          <p>{counts.doctors}</p>
        </div>
        <div className="summary-card">
          <h3>Total Patients</h3>
          <p>{counts.patients}</p>
        </div>
        <div className="summary-card">
          <h3>Total Appointments</h3>
          <p>{counts.appointments}</p>
        </div>
      </div>
      <div className="quick-actions">
        <Link className="btn btn-primary" to="/doctors/new">
          Add Doctor
        </Link>
        <Link className="btn btn-primary" to="/patients/new">
          Add Patient
        </Link>
        <Link className="btn btn-primary" to="/appointments/book">
          Book Appointment
        </Link>
        <Link className="btn btn-secondary" to="/appointments">
          View Appointments
        </Link>
      </div>
    </section>
  );
}

export default DashboardPage;
