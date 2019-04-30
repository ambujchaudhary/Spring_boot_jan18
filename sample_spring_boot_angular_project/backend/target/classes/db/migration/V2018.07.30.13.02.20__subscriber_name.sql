alter table subscriber
    change column name first_name varchar(40) not null,
    add column last_name varchar(40) not null;