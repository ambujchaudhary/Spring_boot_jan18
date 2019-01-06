package com.ducat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import com.ducat.beans.Complex;
import com.ducat.beans.Four;
import com.ducat.beans.Three;
import com.ducat.beans.Two;

@SpringBootApplication
public class Application {

	public static void main(String args[])
	{
		ApplicationContext ctx=SpringApplication.run(Application.class, args);
	   System.out.println("Requesting Bean Two...");
	   Two x=(Two)ctx.getBean("two");
	   System.out.println("Requesting Bean Three...");
	   Three y=(Three)ctx.getBean("three");
	   System.out.println("Requesting Bean Four...");
	   Four z=(Four)ctx.getBean("four");
	   System.out.println("Requesting Complex bean...");
	   Complex c=(Complex)ctx.getBean(Complex.class);
	   System.out.println("Complex number is: "+c);
	}
}
