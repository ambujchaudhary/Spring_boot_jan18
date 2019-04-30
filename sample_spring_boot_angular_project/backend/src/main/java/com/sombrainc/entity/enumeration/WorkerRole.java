package com.sombrainc.entity.enumeration;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Getter
public enum WorkerRole {

    PHOTOGRAPHER("Photographer"), VIDEOGRAPHER("Videographer"), DRONE_OPERATOR("Drone operator(Licensed)"), PHOTO_EDITOR(
        "Photo editor"), VIDEO_EDITOR("Video editor"), ASSISTANT("Assistant");

    private String role;

    WorkerRole(String role) {
        this.role = role;
    }

    public static WorkerRole of(String value) {
        return Stream
            .of(values())
            .filter(workerRole -> workerRole.name().equals(value))
            .findFirst()
            .orElseThrow(IllegalArgumentException::new);
    }

    public static List<String> of(List<WorkerRole> workerRoles) {
        List<String> stringListOfWorkerRole = new ArrayList<>();
        for (WorkerRole item : workerRoles) {
            stringListOfWorkerRole.add(item.name());
        }
        return stringListOfWorkerRole;
    }

    public static List<String> jobTypesOf(List<WorkerRole> workerRoles) {
        List<String> stringListOfWorkerRole = new ArrayList<>();
        for (WorkerRole item : workerRoles) {
            stringListOfWorkerRole.add(item.role);
        }
        return stringListOfWorkerRole;
    }

    public static List<WorkerRole> ofRoles(List<String> values) {
        List<WorkerRole> listOfWorkerRoles = new ArrayList<>();
        if (values == null) {
            return listOfWorkerRoles;
        }
        for (String item : values) {
            listOfWorkerRoles.add(of(item));
        }
        return listOfWorkerRoles;
    }
}
