package com.ducat.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.ducat.entities.Previlige;

@Repository
public interface PreviligeRepository extends 
CrudRepository<Previlige,Integer>
{

	
}
