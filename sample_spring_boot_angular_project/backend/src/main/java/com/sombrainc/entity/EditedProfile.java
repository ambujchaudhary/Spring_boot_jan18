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
@Table(name = "edited_profile")
public class EditedProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "users")
    private User users;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience")
    private Experience experience;

    @ElementCollection(targetClass = WorkerRole.class)
    @Enumerated(EnumType.STRING)
    private List<WorkerRole> workerRoles;

    @Column(name = "latitude")
    private BigDecimal latitude;

    @Column(name = "longitude")
    private BigDecimal longitude;

    @Column(name = "address")
    private String address;

    @Column(name = "timezone")
    private String timezone;

    @ElementCollection
    @CollectionTable(name = "users_edited_videos", joinColumns = @JoinColumn(name = "edited_profile_id"))
    @Column(name = "videos")
    private List<String> videos;

    @ElementCollection
    @CollectionTable(name = "users_edited_images", joinColumns = @JoinColumn(name = "edited_profile_id"))
    @Column(name = "images")
    private List<String> images;

    @Size(min = 1, max = 255, message = "Certificate can't be longer than 255 characters")
    @Column(name = "certificate")
    private String certificate;

    @ElementCollection
    @CollectionTable(name = "users_edited_resources", joinColumns = @JoinColumn(name = "edited_profile_id"))
    @Column(name = "resources")
    private List<String> resources;

    @Size(max = 5000, message = "Address can't be longer than 5000 characters")
    @Column(name = "public_bio")
    private String publicBio;

    @ElementCollection
    @CollectionTable(name = "users_edited_equipment", joinColumns = @JoinColumn(name = "edited_profile_id"))
    @Column(name = "equipment")
    private List<String> equipment;

    @Column(name = "profile_photo")
    private String profilePhoto;

    @Size(min = 1, max = 255, message = "Address can't be longer than 255 characters")
    @Column(name = "admins_comment")
    private String adminsComment;

}
