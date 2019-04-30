package com.sombrainc.repository;

import com.sombrainc.entity.FirebaseData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FirebaseRepository extends JpaRepository<FirebaseData, Long> {

    Optional<FirebaseData> findByToken(String token);

    List<FirebaseData> findByUser_Id(Long userId);
}
