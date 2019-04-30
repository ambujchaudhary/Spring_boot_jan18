package com.sombrainc.repository;

import com.sombrainc.entity.GoCardlessWebhooks;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GoCardlessWebhooksRepository extends JpaRepository<GoCardlessWebhooks, Long> {

    Optional<GoCardlessWebhooks> findByEventId(String eventId);

}
