package com.sombrainc.dto.chat;

import com.sombrainc.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMemberDTO {

    private String userId;

    private String profilePhoto;

    private String firstName;

    private String lastName;

    public static ChatMemberDTO of(User user) {
        return ChatMemberDTO
            .builder()
            .userId(user.getId().toString())
            .profilePhoto(user.getImage() == null ? "logo" : user.getImage().getLogo())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .build();
    }
}
