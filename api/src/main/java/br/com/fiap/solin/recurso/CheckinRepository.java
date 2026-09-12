package br.com.fiap.solin.recurso;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CheckinRepository extends JpaRepository<Checkin, Long> {
    List<Checkin> findByUserIdOrderByDataDesc(String userId);
    Optional<Checkin> findByIdAndUserId(Long id, String userId);
}
