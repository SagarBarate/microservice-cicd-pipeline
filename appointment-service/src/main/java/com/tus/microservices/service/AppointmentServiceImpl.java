package com.tus.microservices.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tus.microservices.client.DoctorClient;
import com.tus.microservices.client.PatientClient;
import com.tus.microservices.client.dto.AssignDoctorRequest;
import com.tus.microservices.client.dto.DoctorDto;
import com.tus.microservices.client.dto.PatientApiDto;
import com.tus.microservices.entity.Appointment;
import com.tus.microservices.exception.AppointmentNotFoundException;
import com.tus.microservices.exception.AppointmentPersistenceException;
import com.tus.microservices.exception.DoctorNotFoundException;
import com.tus.microservices.exception.DownstreamServiceException;
import com.tus.microservices.exception.PatientNotFoundException;
import com.tus.microservices.mapper.AppointmentMapper;
import com.tus.microservices.model.AppointmentBookingRequest;
import com.tus.microservices.model.AppointmentResponse;
import com.tus.microservices.model.AppointmentStatus;
import com.tus.microservices.repository.AppointmentRepository;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

	private final DoctorClient doctorClient;
	private final PatientClient patientClient;
	private final AppointmentRepository appointmentRepository;
	private final AppointmentMapper appointmentMapper;

	@Override
	public AppointmentResponse bookAppointment(AppointmentBookingRequest request) {
		DoctorDto doctor = fetchDoctor(request.doctorId());
		PatientApiDto patient = resolveAndAssignPatient(request, doctor);
		return persistAppointment(request, doctor, patient);
	}

	private DoctorDto fetchDoctor(Long doctorId) {
		try {
			DoctorDto doctor = doctorClient.getDoctor(doctorId);
			if (doctor == null || doctor.id() == null) {
				throw new DoctorNotFoundException("Doctor not found with id: " + doctorId);
			}
			return doctor;
		} catch (FeignException e) {
			if (e.status() == 404) {
				throw new DoctorNotFoundException("Doctor not found with id: " + doctorId);
			}
			log.error("Doctor service call failed for id {}", doctorId, e);
			throw new DownstreamServiceException("Doctor service unavailable", e);
		}
	}

	private PatientApiDto resolveAndAssignPatient(AppointmentBookingRequest request, DoctorDto doctor) {
		PatientApiDto patient;
		if (request.patientId() != null) {
			patient = fetchPatient(request.patientId());
			PatientApiDto merged = mergePatientUpdate(request, patient);
			try {
				patient = patientClient.updatePatient(patient.id(), merged);
			} catch (FeignException e) {
				if (e.status() == 400) {
					throw new DownstreamServiceException("Patient update rejected by patient-service", e);
				}
				log.error("Patient update failed for id {}", patient.id(), e);
				throw new DownstreamServiceException("Patient service unavailable", e);
			}
		} else {
			patient = createNewPatient(request);
		}
		return assignDoctorToPatient(patient.id(), doctor);
	}

	private PatientApiDto fetchPatient(Long patientId) {
		try {
			PatientApiDto patient = patientClient.getPatient(patientId);
			if (patient == null || patient.id() == null) {
				throw new PatientNotFoundException("Patient not found with id: " + patientId);
			}
			return patient;
		} catch (FeignException e) {
			if (e.status() == 404) {
				throw new PatientNotFoundException("Patient not found with id: " + patientId);
			}
			log.error("Patient service call failed for id {}", patientId, e);
			throw new DownstreamServiceException("Patient service unavailable", e);
		}
	}

	private PatientApiDto mergePatientUpdate(AppointmentBookingRequest request, PatientApiDto existing) {
		int age = request.patientAge() != null ? request.patientAge() : existing.age();
		String gender = request.patientGender() != null ? request.patientGender() : existing.gender();
		String phone = request.patientPhone() != null ? request.patientPhone() : existing.phoneNumber();
		String email = request.patientEmail() != null ? request.patientEmail() : existing.email();
		String concern = request.patientConcern() != null ? request.patientConcern() : existing.concern();
		return new PatientApiDto(existing.id(), request.patientName(), age, gender, phone, email, concern,
				existing.assignedDoctorId(), existing.assignedDoctorName(), existing.assignedDoctorSpecialization());
	}

	private PatientApiDto createNewPatient(AppointmentBookingRequest request) {
		int age = request.patientAge() != null ? request.patientAge() : 0;
		PatientApiDto body = new PatientApiDto(null, request.patientName(), age, request.patientGender(),
				request.patientPhone(), request.patientEmail(), request.patientConcern(), null, null, null);
		try {
			return patientClient.createPatient(body);
		} catch (FeignException e) {
			log.error("Patient creation failed", e);
			throw new DownstreamServiceException("Could not create patient in patient-service", e);
		}
	}

	private PatientApiDto assignDoctorToPatient(Long patientId, DoctorDto doctor) {
		AssignDoctorRequest assign = new AssignDoctorRequest(doctor.id(), doctor.name(), doctor.specialization());
		try {
			return patientClient.assignDoctor(patientId, assign);
		} catch (FeignException e) {
			log.error("Assign doctor failed for patient {}", patientId, e);
			throw new DownstreamServiceException("Could not assign doctor to patient", e);
		}
	}

	private AppointmentResponse persistAppointment(AppointmentBookingRequest request, DoctorDto doctor,
			PatientApiDto patient) {
		Appointment appointment = new Appointment();
		appointment.setDoctorId(doctor.id());
		appointment.setDoctorName(doctor.name());
		appointment.setDoctorSpecialization(doctor.specialization());
		appointment.setPatientId(patient.id());
		appointment.setPatientName(patient.name());
		appointment.setPatientConcern(request.patientConcern());
		appointment.setAppointmentDate(request.appointmentDate());
		appointment.setStatus(AppointmentStatus.BOOKED);
		try {
			Appointment saved = appointmentRepository.save(appointment);
			return appointmentMapper.toResponse(saved);
		} catch (Exception e) {
			log.error(
					"Appointment persistence failed after patient {} and doctor {} were processed; manual reconciliation may be needed",
					patient.id(), doctor.id(), e);
			throw new AppointmentPersistenceException("Could not save appointment", e);
		}
	}

	@Override
	public List<AppointmentResponse> getAllAppointments() {
		return appointmentMapper.toResponseList(appointmentRepository.findAll());
	}

	@Override
	public AppointmentResponse getAppointmentById(Long id) {
		return appointmentRepository.findById(id).map(appointmentMapper::toResponse)
				.orElseThrow(() -> new AppointmentNotFoundException("Appointment not found with id: " + id));
	}
}
