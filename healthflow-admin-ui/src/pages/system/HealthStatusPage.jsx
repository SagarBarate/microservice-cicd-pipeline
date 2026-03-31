import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { appointmentHealth } from "../../services/appointmentService";
import { doctorHealth } from "../../services/doctorService";
import { patientHealth } from "../../services/patientService";

function HealthStatusPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({
    doctor: false,
    patient: false,
    appointment: false
  });

  useEffect(() => {
    const check = async () => {
      setLoading(true);
      const [doctorResult, patientResult, appointmentResult] = await Promise.allSettled([
        doctorHealth(),
        patientHealth(),
        appointmentHealth()
      ]);
      setStatus({
        doctor: doctorResult.status === "fulfilled",
        patient: patientResult.status === "fulfilled",
        appointment: appointmentResult.status === "fulfilled"
      });
      setLoading(false);
    };
    check();
  }, []);

  if (loading) return <Loader text="Checking service health..." />;

  return (
    <section>
      <div className="page-header">
        <h2>System Health Check</h2>
      </div>
      <div className="status-grid">
        <div className="status-card">
          <h3>Doctor Service</h3>
          <StatusBadge healthy={status.doctor} />
        </div>
        <div className="status-card">
          <h3>Patient Service</h3>
          <StatusBadge healthy={status.patient} />
        </div>
        <div className="status-card">
          <h3>Appointment Service</h3>
          <StatusBadge healthy={status.appointment} />
        </div>
      </div>
    </section>
  );
}

export default HealthStatusPage;
