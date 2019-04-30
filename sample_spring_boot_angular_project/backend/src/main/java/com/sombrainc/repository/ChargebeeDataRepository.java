package com.sombrainc.repository;

import com.sombrainc.entity.ChargebeeData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChargebeeDataRepository extends JpaRepository<ChargebeeData, Long> {

    ChargebeeData findByCustomerId(String customerId);
}
