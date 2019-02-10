package com.ducat.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.ducat.entities.Batch;


@Repository
public interface BatchRepository extends 
CrudRepository<Batch,Integer>
{

}
