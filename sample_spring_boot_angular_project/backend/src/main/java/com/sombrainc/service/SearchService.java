package com.sombrainc.service;

import com.sombrainc.dto.job.JobShortInfoDTO;
import com.sombrainc.dto.search.SearchRequestDTO;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SearchService {

    List<JobShortInfoDTO> getAvailableJobs(SearchRequestDTO requestParams, Pageable pageable);
}
