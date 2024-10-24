package br.com.agendamentosonline.agendamento.service;

import br.com.agendamentosonline.agendamento.model.Profissional;
import br.com.agendamentosonline.agendamento.repository.ProfissionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfissionalService {

    @Autowired
    private ProfissionalRepository profissionalRepository;

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
}
