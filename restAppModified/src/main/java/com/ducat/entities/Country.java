package com.ducat.entities;

import javax.persistence.*;

@Entity
@Table(name="Countries")
public class Country {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	private String name;
	
	@OneToOne(cascade=CascadeType.ALL)
	@JoinColumn(name="hosId")
	private HeadOfState hos;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public HeadOfState getHos() {
		return hos;
	}

	public void setHos(HeadOfState hos) {
		this.hos = hos;
	}
	
	
}
