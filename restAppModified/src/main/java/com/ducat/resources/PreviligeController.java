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

import com.ducat.entities.Emp;
import com.ducat.entities.Previlige;
import com.ducat.repositories.EmpRepository;
import com.ducat.repositories.PreviligeRepository;

@RestController
@RequestMapping("/previliges")
public class PreviligeController {

	
	//Dependency of the Controller
	@Autowired
	private PreviligeRepository repo;
	
	//Method to load all Previliges
	@GetMapping(value="/", produces= {"application/json"})
	public Iterable<Previlige> getAllPreviliges()
	{
		return repo.findAll();
	}
	
	
	
	//Method to load a previlige using its id
		@GetMapping(value="/{id}", produces= {"application/json"})
		public Previlige getById(	@PathVariable	int id)
		{
			Optional<Previlige> op = repo.findById(id);
			if(op.isPresent())
			{
				return op.get();
			}
			else
			{
			return null;
			}
		}
		
	//Method to save a Previlige
	@PostMapping(value="/", consumes= {"application/json"})
	public String save(@RequestBody Previlige p)
	{
	  repo.save(p);
	  return "successfully saved.";
	}	
	//Method to update an Previlige
	@PutMapping(value="/", consumes= {"application/json"})
	public String update(@RequestBody Previlige p)
	{
	  repo.save(p);
	  return "successfully updated.";
	}	
	
	//Method to delete a previlige using its id
	@DeleteMapping(value="/{id}")
	public String remove(	@PathVariable	int id)
	{
			repo.deleteById(id);	
			return "successfully deleted.";
	}
}
