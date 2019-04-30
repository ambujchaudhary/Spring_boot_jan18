package com.sombrainc.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "business_profile")
public class BusinessProfile {

    public static final String ONLY_NUMBERS = "^[0-9]+$";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 1, max = 255, message = "Business name can't be longer than 255 characters")
    @Column(name = "business_name")
    private String businessName;

    @NotNull
    @Column(name = "abn")
    @Size(min = 1, max = 100, message = "ABN can't be longer than 100 characters")
    @Pattern(regexp = ONLY_NUMBERS)
    private String ABN;

    @NotNull
    @Column(name = "gst")
    private Boolean GST;

    @NotNull
    @Column(name = "latitude")
    private BigDecimal latitude;

    @NotNull
    @Column(name = "longitude")
    private BigDecimal longitude;

    @NotNull
    @Size(min = 1, max = 255, message = "Address can't be longer than 255 characters")
    @Column(name = "address")
    private String address;

    @NotNull
    @Size(min = 1, max = 255, message = "Web address can't be longer than 255 characters")
    @Column(name = "web_address")
    private String webAddress;

    @JsonIgnore
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "users")
    private User users;

}
