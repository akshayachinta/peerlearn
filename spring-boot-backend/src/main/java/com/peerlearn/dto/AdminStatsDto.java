package com.peerlearn.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsDto {
    private long totalStudents;
    private long activeStudents;
    private long totalSkills;
    private long totalRequests;
    private long completedSessions;
    private long upcomingSessions;
    private long totalMutualMatches;
}
