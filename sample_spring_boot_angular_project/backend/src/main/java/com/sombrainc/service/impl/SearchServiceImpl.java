package com.sombrainc.service.impl;

import com.sombrainc.dto.job.JobShortInfoDTO;
import com.sombrainc.dto.search.QueryParametersDTO;
import com.sombrainc.dto.search.SearchRequestDTO;
import com.sombrainc.dto.search.SearchResultDTO;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.JobStatus;
import com.sombrainc.entity.enumeration.WorkerRole;
import com.sombrainc.repository.JobRepository;
import com.sombrainc.repository.SearchRepository;
import com.sombrainc.service.JobService;
import com.sombrainc.service.SearchService;
import com.sombrainc.service.UserService;
import com.sombrainc.service.mapper.JobShortInfoDTOMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.List;
import java.util.stream.Collectors;

import static com.sombrainc.util.SearchSpecificationUtil.*;

@Slf4j
@Service
public class SearchServiceImpl implements SearchService {

    @Autowired
    private SearchRepository searchRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JobService jobService;

    @Override
    public List<JobShortInfoDTO> getAvailableJobs(SearchRequestDTO requestParams, Pageable pageable) {
        QueryParametersDTO params = QueryParametersDTO.of(requestParams);
        User currentUser = userService.getCurrentUser();
        LOGGER.info("Search by {} with params: {}", currentUser.getEmail(), params);
        List<BigInteger> ids = searchRepository
            .findClosestJobs(params.getLatitude(), params.getLongitude(), params.getRadius())
            .stream()
            .map(SearchResultDTO::getId)
            .collect(Collectors.toList());
        return jobRepository
            .findAll(Specification
                .where(withLocation(ids, params.getLatitude(), params.getLongitude()))
                .and(withStatus(JobStatus.NEW).or(withStatus(JobStatus.WAITING_FOR_RESPONSE)))
                .and(isNotOwner(currentUser))
                .and(isNotApplicant(currentUser))
                .and(withJobType(WorkerRole.ofRoles(params.getJobType())))
                .and(withDateRange(params.getDateFrom(), params.getDateTo()))
                .and(withHours(params.getHourFrom(), params.getHourTo()))
                .and(withAmount(params.getAmountFrom(), params.getAmountTo())), pageable)
            .getContent()
            .stream()
            .map(JobShortInfoDTOMapper.INSTANCE::map)
            .map(jobShortInfoDTO -> jobService.hideOwnerName(jobShortInfoDTO))
            .collect(Collectors.toList());
    }
}
