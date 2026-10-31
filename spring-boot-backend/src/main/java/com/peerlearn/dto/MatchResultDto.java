package com.peerlearn.dto;

import com.peerlearn.model.Student;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchResultDto {
    private Student student;
    private String matchType; // "MUTUAL", "ONE_WAY_LEARN", "ONE_WAY_TEACH"
    private Integer matchPercentage;
    private List<String> whatYouTeachThem;
    private List<String> whatTheyTeachYou;
}
