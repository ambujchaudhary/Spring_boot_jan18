package com.sombrainc.repository;

import com.sombrainc.entity.Settings;
import com.sombrainc.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SettingsRepository extends JpaRepository<Settings, Long> {

    Optional<Settings> findByUsers(User user);

}
