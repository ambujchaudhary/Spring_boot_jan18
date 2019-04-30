ALTER TABLE offer
DROP COLUMN charge_id;

AlTER TABLE offer
ADD first_stripe_charge_id  VARCHAR(30),
ADD go_cardless_first_payment_id VARCHAR(100),
ADD go_cardless_mandate_id VARCHAR(100),
ADD go_cardless_redirect_id VARCHAR(100),
ADD stripe_customer_id VARCHAR(30),
ADD go_cardless_second_payment_id VARCHAR(100),
ADD second_stripe_charge_id VARCHAR(30),
ADD full_amount_charge bit,
ADD payment_status VARCHAR(100);


create table if not exists go_cardless_webhooks
(
    id        bigint auto_increment    primary key,
    date      date   null,
    event_id  varchar(50) null,
    action    varchar(50) null,
    resource_type varchar(50) null,
    resource_id varchar(50) null
)