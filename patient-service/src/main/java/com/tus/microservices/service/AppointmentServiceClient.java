package com.tus.microservices.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.tus.microservices.model.AppointmentRecord;

@FeignClient(name = "appointment-service")
public interface AppointmentServiceClient {
    @PostMapping("/v1/appointment/book")
    String bookAppointment(@RequestBody AppointmentRecord appointmentRecord);
}
