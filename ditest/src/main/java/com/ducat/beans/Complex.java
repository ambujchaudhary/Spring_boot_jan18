package com.ducat.beans;

public class Complex {

	private int r,i;

	public Complex(int r, int i) {
		super();
		this.r = r;
		this.i = i;
	}

	
	
	public String toString()
	{
		return r+"+"+i+"i";
	}
}
