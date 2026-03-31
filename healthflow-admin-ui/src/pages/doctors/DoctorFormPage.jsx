import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/common/Alert";
import InputField from "../../components/common/InputField";
import Loader from "../../components/common/Loader";
import {
  createDoctor,
  getDoctorById,
  updateDoctor
} from "../../services/doctorService";
import { doctorFormModel } from "../../utils/formModels";
import { getErrorMessage } from "../../utils/helpers";

function DoctorFormPage() {
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();
  const [form, setForm] = useState(doctorFormModel);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const loadDoctor = async () => {
      try {
        const data = await getDoctorById(id);
        setForm({
          name: data?.name || "",
          specialization: data?.specialization || "",
          email: data?.email || "",
          phoneNumber: data?.phoneNumber || ""
        });
      } catch (err) {
        setAlert({ type: "error", message: getErrorMessage(err, "Failed to load doctor.") });
      } finally {
        setLoading(false);
      }
    };
    loadDoctor();
  }, [id, isEdit]);

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.specialization.trim()) nextErrors.specialization = "Specialization is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      if (isEdit) {
        await updateDoctor(id, form);
      } else {
        await createDoctor(form);
      }
      navigate("/doctors");
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err, "Unable to save doctor.") });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading doctor form..." />;

  return (
    <section>
      <div className="page-header">
        <h2>{isEdit ? "Edit Doctor" : "Add Doctor"}</h2>
        <Link className="btn btn-secondary" to="/doctors">
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
          label="Specialization"
          name="specialization"
          value={form.specialization}
          onChange={(e) => setForm((prev) => ({ ...prev, specialization: e.target.value }))}
          error={errors.specialization}
          required
        />
        <InputField
          label="Email"
          name="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          type="email"
        />
        <InputField
          label="Phone"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
        />
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Doctor"}
        </button>
      </form>
    </section>
  );
}

export default DoctorFormPage;
