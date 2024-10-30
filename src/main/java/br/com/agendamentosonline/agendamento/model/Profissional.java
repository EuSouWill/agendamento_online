package br.com.agendamentosonline.agendamento.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Profissional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String especialidade;
    private String cro;
    private String telefone;
    private String email;
    private String cpf;
    private String permissao; // Ex: ADMINISTRADOR, DENTISTA, SECRETARIA
    private String senha;

    @OneToMany(mappedBy = "profissional", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Disponibilidade> disponibilidades;

    public boolean isDentista() {
        return "DENTISTA".equalsIgnoreCase(permissao);
    }
}
