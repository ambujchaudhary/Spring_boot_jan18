package com.sombrainc.util;

import com.sombrainc.entity.Job;
import com.sombrainc.entity.JobApplicant;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.JobStatus;
import com.sombrainc.entity.enumeration.WorkerRole;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;

public final class SearchSpecificationUtil {

    private static final String DATE = "date";

    private static final String NUMBER_OF_HOURS = "numberOfHours";

    private static final String PRICE_PER_HOUR = "pricePerHour";

    private static final String WORKER_ROLES = "workerRoles";

    private static final String JOB_APPLICANTS = "jobApplicants";

    private static final String OWNER = "owner";

    private static final String JOB_STATUS = "jobStatus";

    private static final String ID = "id";

    private static final String APPLICANT = "applicant";

    private SearchSpecificationUtil() {
    }

    public static Specification<Job> withDateRange(LocalDate dateFrom, LocalDate dateTo) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (dateFrom == null && dateTo == null) {
                return criteriaBuilder.conjunction();
            }
            if (dateFrom != null && dateTo == null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get(DATE).as(LocalDate.class), dateFrom);
            }
            if (dateFrom == null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get(DATE).as(LocalDate.class), dateTo);
            }
            return criteriaBuilder.between(root.get(DATE).as(LocalDate.class), dateFrom, dateTo);
        };
    }

    public static Specification<Job> withHours(BigDecimal hourFrom, BigDecimal hourTo) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (hourFrom == null && hourTo == null) {
                return criteriaBuilder.conjunction();
            }
            if (hourFrom != null && hourTo == null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get(NUMBER_OF_HOURS).as(BigDecimal.class), hourFrom);
            }
            if (hourFrom == null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get(NUMBER_OF_HOURS).as(BigDecimal.class), hourTo);
            }
            return criteriaBuilder.between(root.get(NUMBER_OF_HOURS).as(BigDecimal.class), hourFrom, hourTo);
        };
    }

    public static Specification<Job> withAmount(BigDecimal amountFrom, BigDecimal amountTo) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            Expression<BigDecimal> amount = criteriaBuilder.prod(root.get(PRICE_PER_HOUR).as(BigDecimal.class),
                root.get(NUMBER_OF_HOURS).as(BigDecimal.class));
            BigDecimal newAmountTo = null;
            if (amountTo != null) {
                newAmountTo = amountTo.add(new BigDecimal("0.01"));
            }
            if (amountFrom == null && newAmountTo == null) {
                return criteriaBuilder.conjunction();
            }
            if (amountFrom != null && newAmountTo == null) {
                return criteriaBuilder.greaterThanOrEqualTo(amount, amountFrom);
            }
            if (amountFrom == null) {
                return criteriaBuilder.lessThan(amount, newAmountTo);
            }
            return criteriaBuilder.between(amount, amountFrom, newAmountTo);
        };
    }

    public static Specification<Job> withJobType(List<WorkerRole> jobType) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (jobType == null || jobType.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.isTrue(root.join(WORKER_ROLES).in(jobType));
        };
    }

    public static Specification<Job> isNotApplicant(User currentUser) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            Subquery<User> cSubquery = criteriaQuery.subquery(User.class);
            Root<Job> aSubroot = cSubquery.correlate(root);
            Join<Job, JobApplicant> b = aSubroot.join(JOB_APPLICANTS);
            Join<JobApplicant, User> c = b.join(APPLICANT);
            cSubquery.select(c);
            cSubquery.where(criteriaBuilder.equal(c.get(ID), currentUser.getId()));
            return criteriaBuilder.exists(cSubquery).not();
        };
    }

    public static Specification<Job> isNotOwner(User currentUser) {
        return (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.notEqual(root.get(OWNER).as(User.class), currentUser);
    }

    public static Specification<Job> withStatus(JobStatus jobStatus) {
        return (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.equal(root.get(JOB_STATUS), jobStatus);
    }

    public static Specification<Job> withLocation(List<BigInteger> ids, BigDecimal lat, BigDecimal lng) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            criteriaQuery.distinct(true);
            if (lat == null || lng == null) {
                return criteriaBuilder.conjunction();
            }
            return ids.isEmpty() ? criteriaBuilder.disjunction() : root.get(ID).in(ids);
        };
    }
}