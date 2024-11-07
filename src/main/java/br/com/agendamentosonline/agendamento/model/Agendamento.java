package br.com.agendamentosonline.agendamento.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Agendamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomePaciente;
    private LocalDate data;
    private String hora;
    private String profissional;
    private String status;
    private String telefone;
    private String comoChegouNaClinica;
}
