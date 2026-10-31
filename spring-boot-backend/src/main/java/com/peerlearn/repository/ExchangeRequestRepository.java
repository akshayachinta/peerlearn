package com.peerlearn.repository;

import com.peerlearn.model.ExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {
    List<ExchangeRequest> findByReceiverIdAndStatus(Long receiverId, ExchangeRequest.RequestStatus status);
    List<ExchangeRequest> findBySenderIdAndStatus(Long senderId, ExchangeRequest.RequestStatus status);

    @Query("SELECT r FROM ExchangeRequest r WHERE (r.sender.id = :studentId OR r.receiver.id = :studentId) AND r.status = :status")
    List<ExchangeRequest> findAcceptedForStudent(@Param("studentId") Long studentId, @Param("status") ExchangeRequest.RequestStatus status);

    @Query("SELECT COUNT(r) > 0 FROM ExchangeRequest r WHERE " +
           "((r.sender.id = :s1 AND r.receiver.id = :s2) OR (r.sender.id = :s2 AND r.receiver.id = :s1)) " +
           "AND r.status = 'PENDING'")
    boolean hasPendingRequestBetween(@Param("s1") Long student1Id, @Param("s2") Long student2Id);

    @Query("SELECT COUNT(r) > 0 FROM ExchangeRequest r WHERE " +
           "((r.sender.id = :s1 AND r.receiver.id = :s2) OR (r.sender.id = :s2 AND r.receiver.id = :s1)) " +
           "AND r.status = 'ACCEPTED'")
    boolean hasAcceptedConnectionBetween(@Param("s1") Long student1Id, @Param("s2") Long student2Id);
}
