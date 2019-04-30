alter table job
    change column owner owner_type varchar(255) not null,
    change column users owner      bigint       not null,
    drop foreign key fk_job_user,
    add constraint fk_job_owner
        foreign key (owner) references users (id),
    drop column applicants;

create table applicant_job (
    applicant_id  bigint not null,
    job_id        bigint not null,
    primary key (applicant_id, job_id),
    key job_id (job_id),
    constraint applicant_job_ibfk_1
     foreign key (applicant_id) references users (id),
    constraint applicant_job_ibfk_2
     foreign key (job_id) references job (id)
)