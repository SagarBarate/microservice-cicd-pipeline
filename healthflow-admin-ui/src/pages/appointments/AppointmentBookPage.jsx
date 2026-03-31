import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/common/Alert";
import InputField from "../../components/common/InputField";
import Loader from "../../components/common/Loader";
import { bookAppointment } from "../../services/appointmentService";
import { getDoctors } from "../../services/doctorService";
import { appointmentFormModel } from "../../utils/formModels";
import { getErrorMessage } from "../../utils/helpers";

function AppointmentBookPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(appointmentFormModel);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [doctorLoadError, setDoctorLoadError] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setDoctorsLoading(true);
        setDoctorLoadError("");
        const list = await getDoctors();
        setDoctors(list);
      } catch (err) {
        setDoctorLoadError(getErrorMessage(err, "Could not load doctors."));
      } finally {
        setDoctorsLoading(false);
      }
    };
    loadDoctors();
  }, []);

  const selectedDoctor = doctors.find((d) => String(d.id) === String(form.doctorId));

  const validate = () => {
    const nextErrors = {};
    if (!form.doctorId) nextErrors.doctorId = "Select a doctor.";
    if (!form.patientName?.trim()) nextErrors.patientName = "Patient name is required.";
    if (!form.patientConcern?.trim()) nextErrors.patientConcern = "Reason for visit is required.";
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
      const payload = {
        doctorId: Number(form.doctorId),
        patientName: form.patientName.trim(),
        patientConcern: form.patientConcern.trim(),
        appointmentDate: form.appointmentDate
      };
      if (form.patientId) {
        payload.patientId = Number(form.patientId);
      }
      const email = form.patientEmail?.trim();
      if (email) payload.patientEmail = email;
      const phone = form.patientPhone?.trim();
      if (phone) payload.patientPhone = phone;
      if (form.patientAge !== "" && form.patientAge != null) {
        payload.patientAge = Number(form.patientAge);
      }
      const gender = form.patientGender?.trim();
      if (gender) payload.patientGender = gender;

      await bookAppointment(payload);
      setForm(appointmentFormModel);
      navigate("/appointments");
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err, "Booking failed.") });
    } finally {
      setLoading(false);
    }
  };

  if (doctorsLoading) return <Loader text="Loading doctors..." />;

  return (
    <section>
      <div className="page-header">
        <h2>Book Appointment</h2>
      </div>
      <Alert type="error" message={doctorLoadError} />
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="doctorId">Doctor *</label>
          <select
            id="doctorId"
            name="doctorId"
            value={form.doctorId}
            onChange={(e) => setForm((prev) => ({ ...prev, doctorId: e.target.value }))}
            required
          >
            <option value="">Select a doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.doctorId ? <p className="form-error">{errors.doctorId}</p> : null}
        </div>

        {selectedDoctor ? (
          <div className="form-group">
            <p>
              <strong>Specialization:</strong> {selectedDoctor.specialization ?? "-"}
            </p>
          </div>
        ) : null}

        <InputField
          label="Existing patient ID (optional)"
          name="patientId"
          type="number"
          value={form.patientId}
          onChange={(e) => setForm((prev) => ({ ...prev, patientId: e.target.value }))}
        />

        <InputField
          label="Patient name *"
          name="patientName"
          value={form.patientName}
          onChange={(e) => setForm((prev) => ({ ...prev, patientName: e.target.value }))}
          error={errors.patientName}
          required
        />

        <InputField
          label="Patient email"
          name="patientEmail"
          type="email"
          value={form.patientEmail}
          onChange={(e) => setForm((prev) => ({ ...prev, patientEmail: e.target.value }))}
        />

        <InputField
          label="Patient phone"
          name="patientPhone"
          value={form.patientPhone}
          onChange={(e) => setForm((prev) => ({ ...prev, patientPhone: e.target.value }))}
        />

        <InputField
          label="Patient age"
          name="patientAge"
          type="number"
          min={0}
          value={form.patientAge}
          onChange={(e) => setForm((prev) => ({ ...prev, patientAge: e.target.value }))}
        />

        <div className="form-group">
          <label htmlFor="patientGender">Patient gender</label>
          <select
            id="patientGender"
            name="patientGender"
            value={form.patientGender}
            onChange={(e) => setForm((prev) => ({ ...prev, patientGender: e.target.value }))}
          >
            <option value="">Prefer not to say</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="patientConcern">Reason for visit / concern *</label>
          <textarea
            id="patientConcern"
            name="patientConcern"
            className="input"
            rows={3}
            value={form.patientConcern}
            onChange={(e) => setForm((prev) => ({ ...prev, patientConcern: e.target.value }))}
            required
          />
          {errors.patientConcern ? <p className="form-error">{errors.patientConcern}</p> : null}
        </div>

        <InputField
          label="Appointment date *"
          name="appointmentDate"
          type="date"
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
