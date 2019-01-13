package com.ducat.beans;

public interface Account {

	public void deposit(double amount);
	public boolean withdraw(double amount);
	public double getBalance();
}
