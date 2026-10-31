package com.peerlearn.repository;

import com.peerlearn.model.LearningSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningSessionRepository extends JpaRepository<LearningSession, Long> {
    @Query("SELECT s FROM LearningSession s WHERE (s.mentor.id = :studentId OR s.learner.id = :studentId) AND s.status = :status ORDER BY s.sessionDate ASC, s.sessionTime ASC")
    List<LearningSession> findForStudentByStatus(@Param("studentId") Long studentId, @Param("status") LearningSession.SessionStatus status);

    long countByStatus(LearningSession.SessionStatus status);
}
