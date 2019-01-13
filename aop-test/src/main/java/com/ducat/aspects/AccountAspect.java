package com.ducat.aspects;


import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AccountAspect {

	//pointcut defintions
	
	@Pointcut("execution(* com.ducat.beans.Account.deposit(double))")
	public void depositPc() {}
	
	@Pointcut("execution(* com.ducat.beans.Account.withdraw(double))")
	public void withdrawPc() {}
	
	//advices definitions
	
	@AfterReturning(pointcut="depositPc() || withdrawPc()",returning="rvalue")
	public void doAfter(JoinPoint jp,Object rvalue)
	{
		if(rvalue == null || (Boolean)rvalue == true)
		System.out.println(jp.getSignature().getName()+" is successfully completed.");
		else {
				System.out.println(jp.getSignature().getName()+" is failed.");
				
			}
		
	}
	
	@Before("execution(* com.ducat.beans.Account.*(double)) && args(val)")
	public void doBefore(JoinPoint jp, double val)
	{
		
	System.out.println(jp.getSignature().getName()+"ing "+val+"...");
				
		
	}
}
