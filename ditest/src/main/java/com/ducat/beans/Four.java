package com.ducat.beans;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
@Lazy
public class Four {

	@Autowired
	private One one;
	
	
	public Four() {
		
		System.out.println("Four object is created.");
	}


	public void setOne(One one) {
		this.one = one;
		System.out.println("Setter method of Four is invoked.");
	}
	
	
	
}
