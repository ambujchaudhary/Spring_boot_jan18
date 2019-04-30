package com.sombrainc.util.validator;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;

import com.sombrainc.exception.BadRequest400Exception;

public final class Validator {

    private Validator() {
    }

    public static boolean validateForNulls(Object objectToValidate) {
        Field[] declaredFields = objectToValidate.getClass().getDeclaredFields();
        for (Field field : declaredFields) {
            Annotation annotation = field.getAnnotation(RequiredField.class);
            if (annotation != null) {
                RequiredField requiredField = (RequiredField) annotation;
                if (requiredField.value()) {
                    field.setAccessible(true);
                }
                try {
                    if (field.get(objectToValidate) == null) {
                        throw new BadRequest400Exception(field.getName() + " is required");
                    }
                } catch (IllegalAccessException e) {
                    throw new BadRequest400Exception(field.getName() + " is required");
                }
            }
        }
        return true;
    }
}
