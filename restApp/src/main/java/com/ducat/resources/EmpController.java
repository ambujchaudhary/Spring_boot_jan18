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
import com.ducat.repositories.EmpRepository;

@RestController
@RequestMapping("/employees")
public class EmpController {

	
	//Dependency of the Controller
	@Autowired
	private EmpRepository repo;
	
	//Method to load all Employees
	@GetMapping(value="/", produces= {"application/json"})
	public Iterable<Emp> getAllEmp()
	{
		return repo.findAll();
	}
	
	//Method to load all Employees by their job
		@GetMapping(value="/job/{job}", produces= {"application/json"})
		public Iterable<Emp> getAllByJob(
			@PathVariable	String job)
		{
			return repo.findByJob(job);
		}
	
	//Method to load an employee using its id
		@GetMapping(value="/{id}", produces= {"application/json"})
		public Emp getById(	@PathVariable	int id)
		{
			Optional<Emp> op = repo.findById(id);
			if(op.isPresent())
			{
				return op.get();
			}
			else
			{
			return null;
			}
		}
		
	//Method to save an Emp
	@PostMapping(value="/", consumes= {"application/json"})
	public String save(@RequestBody Emp emp)
	{
	  System.out.println("Saving.....");
	  System.out.println(emp.getName()+"\t"+emp.getJob());
	  repo.save(emp);
	  return "successfully saved.";
	}	
	//Method to save an Emp
	@PutMapping(value="/", consumes= {"application/json"})
	public String update(@RequestBody Emp emp)
	{
	  repo.save(emp);
	  return "successfully updated.";
	}	
	
	//Method to load an employee using its id
	@DeleteMapping(value="/{id}")
	public String remove(	@PathVariable	int id)
	{
			repo.deleteById(id);	
			return "successfully deleted.";
	}
}
