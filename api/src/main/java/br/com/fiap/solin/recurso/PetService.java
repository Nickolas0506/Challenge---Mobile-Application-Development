package br.com.fiap.solin.recurso;

import br.com.fiap.solin.auth.UsuarioLogado;
import br.com.fiap.solin.exception.ApiException;
import br.com.fiap.solin.recurso.dto.PetRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class PetService {

    private final PetRepository pets;

    public PetService(PetRepository pets) {
        this.pets = pets;
    }

    public List<Pet> listar(UsuarioLogado usuario) {
        return pets.findByUserIdOrderByIdDesc(usuario.uid());
    }

    public Pet buscar(UsuarioLogado usuario, String id) {
        return pets.findByIdAndUserId(Ids.parse(id), usuario.uid())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Pet nao encontrado."));
    }

    public Pet criar(UsuarioLogado usuario, PetRequest pedido) {
        Pet pet = new Pet();
        pet.setUserId(usuario.uid());
        pet.setCreatedAt(pedido.createdAt() != null ? pedido.createdAt() : Instant.now().toString());
        preencher(pet, pedido);
        return pets.save(pet);
    }

    public Pet atualizar(UsuarioLogado usuario, String id, PetRequest pedido) {
        Pet pet = buscar(usuario, id);
        preencher(pet, pedido);
        return pets.save(pet);
    }

    public void remover(UsuarioLogado usuario, String id) {
        pets.delete(buscar(usuario, id));
    }

    private void preencher(Pet pet, PetRequest pedido) {
        pet.setNome(vazio(pedido.nome(), pet.getNome()));
        pet.setEspecie(vazio(pedido.especie(), pet.getEspecie()));
        pet.setRaca(vazio(pedido.raca(), pet.getRaca()));
        pet.setPeso(vazio(pedido.peso(), pet.getPeso()));
        pet.setIdade(pedido.idade());
        pet.setCaracteristicas(pedido.caracteristicas());
        pet.setFoto(pedido.foto());
    }

    private String vazio(String valor, String atual) {
        return valor == null || valor.isBlank() ? atual : valor;
    }
}
