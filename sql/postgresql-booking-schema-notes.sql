-- Reference DDL for PostgreSQL when not relying on JPA ddl-auto (e.g. production).
-- Schemas: hsm_patient, hsm-appointment (JDBC currentSchema), hsm_doctor (existing).

-- Patient: new columns (patient-service)
ALTER TABLE hsm_patient.patients ADD COLUMN IF NOT EXISTS concern VARCHAR(255);
ALTER TABLE hsm_patient.patients ADD COLUMN IF NOT EXISTS assigned_doctor_id BIGINT;
ALTER TABLE hsm_patient.patients ADD COLUMN IF NOT EXISTS assigned_doctor_name VARCHAR(255);
ALTER TABLE hsm_patient.patients ADD COLUMN IF NOT EXISTS assigned_doctor_specialization VARCHAR(255);

-- Appointments: expanded columns (appointment-service)
ALTER TABLE "hsm-appointment".appointments ADD COLUMN IF NOT EXISTS doctor_name VARCHAR(255);
ALTER TABLE "hsm-appointment".appointments ADD COLUMN IF NOT EXISTS doctor_specialization VARCHAR(255);
ALTER TABLE "hsm-appointment".appointments ADD COLUMN IF NOT EXISTS patient_name VARCHAR(255);
ALTER TABLE "hsm-appointment".appointments ADD COLUMN IF NOT EXISTS patient_concern VARCHAR(2000);
ALTER TABLE "hsm-appointment".appointments ADD COLUMN IF NOT EXISTS status VARCHAR(32);
ALTER TABLE "hsm-appointment".appointments ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;
ALTER TABLE "hsm-appointment".appointments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- If existing rows exist, backfill status for older rows:
-- UPDATE "hsm-appointment".appointments SET status = 'BOOKED' WHERE status IS NULL;
