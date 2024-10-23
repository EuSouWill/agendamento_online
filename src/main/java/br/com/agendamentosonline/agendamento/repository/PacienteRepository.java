package br.com.agendamentosonline.agendamento.repository;

import br.com.agendamentosonline.agendamento.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Optional<Paciente> findByCpf(String cpf);

}

