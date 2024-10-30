package br.com.agendamentosonline.agendamento.service;

import br.com.agendamentosonline.agendamento.model.Disponibilidade;
import br.com.agendamentosonline.agendamento.model.Profissional;
import br.com.agendamentosonline.agendamento.repository.DisponibilidadeRepository;
import br.com.agendamentosonline.agendamento.repository.ProfissionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfissionalService {

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @Autowired
    private DisponibilidadeRepository disponibilidadeRepository;

    // Método para salvar ou atualizar um profissional
    public Profissional salvarProfissional(Profissional profissional) {
        return profissionalRepository.save(profissional);
    }

    // Método para listar todos os profissionais
    public List<Profissional> listarTodos() {
        return profissionalRepository.findAll();
    }

    // Método para buscar um profissional pelo ID
    public Optional<Profissional> buscarPorId(Long id) {
        return profissionalRepository.findById(id);
    }

    // Método para deletar um profissional pelo ID
    public void deletarPorId(Long id) {
        profissionalRepository.deleteById(id);
    }

    // Método para adicionar ou atualizar uma lista de disponibilidades para um profissional
    public List<Disponibilidade> atualizarDisponibilidade(Long profissionalId, List<Disponibilidade> disponibilidades) {
        Optional<Profissional> profissionalOpt = profissionalRepository.findById(profissionalId);

        if (profissionalOpt.isPresent()) {
            Profissional profissional = profissionalOpt.get();
            for (Disponibilidade disponibilidade : disponibilidades) {
                disponibilidade.setProfissional(profissional);
            }
            return disponibilidadeRepository.saveAll(disponibilidades);
        }
        throw new RuntimeException("Profissional não encontrado");
    }

    // Método para listar disponibilidades de um profissional
    public List<Disponibilidade> listarDisponibilidades(Long profissionalId) {
        return disponibilidadeRepository.findByProfissionalId(profissionalId);
    }

    // Método para remover uma disponibilidade específica de um profissional
    public void removerDisponibilidade(Long disponibilidadeId) {
        disponibilidadeRepository.deleteById(disponibilidadeId);
    }
}
