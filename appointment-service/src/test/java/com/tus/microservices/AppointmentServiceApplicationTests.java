package com.tus.microservices;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import com.tus.microservices.client.DoctorClient;
import com.tus.microservices.client.PatientClient;

@SpringBootTest
@ActiveProfiles("test")
class AppointmentServiceApplicationTests {

	@MockBean
	private DoctorClient doctorClient;

	@MockBean
	private PatientClient patientClient;

	@Test
	void contextLoads() {
	}

}
