package com.sombrainc.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "image")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "url")
    private String url;

    @Column(name = "original_name")
    private String originalName;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "size_200")
    private String size200;

    @Column(name = "logo")
    private String logo;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "users")
    private User users;

    private Image(String url, String originalName, String fullName, String size200, String logo, User users) {
        this.url = url;
        this.originalName = originalName;
        this.fullName = fullName;
        this.size200 = size200;
        this.logo = logo;
        this.users = users;
    }

    public static Image createImage(String url, String originalName, String fullName, String size200, String logo, User users) {
        return new Image(url, originalName, fullName, size200, logo, users);
    }

}
