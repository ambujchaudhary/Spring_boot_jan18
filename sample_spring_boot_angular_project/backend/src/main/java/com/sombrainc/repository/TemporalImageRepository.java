package com.sombrainc.repository;

import com.sombrainc.entity.TemporalImage;
import com.sombrainc.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemporalImageRepository extends JpaRepository<TemporalImage, Long> {

    @Query(value = "select timg.imageUrl from TemporalImage timg where timg.users = :users")
    List<String> findAllTemporalImageUrlsByUser(@Param("users") User user);

    List<TemporalImage> findTemporalImagesByUsers(User user);

    TemporalImage findTemporalImageByImageUrl(String imageUrl);

}
