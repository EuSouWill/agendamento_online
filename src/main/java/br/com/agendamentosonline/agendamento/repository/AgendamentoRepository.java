package br.com.agendamentosonline.agendamento.repository;

import br.com.agendamentosonline.agendamento.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    List<Agendamento> findByStatus(String status);

    // Buscar agendamentos por período e status
    List<Agendamento> findByDataBetweenAndStatus(LocalDate dataInicio, LocalDate dataFim, String status);

    // Buscar agendamentos por período
    List<Agendamento> findByDataBetween(LocalDate dataInicio, LocalDate dataFim);





}
