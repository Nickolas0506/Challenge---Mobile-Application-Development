package br.com.fiap.solin.distribuicao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VersaoAppRepository extends JpaRepository<VersaoApp, Long> {
    List<VersaoApp> findAllByOrderByPublicadaEmDesc();
    Optional<VersaoApp> findFirstByOrderByPublicadaEmDesc();
}
