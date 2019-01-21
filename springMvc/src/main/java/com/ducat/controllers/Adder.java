package com.ducat.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/adder")
public class Adder {

	
	//Method to serve the home page
	@RequestMapping("/")
	public String home()
	{
		System.out.println("Request to generate home page is received.");
		return "home";
	}
	//Method to process the add request
	@RequestMapping("/add")
	public ModelAndView sum(
			@RequestParam("num1") int a, 
			@RequestParam("num2")int b)
	{
		int c=a+b;
		ModelAndView mav=new ModelAndView();
		mav.setViewName("result");
		mav.addObject("sum",c);
		return mav;
	}
}
