package com.ducat.resources;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ducat.entities.Trainer;
import com.ducat.repositories.TrainerRepository;

@RestController
@RequestMapping("/trainers")
public class TrainerController {

	
	//Dependency of the Controller
	@Autowired
	private TrainerRepository repo;
	
	//Method to load all Trainers
	@GetMapping(value="/", produces= {"application/json"})
	public Iterable<Trainer> getAllTrainer()
	{
		return repo.findAll();
	}
	
	
	
	//Method to load an Trainer using its id
		@GetMapping(value="/{id}", produces= {"application/json"})
		public Trainer getById(	@PathVariable	int id)
		{
			Optional<Trainer> op = repo.findById(id);
			if(op.isPresent())
			{
				return op.get();
			}
			else
			{
			return null;
			}
		}
		
	//Method to save an Trainer
	@PostMapping(value="/", consumes= {"application/json"})
	public String save(@RequestBody Trainer trainer)
	{
	 
	  repo.save(trainer);
	  return "successfully saved.";
	}	
	//Method to update an Trainer
	@PutMapping(value="/", consumes= {"application/json"})
	public String update(@RequestBody Trainer trainer)
	{
	  repo.save(trainer);
	  return "successfully updated.";
	}	
	
	//Method to delete a Trainer using its id
	@DeleteMapping(value="/{id}")
	public String remove(	@PathVariable	int id)
	{
			repo.deleteById(id);	
			return "successfully deleted.";
	}
}
