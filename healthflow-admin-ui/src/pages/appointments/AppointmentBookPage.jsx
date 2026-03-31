import { useState } from "react";
import Alert from "../../components/common/Alert";
import InputField from "../../components/common/InputField";
import { bookAppointment } from "../../services/appointmentService";
import { appointmentFormModel } from "../../utils/formModels";
import { getErrorMessage } from "../../utils/helpers";

function AppointmentBookPage() {
  const [form, setForm] = useState(appointmentFormModel);
  const [errors, setErrors] = useState({});
  const [bookingMode, setBookingMode] = useState("appointment-service");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const validate = () => {
    const nextErrors = {};
    if (!form.doctorId) nextErrors.doctorId = "Doctor ID is required.";
    if (!form.patientId) nextErrors.patientId = "Patient ID is required.";
    if (!form.appointmentDate) nextErrors.appointmentDate = "Appointment date is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      setAlert({ type: "", message: "" });
      await bookAppointment(
        {
          doctorId: Number(form.doctorId),
          patientId: Number(form.patientId),
          appointmentDate: form.appointmentDate
        },
        bookingMode
      );
      setAlert({ type: "success", message: "Appointment booked successfully." });
      setForm(appointmentFormModel);
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err, "Booking failed.") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="page-header">
        <h2>Book Appointment</h2>
      </div>
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="mode">Booking Service</label>
          <select
            id="mode"
            value={bookingMode}
            onChange={(e) => setBookingMode(e.target.value)}
          >
            <option value="appointment-service">Appointment Service</option>
            <option value="patient-service">Patient Service</option>
          </select>
        </div>
        <InputField
          label="Doctor ID"
          name="doctorId"
          type="number"
          value={form.doctorId}
          onChange={(e) => setForm((prev) => ({ ...prev, doctorId: e.target.value }))}
          error={errors.doctorId}
          required
        />
        <InputField
          label="Patient ID"
          name="patientId"
          type="number"
          value={form.patientId}
          onChange={(e) => setForm((prev) => ({ ...prev, patientId: e.target.value }))}
          error={errors.patientId}
          required
        />
        <InputField
          label="Appointment Date"
          name="appointmentDate"
          type="datetime-local"
          value={form.appointmentDate}
          onChange={(e) => setForm((prev) => ({ ...prev, appointmentDate: e.target.value }))}
          error={errors.appointmentDate}
          required
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </section>
  );
}

export default AppointmentBookPage;
