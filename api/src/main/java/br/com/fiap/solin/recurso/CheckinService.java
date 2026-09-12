package br.com.fiap.solin.recurso;

import br.com.fiap.solin.auth.UsuarioLogado;
import br.com.fiap.solin.exception.ApiException;
import br.com.fiap.solin.recurso.dto.CheckinRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CheckinService {

    private final CheckinRepository checkins;

    public CheckinService(CheckinRepository checkins) {
        this.checkins = checkins;
    }

    public List<Checkin> listar(UsuarioLogado usuario) {
        return checkins.findByUserIdOrderByDataDesc(usuario.uid());
    }

    public Checkin buscar(UsuarioLogado usuario, String id) {
        return checkins.findByIdAndUserId(Ids.parse(id), usuario.uid())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Check-in nao encontrado."));
    }

    public Checkin criar(UsuarioLogado usuario, CheckinRequest pedido) {
        Checkin checkin = new Checkin();
        checkin.setUserId(usuario.uid());
        preencher(checkin, pedido);
        return checkins.save(checkin);
    }

    public Checkin atualizar(UsuarioLogado usuario, String id, CheckinRequest pedido) {
        Checkin checkin = buscar(usuario, id);
        preencher(checkin, pedido);
        return checkins.save(checkin);
    }

    public void remover(UsuarioLogado usuario, String id) {
        checkins.delete(buscar(usuario, id));
    }

    private void preencher(Checkin checkin, CheckinRequest pedido) {
        checkin.setPetId(pedido.petId());
        checkin.setData(pedido.data());
        checkin.setHumor(pedido.humor());
        checkin.setObservacao(pedido.observacao());
    }
}
