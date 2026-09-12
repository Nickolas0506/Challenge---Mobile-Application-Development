package br.com.fiap.solin.recurso;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PasseioRepository extends JpaRepository<Passeio, Long> {
    List<Passeio> findByUserIdOrderByDataDesc(String userId);
    Optional<Passeio> findByIdAndUserId(Long id, String userId);
}
