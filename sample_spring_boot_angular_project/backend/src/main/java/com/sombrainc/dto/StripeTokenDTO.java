package com.sombrainc.dto;

import lombok.Data;

@Data
public class StripeTokenDTO {

    private String token;

    private boolean fullCharge;
}
