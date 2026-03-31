import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Alert from "../../components/common/Alert";
import Loader from "../../components/common/Loader";
import { getAppointments } from "../../services/appointmentService";
import { getDoctorById } from "../../services/doctorService";
import {
  findNextAppointmentForDoctor,
  getErrorMessage,
  readableDate
} from "../../utils/helpers";

function DoctorDetailPage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nextAppointment, setNextAppointment] = useState(null);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentError, setAppointmentError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDoctor = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getDoctorById(id);
        if (!cancelled) setDoctor(data);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Could not load doctor details."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDoctor();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!doctor?.id) return;

    let cancelled = false;

    const loadNextAppointment = async () => {
      try {
        setAppointmentLoading(true);
        setAppointmentError("");
        setNextAppointment(null);
        const list = await getAppointments();
        if (cancelled) return;
        setNextAppointment(findNextAppointmentForDoctor(list, doctor.id));
      } catch (err) {
        if (!cancelled) {
          setAppointmentError(
            getErrorMessage(err, "Could not load appointment information.")
          );
        }
      } finally {
        if (!cancelled) setAppointmentLoading(false);
      }
    };

    loadNextAppointment();
    return () => {
      cancelled = true;
    };
  }, [doctor?.id]);

  if (loading) return <Loader text="Loading doctor details..." />;

  return (
    <section>
      <div className="page-header">
        <h2>Doctor Detail</h2>
        <Link className="btn btn-secondary" to="/doctors">
          Back to list
        </Link>
      </div>
      <Alert type="error" message={error} />
      {doctor ? (
        <>
          <div className="detail-card">
            <p>
              <strong>ID:</strong> {doctor?.id ?? "-"}
            </p>
            <p>
              <strong>Name:</strong> {doctor?.name ?? "-"}
            </p>
            <p>
              <strong>Specialization:</strong> {doctor?.specialization ?? "-"}
            </p>
            <p>
              <strong>Email:</strong> {doctor?.email ?? "-"}
            </p>
            <p>
              <strong>Phone:</strong> {doctor?.phoneNumber ?? "-"}
            </p>
          </div>

          <div className="detail-card" style={{ marginTop: 20 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "1.1rem" }}>Next Appointment</h3>
            <Alert type="error" message={appointmentError} />
            {appointmentLoading ? (
              <Loader text="Loading next appointment..." />
            ) : nextAppointment ? (
              <>
                <p>
                  <strong>Appointment ID:</strong> {nextAppointment?.id ?? "-"}
                </p>
                <p>
                  <strong>Patient name:</strong> {nextAppointment?.patientName ?? "-"}
                </p>
                <p>
                  <strong>Patient concern:</strong> {nextAppointment?.patientConcern ?? "-"}
                </p>
                <p>
                  <strong>Appointment date:</strong>{" "}
                  {readableDate(nextAppointment?.appointmentDate)}
                </p>
                <p>
                  <strong>Status:</strong> {nextAppointment?.status ?? "-"}
                </p>
              </>
            ) : (
              <p style={{ margin: 0, color: "#64748b" }}>
                No upcoming appointments for this doctor.
              </p>
            )}
          </div>
        </>
      ) : null}
    </section>
  );
}

export default DoctorDetailPage;
