package br.com.agendamentosonline.agendamento.repository;

import br.com.agendamentosonline.agendamento.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {}

