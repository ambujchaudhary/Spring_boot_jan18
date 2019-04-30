package com.sombrainc.repository;

import com.sombrainc.entity.TemporalLink;
import com.sombrainc.entity.enumeration.TemporalLinkType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Repository
public interface TemporalLinkRepository extends JpaRepository<TemporalLink, Long> {

    TemporalLink findByTokenAndTypeAndActiveIsTrueAndExpiryDateIsAfter(String token, TemporalLinkType temporalLinkType,
        LocalDateTime expiryDate);

    @Transactional
    @Modifying
    @Query(value = "update TemporalLink l set l.active = :active where l.token = :token")
    void updateActiveTemporalLinkByToken(@Param("token") String token, @Param("active") Boolean active);

    boolean existsByTokenAndActiveIsTrue(String link);
}
