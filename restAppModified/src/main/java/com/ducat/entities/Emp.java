package com.ducat.entities;

import java.util.Set;

import javax.persistence.*;

@Entity
public class Emp {

	//state
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	private String name;
	private String job;
	private int salary;
	
	//relation
	@ManyToMany(cascade= {CascadeType.MERGE},
			fetch=FetchType.EAGER)
	@JoinTable(name="Emp_Previlige",
	joinColumns= {@JoinColumn(name="empId")},
	inverseJoinColumns= {@JoinColumn(name="previligeId")})
	private Set<Previlige> previliges;
	
	
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
	public String getJob() {
		return job;
	}
	public void setJob(String job) {
		this.job = job;
	}
	public int getSalary() {
		return salary;
	}
	public void setSalary(int salary) {
		this.salary = salary;
	}
	public Set<Previlige> getPreviliges() {
		return previliges;
	}
	public void setPreviliges(Set<Previlige> previliges) {
		this.previliges = previliges;
	}
	
	
}
