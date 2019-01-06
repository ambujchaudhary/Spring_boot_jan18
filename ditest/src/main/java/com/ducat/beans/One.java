package com.ducat.beans;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope("prototype") //execute application by commenting and uncommenting it.
public class One {

	public One() {
		System.out.println("One object is created.");
	}

	
}
