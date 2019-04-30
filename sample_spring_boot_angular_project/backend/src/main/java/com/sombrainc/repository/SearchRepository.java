package com.sombrainc.repository;

import com.sombrainc.dto.search.SearchResultDTO;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.math.BigDecimal;
import java.util.List;

@Repository
public class SearchRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<SearchResultDTO> findClosestJobs(BigDecimal lat, BigDecimal lon, int distance) {
        Query query = entityManager
            .createNativeQuery(
                "SELECT j.id, (6371 * acos(cos(radians(:lat)) * cos(radians(j.latitude)) * cos(radians(j.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(j.latitude)))) AS distance FROM shootzu.job j HAVING distance < :distance ORDER BY distance",
                "SearchResultDTO")
            .setParameter("lat", lat)
            .setParameter("lon", lon)
            .setParameter("distance", distance);
        return query.getResultList();
    }

    public List<SearchResultDTO> findClosestUsers(BigDecimal lat, BigDecimal lon, List<String> userStatuses, List<String> workerRoles) {
        Query query = entityManager
            .createNativeQuery("SELECT workers.id "
                + "FROM(SELECT u.id, u.status, s.radius, upwr.worker_roles, (6371 * ACOS(COS(RADIANS(:lat)) * COS(RADIANS(p.latitude)) * COS(RADIANS(p.longitude) - RADIANS(:lon)) + SIN(RADIANS(:lat)) * SIN(RADIANS(p.latitude)))) AS distance "
                + "FROM users u INNER JOIN settings s ON s.users = u.id INNER JOIN shootzu.profile p ON p.users = u.id "
                + "INNER JOIN shootzu.user_profile_worker_roles upwr ON p.id = upwr.user_profile_id) workers "
                + "WHERE workers.status in :statuses AND workers.distance < workers.radius AND workers.worker_roles IN :roles "
                + "ORDER BY workers.distance", "SearchResultDTO")
            .setParameter("lat", lat)
            .setParameter("lon", lon)
            .setParameter("statuses", userStatuses)
            .setParameter("roles", workerRoles);
        return query.getResultList();
    }

}
