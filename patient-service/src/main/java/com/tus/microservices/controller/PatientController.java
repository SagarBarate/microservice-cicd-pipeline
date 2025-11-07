package com.tus.microservices.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tus.microservices.model.AppointmentRecord;
import com.tus.microservices.model.PatientRecord;
import com.tus.microservices.service.AppointmentServiceClient;
import com.tus.microservices.service.PatientService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/v1/patient")
@RestController
@RequiredArgsConstructor
public class PatientController {
	
	private final PatientService patientService;
	private final AppointmentServiceClient appointmentServiceClient;
	
	@GetMapping("/test")
	public String sayHello() {
		log.info("Patient logs");
		return "hello patient";
	}
	
	@PostMapping
	public ResponseEntity<PatientRecord> createDoctor(@RequestBody PatientRecord PatientRecord) {
		log.info("Save Doctor");
		if(PatientRecord!=null) {
			PatientRecord doctorDetail = patientService.savePatient(PatientRecord);
			return new ResponseEntity<>(doctorDetail,HttpStatus.OK);
		}
		return new ResponseEntity<>(null,HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@GetMapping
	public ResponseEntity<List<PatientRecord>> getAllDoctors(@RequestParam(required = false) String name) {
		try {
			List<PatientRecord> records = new ArrayList();
			
			if (name == null)
				patientService.getAllPatientData().forEach(records::add);
			else
				patientService.getAllPatientsDataByName(name).forEach(records::add);

			if (records.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(records, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<PatientRecord> getTutorialById(@PathVariable("id") Long id) {
		if(id!=null)
		{
			PatientRecord doctorDetail = patientService.getPatientDetails(id);
			if(doctorDetail!=null) {
				return new ResponseEntity<>(doctorDetail, HttpStatus.OK);
			}
		}
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<PatientRecord> updateTutorial(@PathVariable("id") Long id, @RequestBody PatientRecord updateData) {
		
		PatientRecord result;
		if(id!=null) {
			PatientRecord existData=patientService.updatePatient(id,updateData);
			if(existData!=null) {
					return new ResponseEntity<>(existData, HttpStatus.OK);	
			}
			else
				{
					return new ResponseEntity<>(HttpStatus.NOT_FOUND);
				}
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	
	@DeleteMapping("/{id}")
	public ResponseEntity<HttpStatus> deleteRecord(@PathVariable("id") Long id) {
		if(id!=null)
		{
			patientService.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		else
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@DeleteMapping
	public ResponseEntity<HttpStatus> deleteAllRecords() {
		try {
			patientService.deleteAll();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PostMapping("/bookAppointment")
    public String bookAppointment(@RequestBody AppointmentRecord appointmentRecord) {
        return appointmentServiceClient.bookAppointment(appointmentRecord);
    }
}
