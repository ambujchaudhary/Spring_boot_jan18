package com.ducat.beans;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component("account")
@Lazy
public class AccountImpl implements Account {

	private double balance=0;
	
	public void deposit(double amount) {
		balance+=amount;

	}

	public boolean withdraw(double amount) {
		
		if(amount <= balance)
		{
			balance -=amount;
			return true;
		}
		else
		return false;
	}

	public double getBalance()
	{
		return balance;
	}
}
