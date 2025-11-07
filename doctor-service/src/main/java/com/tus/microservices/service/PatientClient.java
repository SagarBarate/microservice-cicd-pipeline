package com.tus.microservices.service;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "patient-service")
public interface PatientClient {
    @GetMapping("/v1/patient/by-doctor/{doctorId}")
    List<String> getPatients(@PathVariable String doctorId);
}