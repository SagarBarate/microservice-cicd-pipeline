import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Alert from "../../components/common/Alert";
import Loader from "../../components/common/Loader";
import { getDoctorById } from "../../services/doctorService";
import { getErrorMessage } from "../../utils/helpers";

function DoctorDetailPage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        setLoading(true);
        const data = await getDoctorById(id);
        setDoctor(data);
      } catch (err) {
        setError(getErrorMessage(err, "Could not load doctor details."));
      } finally {
        setLoading(false);
      }
    };
    loadDoctor();
  }, [id]);

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
      ) : null}
    </section>
  );
}

export default DoctorDetailPage;
