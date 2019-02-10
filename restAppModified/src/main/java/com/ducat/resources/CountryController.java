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

import com.ducat.entities.Country;
import com.ducat.repositories.CountryRepository;

@RestController
@RequestMapping("/countries")
public class CountryController {

	
	//Dependency of the Controller
	@Autowired
	private CountryRepository repo;
	
	//Method to load all Countries
	@GetMapping(value="/", produces= {"application/json"})
	public Iterable<Country> getAllCountry()
	{
		return repo.findAll();
	}
	
	
	
	//Method to load an Country using its id
		@GetMapping(value="/{id}", produces= {"application/json"})
		public Country getById(	@PathVariable	int id)
		{
			Optional<Country> op = repo.findById(id);
			if(op.isPresent())
			{
				return op.get();
			}
			else
			{
			return null;
			}
		}
		
	//Method to save an Country
	@PostMapping(value="/", consumes= {"application/json"})
	public String save(@RequestBody Country country)
	{
	  System.out.println("Saving.....");
	  System.out.println(country.getName()+"\t"+country.getHos().getTitle());
	  repo.save(country);
	  return "successfully saved.";
	}	
	//Method to update an Country
	@PutMapping(value="/", consumes= {"application/json"})
	public String update(@RequestBody Country country)
	{
	  repo.save(country);
	  return "successfully updated.";
	}	
	
	//Method to delete a Country using its id
	@DeleteMapping(value="/{id}")
	public String remove(	@PathVariable	int id)
	{
			repo.deleteById(id);	
			return "successfully deleted.";
	}
}
