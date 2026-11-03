package br.com.fiap.solin.distribuicao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TestadorRepository extends JpaRepository<Testador, Long> {
    Optional<Testador> findByEmailIgnoreCase(String email);
    Optional<Testador> findByCodigo(String codigo);
    List<Testador> findAllByOrderByConvidadoEmDesc();
}
