package br.com.agendamentosonline.agendamento.repository;

import br.com.agendamentosonline.agendamento.model.Disponibilidade;
import br.com.agendamentosonline.agendamento.model.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface DisponibilidadeRepository extends JpaRepository<Disponibilidade, Long> {
    List<Disponibilidade> findByProfissionalAndDiaSemana(Profissional profissional, DayOfWeek diaSemana);
    List<Disponibilidade> findByProfissionalId(Long profissionalId);

}
