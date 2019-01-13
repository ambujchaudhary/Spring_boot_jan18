package com.ducat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import com.ducat.beans.Account;

@SpringBootApplication
public class AOPApplication {

	public static void main(String[] args) {
		
		ApplicationContext ctx=SpringApplication.run(AOPApplication.class, args);
		Account account= (Account)ctx.getBean("account");
		System.out.println("Initial Balance: "+account.getBalance());
		account.deposit(25000);
		account.withdraw(10000);
		account.withdraw(20000);
		System.out.println("Current Balance: "+account.getBalance());
		
	}

}
