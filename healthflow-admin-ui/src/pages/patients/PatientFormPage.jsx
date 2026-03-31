import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/common/Alert";
import InputField from "../../components/common/InputField";
import Loader from "../../components/common/Loader";
import {
  createPatient,
  getPatientById,
  updatePatient
} from "../../services/patientService";
import { patientFormModel } from "../../utils/formModels";
import { getErrorMessage } from "../../utils/helpers";

function PatientFormPage() {
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();
  const [form, setForm] = useState(patientFormModel);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const loadPatient = async () => {
      try {
        const data = await getPatientById(id);
        setForm({
          name: data?.name || "",
          email: data?.email || "",
          phone: data?.phone || "",
          age: data?.age || ""
        });
      } catch (err) {
        setAlert({ type: "error", message: getErrorMessage(err, "Failed to load patient.") });
      } finally {
        setLoading(false);
      }
    };
    loadPatient();
  }, [id, isEdit]);

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      const payload = { ...form, age: form.age ? Number(form.age) : null };
      if (isEdit) {
        await updatePatient(id, payload);
      } else {
        await createPatient(payload);
      }
      navigate("/patients");
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err, "Unable to save patient.") });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading patient form..." />;

  return (
    <section>
      <div className="page-header">
        <h2>{isEdit ? "Edit Patient" : "Add Patient"}</h2>
        <Link className="btn btn-secondary" to="/patients">
          Back to list
        </Link>
      </div>
      <Alert type={alert.type} message={alert.message} />
      <form className="form-card" onSubmit={handleSubmit}>
        <InputField
          label="Name"
          name="name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          error={errors.name}
          required
        />
        <InputField
          label="Email"
          name="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          type="email"
          error={errors.email}
          required
        />
        <InputField
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
        />
        <InputField
          label="Age"
          name="age"
          value={form.age}
          onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
          type="number"
        />
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Patient"}
        </button>
      </form>
    </section>
  );
}

export default PatientFormPage;
