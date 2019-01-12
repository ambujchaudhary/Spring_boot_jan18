package com.ducat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import com.ducat.beans.Conductor;
import com.ducat.beans.Ticket;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		
      ApplicationContext ctx=SpringApplication.run(Application.class, args);
      System.out.println("Appliction started, obtaining conductor...");
      //Conductor con=(Conductor)ctx.getBean("con1");
      //Conductor con=(Conductor)ctx.getBean("con2");
      Conductor con=(Conductor)ctx.getBean("con3");
      System.out.println("Conductor bean class is: "+con.getClass().getSimpleName());
      System.out.println("Requesting two tickets from the conductor...");
      Ticket t1=con.getTicket();
      Ticket t2=con.getTicket();
      System.out.println("Details of first ticket: "+t1);
      System.out.println("Details of second ticket: "+t2);
	}

}
