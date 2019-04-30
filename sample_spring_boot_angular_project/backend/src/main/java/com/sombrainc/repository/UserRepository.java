package com.sombrainc.repository;

import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.Role;
import com.sombrainc.entity.enumeration.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findOneByEmail(String email);

    Optional<User> findOneBySocialId(String socialId);

    @Query("select u from User u left join u.editedProfile ep where u.status in :statuses and ep.adminsComment is null "
        + "and u.blocked = false")
    List<User> getPendingUsers(@Param("statuses") List<UserStatus> statuses);

    List<User> findUsersByStatusIsAndBlockedFalse(@Param("status") UserStatus status);

    List<User> findByBlockedTrueOrStatusIs(@Param("status") UserStatus status);

    List<User> findAllByStatusIn(List<UserStatus> userStatuses);

    @Query("select u.email from User u where u.role = :role")
    List<String> findEmailsByUserRole(@Param("role") Role role);

    Optional<User> findByEmailAndBlockedIsTrue(String email);

    @Query("select count(u) from User u where year(u.startDate) = :year and month(u.startDate) = :month and day(u.startDate) = :day ")
    int countUsersByDay(@Param("year") int year, @Param("month") int month, @Param("day") int day);

    @Query("select count(u) from User u where year(u.startDate) = :year and month(u.startDate) = :month ")
    int countUsersByMonth(@Param("year") int year, @Param("month") int month);

    @Query("select count(u) from User u where year(u.startDate) = :year ")
    int countUsersByYear(@Param("year") int year);

    List<User> findByRole(Role role);

}
