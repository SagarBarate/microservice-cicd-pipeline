package com.tus.microservices.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.tus.microservices.client.dto.DoctorDto;

@FeignClient(name = "doctor-service", path = "/v1/doctor")
public interface DoctorClient {

	@GetMapping("/{id}")
	DoctorDto getDoctor(@PathVariable("id") Long id);
}
