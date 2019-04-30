package com.sombrainc.util;

import com.sombrainc.entity.enumeration.JobTabType;

import java.beans.PropertyEditorSupport;

public class JobTabTypeConverter extends PropertyEditorSupport {

    @Override
    public void setAsText(String text) {
        setValue(JobTabType.of(text));
    }
}
