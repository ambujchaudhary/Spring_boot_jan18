package com.ducat.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.ducat.entities.Trainer;

@Repository
public interface TrainerRepository extends 
CrudRepository<Trainer,Integer>
{

}
