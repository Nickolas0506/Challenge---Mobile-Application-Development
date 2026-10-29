package br.com.fiap.solin.recurso;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

/**
 * Regras que transformam registros do tutor em alertas automaticos.
 * O app consulta /api/alertas e avisa o tutor por notificacao quando surge um alerta novo.
 */
@Service
public class MonitorSaudeService {

    static final int LIMITE_USOS_24H = 8;

    private final AlertaRepository alertas;
    private final PetRepository pets;
    private final EventoIotRepository eventos;

    public MonitorSaudeService(AlertaRepository alertas, PetRepository pets, EventoIotRepository eventos) {
        this.alertas = alertas;
        this.pets = pets;
        this.eventos = eventos;
    }

    public void analisarPasseio(Passeio passeio) {
        List<String> sinais = new ArrayList<>();
        if (!passeio.isUrinou()) sinais.add("nao urinou");
        else if (!passeio.isUrinaNormal()) sinais.add("urina alterada");
        if (!passeio.isFezesNormais()) sinais.add("fezes alteradas");
        if (!passeio.isComportamentoNormal()) sinais.add("comportamento diferente do normal");
        if (!passeio.isBebeuAgua()) sinais.add("nao bebeu agua");
        if (sinais.isEmpty()) return;

        String nome = nomeDoPet(passeio.getUserId(), passeio.getPetId());
        String resumo = String.join(", ", sinais);
        registrar(
                passeio.getUserId(),
                "passeio",
                "Atencao apos o passeio de " + nome,
                Character.toUpperCase(resumo.charAt(0)) + resumo.substring(1)
                        + ". Observe nas proximas horas e, se continuar, agende uma consulta."
        );
    }

    public void analisarCheckin(Checkin checkin) {
        if (!"ruim".equals(checkin.getHumor())) return;
        String nome = nomeDoPet(checkin.getUserId(), checkin.getPetId());
        registrar(
                checkin.getUserId(),
                "checkin",
                nome + " nao esta bem hoje",
                "O check-in foi marcado como ruim. Veja se ha vomito, falta de apetite ou letargia."
        );
    }

    public void analisarEventoIot(EventoIot evento) {
        if ("sem_uso".equals(evento.getTipo())) {
            registrar(
                    evento.getUserId(),
                    "iot",
                    "Caixa de areia sem uso",
                    "O sensor nao detectou uso recente. Retencao urinaria pode ser urgente em gatos."
            );
            return;
        }

        Instant limite = Instant.now().minus(Duration.ofHours(24));
        long usos24h = eventos.findByUserIdOrderByDataDesc(evento.getUserId()).stream()
                .filter(e -> depoisDe(e.getData(), limite))
                .count();
        // alerta so na virada do limite, para nao repetir a cada novo uso
        if (usos24h == LIMITE_USOS_24H) {
            registrar(
                    evento.getUserId(),
                    "iot",
                    "Uso excessivo da caixa de areia",
                    usos24h + " usos nas ultimas 24h. Aumento de frequencia pode indicar problema urinario."
            );
        }
    }

    private void registrar(String userId, String tipo, String titulo, String mensagem) {
        Alerta alerta = new Alerta();
        alerta.setUserId(userId);
        alerta.setTipo(tipo);
        alerta.setTitulo(titulo);
        alerta.setMensagem(mensagem);
        alerta.setLido(false);
        alerta.setData(Instant.now().toString());
        alertas.save(alerta);
    }

    private String nomeDoPet(String userId, String petId) {
        if (petId == null || petId.isBlank()) return "seu pet";
        try {
            return pets.findByIdAndUserId(Long.valueOf(petId), userId).map(Pet::getNome).orElse("seu pet");
        } catch (NumberFormatException e) {
            return "seu pet";
        }
    }

    private static boolean depoisDe(String iso, Instant limite) {
        try {
            return Instant.parse(iso).isAfter(limite);
        } catch (DateTimeParseException | NullPointerException e) {
            return false;
        }
    }
}
