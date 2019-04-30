package com.sombrainc.entity.enumeration;

import com.sombrainc.exception.BadRequest400Exception;
import lombok.Getter;

import java.util.stream.Stream;

@Getter
public enum JobTabType {

    AVAILABLE("available"), MY_APPLICATIONS("my-applications"), UPCOMING("upcoming"), ARCHIVED("archived");

    private String type;

    JobTabType(String type) {
        this.type = type;
    }

    public static JobTabType of(String value) {
        return Stream
            .of(values())
            .filter(tabType -> tabType.getType().equalsIgnoreCase(value))
            .findFirst()
            .orElseThrow(() -> new BadRequest400Exception("Unsupported type of tab"));
    }
}
