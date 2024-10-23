package br.com.agendamentosonline.agendamento.repository;

import br.com.agendamentosonline.agendamento.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {}

