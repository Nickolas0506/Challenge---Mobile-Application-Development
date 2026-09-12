package br.com.fiap.solin.recurso;

import br.com.fiap.solin.auth.UsuarioLogado;
import br.com.fiap.solin.exception.ApiException;
import br.com.fiap.solin.recurso.dto.PasseioRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PasseioService {

    private final PasseioRepository passeios;

    public PasseioService(PasseioRepository passeios) {
        this.passeios = passeios;
    }

    public List<Passeio> listar(UsuarioLogado usuario) {
        return passeios.findByUserIdOrderByDataDesc(usuario.uid());
    }

    public Passeio buscar(UsuarioLogado usuario, String id) {
        return passeios.findByIdAndUserId(Ids.parse(id), usuario.uid())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Passeio nao encontrado."));
    }

    public Passeio criar(UsuarioLogado usuario, PasseioRequest pedido) {
        Passeio passeio = new Passeio();
        passeio.setUserId(usuario.uid());
        preencher(passeio, pedido);
        return passeios.save(passeio);
    }

    public Passeio atualizar(UsuarioLogado usuario, String id, PasseioRequest pedido) {
        Passeio passeio = buscar(usuario, id);
        preencher(passeio, pedido);
        return passeios.save(passeio);
    }

    public void remover(UsuarioLogado usuario, String id) {
        passeios.delete(buscar(usuario, id));
    }

    private void preencher(Passeio passeio, PasseioRequest pedido) {
        passeio.setPetId(pedido.petId());
        passeio.setData(pedido.data());
        passeio.setDuracaoMin(pedido.duracaoMin());
        passeio.setBebeuAgua(Boolean.TRUE.equals(pedido.bebeuAgua()));
        passeio.setUrinou(Boolean.TRUE.equals(pedido.urinou()));
        passeio.setUrinaNormal(Boolean.TRUE.equals(pedido.urinaNormal()));
        passeio.setFezesNormais(Boolean.TRUE.equals(pedido.fezesNormais()));
        passeio.setComportamentoNormal(Boolean.TRUE.equals(pedido.comportamentoNormal()));
        passeio.setObservacao(pedido.observacao() == null ? "" : pedido.observacao());
    }
}
