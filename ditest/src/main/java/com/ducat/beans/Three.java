package com.ducat.beans;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
@Lazy
public class Three {

	
	private One one;
	
	@Autowired
	public Three(One one) {
		this.one=one;
		System.out.println("Three object is created and One object is given to it as constructor parameters.");
	}
	
	
	
}
