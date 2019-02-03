package com.ducat.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.ducat.entities.Emp;

@Repository
public interface EmpRepository extends 
CrudRepository<Emp,Integer>
{

	//to fetch employees on the basis of their job
	public Iterable<Emp> findByJob(String job);
}
