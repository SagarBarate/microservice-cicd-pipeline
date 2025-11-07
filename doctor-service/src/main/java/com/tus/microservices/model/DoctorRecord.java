package com.tus.microservices.model;

import com.tus.microservices.util.ValidSpecialization;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record DoctorRecord(
		Long id,
		
		@NotBlank(message = "Name is mandatory")
	    String name,
	    
	    @NotNull(message = "Specialization is mandatory")
		@ValidSpecialization(message = "Specialization is invalid")
	    Specialization specialization,
	    
	    @NotBlank(message = "Phone number is mandatory")
	    @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Phone number is invalid")
	    String phoneNumber,

	    @NotBlank(message = "Email is mandatory")
	    @Email(message = "Email should be valid")
	    String email
        ) {

}
