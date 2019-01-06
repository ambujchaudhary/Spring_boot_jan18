package com.ducat.components;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class A {

	
	private B b;
	
	@Autowired
	public A(B b) {
		this.b=b;
		System.out.println("A bean is created.");
		this.display();
		
	}
	
	public void display()
	{
		System.out.print("It is A bean, ");
		if(b !=null)
			System.out.println("It has a B bean.");
		else
			System.out.println("It doesn't have a B bean.");
	}
	
}
