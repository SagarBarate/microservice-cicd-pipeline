import { useEffect, useState } from "react";
import Alert from "../../components/common/Alert";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import { getAppointments } from "../../services/appointmentService";
import { getErrorMessage, readableDate } from "../../utils/helpers";

function AppointmentListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const data = await getAppointments();
        setRows(data);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load appointments."));
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, []);

  if (loading) return <Loader text="Loading appointments..." />;

  return (
    <section>
      <div className="page-header">
        <h2>Appointments</h2>
      </div>
      <Alert type="error" message={error} />
      <DataTable
        rows={rows}
        columns={[
          { key: "id", title: "ID" },
          { key: "doctorId", title: "Doctor ID" },
          { key: "patientId", title: "Patient ID" },
          {
            key: "appointmentDate",
            title: "Appointment Date",
            render: (row) => readableDate(row?.appointmentDate)
          }
        ]}
      />
    </section>
  );
}

export default AppointmentListPage;
