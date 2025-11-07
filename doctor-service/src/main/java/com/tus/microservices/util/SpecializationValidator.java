package com.tus.microservices.util;

import com.tus.microservices.model.Specialization;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class SpecializationValidator implements ConstraintValidator<ValidSpecialization, Specialization> {

    @Override
    public void initialize(ValidSpecialization constraintAnnotation) {
    }

    @Override
    public boolean isValid(Specialization specialization, ConstraintValidatorContext context) {
        if (specialization == null) {
            return false;
        }
        // Add your logic to check if the specialization is valid
        return true; // Replace with actual validation logic
    }
}

