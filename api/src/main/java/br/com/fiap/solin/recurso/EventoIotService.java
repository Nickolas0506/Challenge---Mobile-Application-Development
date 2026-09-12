package br.com.fiap.solin.recurso;

import br.com.fiap.solin.auth.UsuarioLogado;
import br.com.fiap.solin.exception.ApiException;
import br.com.fiap.solin.recurso.dto.EventoIotRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventoIotService {

    private final EventoIotRepository eventos;

    public EventoIotService(EventoIotRepository eventos) {
        this.eventos = eventos;
    }

    public List<EventoIot> listar(UsuarioLogado usuario) {
        return eventos.findByUserIdOrderByDataDesc(usuario.uid());
    }

    public EventoIot criar(UsuarioLogado usuario, EventoIotRequest pedido) {
        EventoIot evento = new EventoIot();
        evento.setUserId(usuario.uid());
        evento.setData(pedido.data());
        evento.setTipo(pedido.tipo());
        evento.setMensagem(pedido.mensagem());
        return eventos.save(evento);
    }

    public EventoIot atualizar(UsuarioLogado usuario, String id, EventoIotRequest pedido) {
        EventoIot evento = eventos.findByIdAndUserId(Ids.parse(id), usuario.uid())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Evento IoT nao encontrado."));
        evento.setData(pedido.data());
        evento.setTipo(pedido.tipo());
        evento.setMensagem(pedido.mensagem());
        return eventos.save(evento);
    }

    public void remover(UsuarioLogado usuario, String id) {
        EventoIot evento = eventos.findByIdAndUserId(Ids.parse(id), usuario.uid())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Evento IoT nao encontrado."));
        eventos.delete(evento);
    }
}
