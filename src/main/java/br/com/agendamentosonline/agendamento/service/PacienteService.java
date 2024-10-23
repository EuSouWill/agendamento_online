package br.com.agendamentosonline.agendamento.service;

import br.com.agendamentosonline.agendamento.model.Paciente;
import br.com.agendamentosonline.agendamento.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    // Método para salvar ou atualizar um paciente
    public Paciente salvarPaciente(Paciente paciente) {
        return pacienteRepository.save(paciente);
    }

    // Método para listar todos os pacientes
    public List<Paciente> listarTodos() {
        return pacienteRepository.findAll();
    }

    // Método para buscar um paciente pelo ID
    public Optional<Paciente> buscarPorId(Long id) {
        return pacienteRepository.findById(id);
    }

    // Método para deletar um paciente pelo ID
    public void deletarPorId(Long id) {
        pacienteRepository.deleteById(id);
    }
}
