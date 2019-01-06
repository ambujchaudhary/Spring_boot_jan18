package com.ducat.beans;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
@Lazy
public class Two {

	
	private One one;
	
	public Two() {
		System.out.println("Two object is created.");
	}
	@Autowired
	public void setOne(One one) {
		this.one = one;
		System.out.println("setOne() method of Two is invoked.");
	}

	
}
