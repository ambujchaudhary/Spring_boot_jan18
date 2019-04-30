package com.sombrainc.entity;

import com.sombrainc.entity.enumeration.Experience;
import com.sombrainc.entity.enumeration.WorkerRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "profile")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "users")
    private User users;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "experience")
    private Experience experience;

    @NotNull
    @ElementCollection(targetClass = WorkerRole.class)
    @Enumerated(EnumType.STRING)
    private List<WorkerRole> workerRoles;

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
    @Column(name = "timezone")
    private String timezone;

    @ElementCollection
    @CollectionTable(name = "users_videos", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "videos")
    private List<String> videos;

    @ElementCollection
    @CollectionTable(name = "users_images", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "images")
    private List<String> images;

    @Size(min = 1, max = 255, message = "Certificate can't be longer than 255 characters")
    @Column(name = "certificate")
    private String certificate;

    @ElementCollection
    @CollectionTable(name = "users_resources", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "resources")
    private List<String> resources;

    @NotNull
    @Size(max = 5000, message = "Address can't be longer than 5000 characters")
    @Column(name = "public_bio")
    private String publicBio;

    @ElementCollection
    @CollectionTable(name = "users_equipment", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "equipment")
    private List<String> equipment;

}
