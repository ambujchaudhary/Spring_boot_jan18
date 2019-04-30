package com.sombrainc.repository;

import com.sombrainc.entity.Image;
import com.sombrainc.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    Optional<Image> findImageByUrl(String url);

    Optional<Image> findImageByFullName(String fullName);

    Optional<Image> findImageByUsers(User user);

}
