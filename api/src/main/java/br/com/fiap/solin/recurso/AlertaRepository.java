package br.com.fiap.solin.recurso;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    List<Alerta> findByUserIdOrderByDataDesc(String userId);
    Optional<Alerta> findByIdAndUserId(Long id, String userId);
}
