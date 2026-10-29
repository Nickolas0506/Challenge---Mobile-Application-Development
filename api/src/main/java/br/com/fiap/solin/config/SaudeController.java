package br.com.fiap.solin.config;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/** Verificacao de saude usada pelo Railway (fora de /api, entao nao exige JWT). */
@RestController
public class SaudeController {

    @GetMapping("/saude")
    public Map<String, String> saude() {
        return Map.of("status", "ok");
    }
}
