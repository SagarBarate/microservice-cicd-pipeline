package com.tus.microservices.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.tus.microservices.client.dto.AssignDoctorRequest;
import com.tus.microservices.client.dto.PatientApiDto;

@FeignClient(name = "patient-service", path = "/v1/patient")
public interface PatientClient {

	@PostMapping
	PatientApiDto createPatient(@RequestBody PatientApiDto patient);

	@PutMapping("/{id}")
	PatientApiDto updatePatient(@PathVariable("id") Long id, @RequestBody PatientApiDto patient);

	@GetMapping("/{id}")
	PatientApiDto getPatient(@PathVariable("id") Long id);

	@PutMapping("/{id}/assign-doctor")
	PatientApiDto assignDoctor(@PathVariable("id") Long id, @RequestBody AssignDoctorRequest request);
}
