package com.tus.microservices.model;

public record SpecializationOption(String code, String label) {

	public static SpecializationOption from(Specialization specialization) {
		return new SpecializationOption(specialization.name(), specialization.toString());
	}
}
