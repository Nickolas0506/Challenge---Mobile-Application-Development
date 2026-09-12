package br.com.fiap.solin.recurso;

import br.com.fiap.solin.auth.UsuarioLogado;
import br.com.fiap.solin.exception.ApiException;
import br.com.fiap.solin.recurso.dto.AlertaRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertaService {

    private final AlertaRepository alertas;

    public AlertaService(AlertaRepository alertas) {
        this.alertas = alertas;
    }

    public List<Alerta> listar(UsuarioLogado usuario) {
        return alertas.findByUserIdOrderByDataDesc(usuario.uid());
    }

    public Alerta buscar(UsuarioLogado usuario, String id) {
        return alertas.findByIdAndUserId(Ids.parse(id), usuario.uid())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Alerta nao encontrado."));
    }

    public Alerta criar(UsuarioLogado usuario, AlertaRequest pedido) {
        Alerta alerta = new Alerta();
        alerta.setUserId(usuario.uid());
        preencher(alerta, pedido);
        return alertas.save(alerta);
    }

    public Alerta atualizar(UsuarioLogado usuario, String id, AlertaRequest pedido) {
        Alerta alerta = buscar(usuario, id);
        preencher(alerta, pedido);
        return alertas.save(alerta);
    }

    public void remover(UsuarioLogado usuario, String id) {
        alertas.delete(buscar(usuario, id));
    }

    private void preencher(Alerta alerta, AlertaRequest pedido) {
        alerta.setTitulo(pedido.titulo());
        alerta.setMensagem(pedido.mensagem());
        alerta.setTipo(pedido.tipo());
        alerta.setLido(Boolean.TRUE.equals(pedido.lido()));
        alerta.setData(pedido.data());
    }
}
