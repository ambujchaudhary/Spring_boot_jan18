package com.ducat.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;

@RestController
public class ClientController {

	@Autowired
	AdderClient client;
	
	@HystrixCommand(fallbackMethod = "defaultResponse")
	@RequestMapping(value="/sum",method=RequestMethod.GET)
	public int getSum()
	{
		return client.fetchSum(3, 4);
	}
	
	public int defaultResponse()
	{
		System.out.println("You are seeing this fallback response because the underlying microservice is down.");
		return 0;
	}
}
