package com.sombrainc.service.impl;

import com.sombrainc.dto.BusinessProfileDTO;
import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.entity.BusinessProfile;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.UserStatus;
import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.repository.BusinessProfileRepository;
import com.sombrainc.service.BusinessProfileService;
import com.sombrainc.service.UserService;
import com.sombrainc.service.mapper.BusinessProfileDTOMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Slf4j
@Service
public class BusinessProfileServiceImpl implements BusinessProfileService {

    @Autowired
    private BusinessProfileRepository businessProfileRepository;

    @Autowired
    private UserService userService;

    @Override
    public synchronized RestMessageDTO saveBusinessProfile(BusinessProfileDTO businessProfileDTO) {
        LOGGER.info("Saving business profile: {} ", businessProfileDTO);
        BusinessProfile businessProfile = BusinessProfile
            .builder()
            .businessName(businessProfileDTO.getBusinessName())
            .ABN(businessProfileDTO.getABN())
            .GST(businessProfileDTO.isGST())
            .address(businessProfileDTO.getLocationDTO().getAddress())
            .latitude(new BigDecimal(businessProfileDTO.getLocationDTO().getLat()))
            .longitude(new BigDecimal(businessProfileDTO.getLocationDTO().getLng()))
            .webAddress(businessProfileDTO.getWebAddress())
            .build();
        User user = userService.getCurrentUser();
        if (user.getBusinessProfile() != null) {
            throw new BadRequest400Exception("Business profile already set");
        }
        businessProfile.setUsers(user);
        businessProfileRepository.save(businessProfile);
        userService.changeUserStatus(user, UserStatus.NEW);
        LOGGER.info("Business profile of user: {} successfully saved", user.getEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("Business profile successfully saved");
    }

    @Override
    public BusinessProfileDTO getBusinessProfile() {
        User user = userService.getCurrentUser();
        BusinessProfile businessProfile = user.getBusinessProfile();
        return BusinessProfileDTOMapper.INSTANCE.map(businessProfile);
    }

    @Override
    public RestMessageDTO editBusinessProfileByUser(BusinessProfileDTO businessProfileDTO) {
        LOGGER.info("Editing business profile: {}", businessProfileDTO);
        editBusinessProfile(userService.getCurrentUser().getBusinessProfile(), businessProfileDTO);
        LOGGER.info("Business profile of user: {} successfully edited", userService.getCurrentUserEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("Business profile successfully edited");
    }

    @Override
    public void editBusinessProfile(BusinessProfile businessProfile, BusinessProfileDTO businessProfileDTO) {
        businessProfile.setBusinessName(businessProfileDTO.getBusinessName());
        businessProfile.setABN(businessProfileDTO.getABN());
        businessProfile.setGST(businessProfileDTO.isGST());
        businessProfile.setLatitude(new BigDecimal(businessProfileDTO.getLocationDTO().getLat()));
        businessProfile.setLongitude(new BigDecimal(businessProfileDTO.getLocationDTO().getLng()));
        businessProfile.setAddress(businessProfileDTO.getLocationDTO().getAddress());
        businessProfile.setWebAddress(businessProfileDTO.getWebAddress());
        businessProfileRepository.save(businessProfile);
    }
}
