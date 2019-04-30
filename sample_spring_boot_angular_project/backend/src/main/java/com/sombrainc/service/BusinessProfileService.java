package com.sombrainc.service;

import com.sombrainc.dto.BusinessProfileDTO;
import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.entity.BusinessProfile;

public interface BusinessProfileService {

    RestMessageDTO saveBusinessProfile(BusinessProfileDTO businessProfile);

    BusinessProfileDTO getBusinessProfile();

    RestMessageDTO editBusinessProfileByUser(BusinessProfileDTO businessProfileDTO);

    void editBusinessProfile(BusinessProfile businessProfile, BusinessProfileDTO businessProfileDTO);

}
