package br.com.fiap.solin.recurso;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventoIotRepository extends JpaRepository<EventoIot, Long> {
    List<EventoIot> findByUserIdOrderByDataDesc(String userId);
    Optional<EventoIot> findByIdAndUserId(Long id, String userId);
}
