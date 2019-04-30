package com.sombrainc.repository;

import com.sombrainc.entity.FreeTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FreeTierRepository extends JpaRepository<FreeTier, Long> {

    Optional<FreeTier> findByUser_Email(String email);
}
