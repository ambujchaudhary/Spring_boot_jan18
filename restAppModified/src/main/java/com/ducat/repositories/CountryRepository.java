package com.ducat.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.ducat.entities.Country;
import com.ducat.entities.Emp;

@Repository
public interface CountryRepository extends 
CrudRepository<Country,Integer>
{

}
