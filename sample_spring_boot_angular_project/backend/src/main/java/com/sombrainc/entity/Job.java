package com.sombrainc.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sombrainc.dto.search.SearchResultDTO;
import com.sombrainc.entity.enumeration.JobOwner;
import com.sombrainc.entity.enumeration.JobStatus;
import com.sombrainc.entity.enumeration.WorkerRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@SqlResultSetMapping(name = "SearchResultDTO",
    classes = @ConstructorResult(targetClass = SearchResultDTO.class, columns = { @ColumnResult(name = "id") }))
@Data
@Entity
@Table(name = "job")
public class Job extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "ownerType")
    private JobOwner ownerType;

    @NotNull
    @Size(min = 1, max = 255, message = "Title can't be longer than 255 characters")
    @Column(name = "title")
    private String title;

    @NotNull
    @Column(name = "date")
    private LocalDate date;

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
    @ElementCollection(targetClass = WorkerRole.class)
    @Enumerated(EnumType.STRING)
    private List<WorkerRole> workerRoles;

    @Size(max = 5000, message = "Job brief can't be longer than 5000 characters")
    @Column(name = "brief")
    private String brief;

    @ElementCollection
    @CollectionTable(name = "job_equipment", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "equipment")
    private List<String> equipment;

    @NotNull
    @Column(name = "price_per_hour")
    private BigDecimal pricePerHour;

    @NotNull
    @Column(name = "number_of_hour")
    private BigDecimal numberOfHours;

    @ElementCollection
    @CollectionTable(name = "job_attachment", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "attachment")
    private List<String> attachment;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_status")
    private JobStatus jobStatus;

    @Column(name = "last_action")
    private LocalDate lastAction;

    @OneToMany(mappedBy = "job")
    private List<JobApplicant> jobApplicants;

    @OneToMany(mappedBy = "job")
    private List<Offer> offers;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "shooter")
    private User shooter;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner")
    private User owner;

    @Override
    public String toString() {
        return "Job{" + "id=" + id + '}';
    }
}
