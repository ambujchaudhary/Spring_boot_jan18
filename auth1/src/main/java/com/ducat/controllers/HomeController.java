package com.ducat.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth1")
public class HomeController {

	
	
	@RequestMapping("/")
	public String home()
	{
		Authentication auth=SecurityContextHolder.getContext().getAuthentication();
		System.out.println("Following user is accessing the application:");
		System.out.println("UserId: "+auth.getName());
		return "index";
	}
	
	@RequestMapping(value="/about")
	public String about() throws Exception
	{
		
		return "about";
	}
	@RequestMapping(value="/contact")
	public String contact() throws Exception
	{
		
		return "contact";
	}
	
}
