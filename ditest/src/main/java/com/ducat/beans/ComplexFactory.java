package com.ducat.beans;

import java.util.Scanner;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration
public class ComplexFactory {

	@Bean()
	@Scope("prototype")
	public Complex getComplex()
	{
		Scanner in=new Scanner(System.in);
		System.out.print("Enter Real Part: ");
		int r=in.nextInt();
		System.out.print("Enter Imaginary Part: ");
		int i=in.nextInt();
		return new Complex(r,i);
	}
}
