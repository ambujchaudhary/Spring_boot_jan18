package com.ducat.entities;

import java.util.Set;

import javax.persistence.*;

@Entity
@Table(name="Trainers")
public class Trainer {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	int id;
	String name;
	
	/*@OneToMany(cascade= {CascadeType.MERGE,CascadeType.PERSIST})
	//@JoinColumn(name="trainerId")
	@JoinTable(name="Trainer_Batch",joinColumns= {@JoinColumn(name="trainerId")},
	inverseJoinColumns= {@JoinColumn(name="batchId")})*/
	
	@OneToMany(mappedBy="trainer",fetch=FetchType.LAZY)
	Set<Batch> batches;

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

	public Set<Batch> getBatches() {
		return batches;
	}

	public void setBatches(Set<Batch> batches) {
		this.batches = batches;
	}
	
	
	
}
