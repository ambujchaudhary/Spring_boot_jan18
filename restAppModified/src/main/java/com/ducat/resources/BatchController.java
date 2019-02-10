package com.ducat.resources;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ducat.dtos.BatchDTO;
import com.ducat.entities.Batch;
import com.ducat.repositories.BatchRepository;

@RestController
@RequestMapping("/batches")
public class BatchController {

	
	//Dependency of the Controller
	@Autowired
	private BatchRepository repo;
	
	//Method to load all Batches
	@GetMapping(value="/", produces= {"application/json"})
	public List<BatchDTO> getAllBatch()
	{
		//return repo.findAll();
		List<BatchDTO> batches = new ArrayList<BatchDTO>();
		ModelMapper mapper = new ModelMapper();
		Iterable<Batch> itr=repo.findAll();
		for(Batch batch : itr)
		{
			batches.add(mapper.map(batch, BatchDTO.class));
		}
		
		
        return batches;
		
		
	}
	
	
	
	//Method to load an Batch using its id
		@GetMapping(value="/{id}", produces= {"application/json"})
		public BatchDTO getById(	@PathVariable	int id)
		{
			Optional<Batch> op = repo.findById(id);
			if(op.isPresent())
			{
				ModelMapper mapper=new ModelMapper();
				return mapper.map(op.get(), BatchDTO.class);
			}
			else
			{
			return null;
			}
		}
		
	//Method to save an Batch
	@PostMapping(value="/", consumes= {"application/json"})
	public String save(@RequestBody Batch batch)
	{
	 
	  repo.save(batch);
	  return "successfully saved.";
	}	
	//Method to update an Batch
	@PutMapping(value="/", consumes= {"application/json"})
	public String update(@RequestBody Batch batch)
	{
	  repo.save(batch);
	  return "successfully updated.";
	}	
	
	//Method to delete a Batch using its id
	@DeleteMapping(value="/{id}")
	public String remove(	@PathVariable	int id)
	{
			repo.deleteById(id);	
			return "successfully deleted.";
	}
}
