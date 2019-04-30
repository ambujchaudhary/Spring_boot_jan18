package com.sombrainc.entity.enumeration;

import com.sombrainc.exception.BadRequest400Exception;
import lombok.Getter;

import java.util.stream.Stream;

@Getter
public enum Star {

    ONE(1), TWO(2), THREE(3), FOUR(4), FIVE(5);

    private int value;

    Star(int value) {
        this.value = value;
    }

    public static Star of(String value) {
        return Stream
            .of(values())
            .filter(starMark -> starMark.name().equals(value))
            .findFirst()
            .orElseThrow(() -> new BadRequest400Exception("Unsupported type of star"));
    }

}
