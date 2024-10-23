package br.com.agendamentosonline.agendamento.service;

import br.com.agendamentosonline.agendamento.model.Agendamento;
import br.com.agendamentosonline.agendamento.repository.AgendamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

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
}

