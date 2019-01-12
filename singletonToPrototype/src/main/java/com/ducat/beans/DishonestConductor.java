package com.ducat.beans;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component("con1")
@Lazy
public class DishonestConductor extends Conductor
{

	@Autowired
	private Ticket ticket;

	public Ticket getTicket() {
		return ticket;
	}
	
	
}
