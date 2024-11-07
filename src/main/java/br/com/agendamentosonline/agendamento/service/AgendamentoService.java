package br.com.agendamentosonline.agendamento.service;

import br.com.agendamentosonline.agendamento.model.Agendamento;
import br.com.agendamentosonline.agendamento.repository.AgendamentoRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @PersistenceContext
    private EntityManager entityManager; // Injetando EntityManager

    @Autowired
    private DisponibilidadeService disponibilidadeService;

    public List<Agendamento> filtrarAgendamentos(LocalDate dataInicio, LocalDate dataFim, String status, String profissional, String nomePaciente, String origem) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Agendamento> cq = cb.createQuery(Agendamento.class);
        Root<Agendamento> agendamento = cq.from(Agendamento.class);

        List<Predicate> predicates = new ArrayList<>();



        if (origem != null && !origem.isEmpty()) {
            predicates.add(cb.equal(agendamento.get("comoChegouNaClinica"), origem));
        }


        if (dataInicio != null) {
            predicates.add(cb.greaterThanOrEqualTo(agendamento.get("data"), dataInicio));
        }



        if (dataFim != null) {
            predicates.add(cb.lessThanOrEqualTo(agendamento.get("data"), dataFim));
        }

        if (status != null && !status.isEmpty()) {
            predicates.add(cb.equal(agendamento.get("status"), status));
        }

        if (profissional != null && !profissional.isEmpty()) {
            predicates.add(cb.equal(agendamento.get("profissional"), profissional));
        }

        if (nomePaciente != null && !nomePaciente.isEmpty()) {
            predicates.add(cb.like(cb.lower(agendamento.get("nomePaciente")), "%" + nomePaciente.toLowerCase() + "%"));
        }

        cq.where(predicates.toArray(new Predicate[0]));
        return entityManager.createQuery(cq).getResultList();
    }


    // Método para criar um novo agendamento
    public Agendamento salvarAgendamento(Agendamento agendamento) {
        return agendamentoRepository.save(agendamento);
    }

    // Método para listar todos os agendamentos
    public List<Agendamento> listarTodos() {
        return agendamentoRepository.findAll();
    }

    // Método para buscar um agendamento pelo ID
    public Optional<Agendamento> buscarPorId(Long id) {
        return agendamentoRepository.findById(id);
    }

    // Método para deletar um agendamento pelo ID
    public void deletarPorId(Long id) {
        agendamentoRepository.deleteById(id);
    }

    // Método para atualizar o status de um agendamento
    public Agendamento atualizarStatus(Long id, String novoStatus) {
        Optional<Agendamento> agendamentoOpt = agendamentoRepository.findById(id);
        if (agendamentoOpt.isPresent()) {
            Agendamento agendamento = agendamentoOpt.get();
            agendamento.setStatus(novoStatus);
            return agendamentoRepository.save(agendamento);
        }
        throw new RuntimeException("Agendamento não encontrado!");
    }
    public List<Agendamento> listarPendentes() {
        return agendamentoRepository.findByStatus("PENDENTE");
    }


}
