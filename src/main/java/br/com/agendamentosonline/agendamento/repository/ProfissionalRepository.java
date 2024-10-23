package br.com.agendamentosonline.agendamento.repository;

import br.com.agendamentosonline.agendamento.model.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {}

