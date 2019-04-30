package com.sombrainc.repository;

import com.sombrainc.entity.UserProfile;
import com.sombrainc.entity.enumeration.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByIdAndUsers_StatusIsNot(Long profileId, UserStatus status);
}
