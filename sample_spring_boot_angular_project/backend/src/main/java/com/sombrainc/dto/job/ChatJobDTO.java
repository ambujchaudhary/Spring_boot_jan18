package com.sombrainc.dto.job;

import com.sombrainc.entity.Job;
import com.sombrainc.entity.enumeration.WorkerRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatJobDTO {

    private String id;

    private String title;

    private List<WorkerRole> workerRoles;

    public ChatJobDTO(Job job) {
        this.id = job.getId().toString();
        this.title = job.getTitle();
        this.workerRoles = job.getWorkerRoles();
    }
}
