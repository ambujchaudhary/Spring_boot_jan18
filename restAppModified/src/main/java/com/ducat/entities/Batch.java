package com.ducat.entities;

import javax.persistence.*;

@Entity
@Table(name="Batches") //to be used in pk-fk
//@Table(name="BatchMaster")
public class Batch {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	private String slot,mode,course;
	
	@ManyToOne(cascade=CascadeType.MERGE,fetch=FetchType.LAZY)
	@JoinColumn(name="trainerId")
	private Trainer trainer;
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getSlot() {
		return slot;
	}
	public void setSlot(String slot) {
		this.slot = slot;
	}
	public String getMode() {
		return mode;
	}
	public void setMode(String mode) {
		this.mode = mode;
	}
	public String getCourse() {
		return course;
	}
	public void setCourse(String course) {
		this.course = course;
	}
	public Trainer getTrainer() {
		return trainer;
	}
	public void setTrainer(Trainer trainer) {
		this.trainer = trainer;
	}
	
	
}
