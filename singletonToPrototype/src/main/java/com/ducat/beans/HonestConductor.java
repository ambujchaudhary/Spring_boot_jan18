package com.ducat.beans;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component("con2")
@Lazy
public class HonestConductor extends Conductor
{

	@Autowired
	private ApplicationContext container;

	public Ticket getTicket() {
		return (Ticket)container.getBean("ticket");
	}
	
	
}
