alter table job
    change column job_owner owner varchar(255) not null,
    change column job_title title varchar(255) not null,
    change column job_date date date not null;

alter table job drop column contract;