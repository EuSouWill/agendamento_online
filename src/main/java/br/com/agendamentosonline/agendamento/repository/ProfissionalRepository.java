package br.com.agendamentosonline.agendamento.repository;

import br.com.agendamentosonline.agendamento.model.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {
    Optional<Profissional> findByNome(String nome);

}

