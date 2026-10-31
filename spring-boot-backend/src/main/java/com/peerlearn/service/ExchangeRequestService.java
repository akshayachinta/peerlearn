package com.peerlearn.service;

import com.peerlearn.model.Activity;
import com.peerlearn.model.ExchangeRequest;
import com.peerlearn.model.Student;
import com.peerlearn.repository.ActivityRepository;
import com.peerlearn.repository.ExchangeRequestRepository;
import com.peerlearn.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ExchangeRequestService {

    @Autowired
    private ExchangeRequestRepository exchangeRequestRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ActivityRepository activityRepository;

    public ExchangeRequest sendRequest(Long senderId, Long receiverId, String teachingSkill, String learningSkill, String message, String preferredMode) {
        if (senderId.equals(receiverId)) {
            throw new IllegalArgumentException("Cannot send exchange request to yourself.");
        }

        Student sender = studentRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found."));

        Student receiver = studentRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found."));

        if (exchangeRequestRepository.hasPendingRequestBetween(senderId, receiverId)) {
            throw new IllegalStateException("A pending exchange request already exists between you and this student.");
        }

        ExchangeRequest request = ExchangeRequest.builder()
                .sender(sender)
                .receiver(receiver)
                .teachingSkill(teachingSkill)
                .learningSkill(learningSkill)
                .message(message)
                .preferredMode(preferredMode != null ? preferredMode : "Online")
                .status(ExchangeRequest.RequestStatus.PENDING)
                .build();

        ExchangeRequest saved = exchangeRequestRepository.save(request);

        activityRepository.save(Activity.builder()
                .type("REQUEST")
                .title("Exchange Request Sent")
                .description(sender.getFullName() + " proposed a skill exchange with " + receiver.getFullName() + " (" + teachingSkill + " ⇄ " + learningSkill + ").")
                .studentId(sender.getId())
                .studentName(sender.getFullName())
                .build());

        return saved;
    }

    public ExchangeRequest acceptRequest(Long requestId, Long currentUserId) {
        ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found."));

        if (!request.getReceiver().getId().equals(currentUserId)) {
            throw new SecurityException("Only the recipient can accept this exchange request.");
        }

        request.setStatus(ExchangeRequest.RequestStatus.ACCEPTED);
        request.setUpdatedAt(LocalDateTime.now());
        ExchangeRequest saved = exchangeRequestRepository.save(request);

        activityRepository.save(Activity.builder()
                .type("ACCEPT")
                .title("Exchange Request Accepted")
                .description(request.getReceiver().getFullName() + " accepted " + request.getSender().getFullName() + "'s exchange proposal. Ready to schedule sessions!")
                .studentId(request.getReceiver().getId())
                .studentName(request.getReceiver().getFullName())
                .build());

        return saved;
    }

    public ExchangeRequest rejectRequest(Long requestId, Long currentUserId) {
        ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found."));

        if (!request.getReceiver().getId().equals(currentUserId)) {
            throw new SecurityException("Only the recipient can reject this exchange request.");
        }

        request.setStatus(ExchangeRequest.RequestStatus.REJECTED);
        request.setUpdatedAt(LocalDateTime.now());
        return exchangeRequestRepository.save(request);
    }

    public ExchangeRequest cancelRequest(Long requestId, Long currentUserId) {
        ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found."));

        if (!request.getSender().getId().equals(currentUserId)) {
            throw new SecurityException("Only the sender can cancel this exchange request.");
        }

        request.setStatus(ExchangeRequest.RequestStatus.CANCELLED);
        request.setUpdatedAt(LocalDateTime.now());
        return exchangeRequestRepository.save(request);
    }

    @Transactional(readOnly = true)
    public List<ExchangeRequest> getIncomingPendingRequests(Long studentId) {
        return exchangeRequestRepository.findByReceiverIdAndStatus(studentId, ExchangeRequest.RequestStatus.PENDING);
    }

    @Transactional(readOnly = true)
    public List<ExchangeRequest> getSentPendingRequests(Long studentId) {
        return exchangeRequestRepository.findBySenderIdAndStatus(studentId, ExchangeRequest.RequestStatus.PENDING);
    }

    @Transactional(readOnly = true)
    public List<ExchangeRequest> getAcceptedConnections(Long studentId) {
        return exchangeRequestRepository.findAcceptedForStudent(studentId, ExchangeRequest.RequestStatus.ACCEPTED);
    }
}
