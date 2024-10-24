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
        Optional<Paciente> pacienteExistente = pacienteRepository.findByCpf(paciente.getCpf());
        if (pacienteExistente.isPresent()) {
            // Se o CPF já existe, retorna o paciente existente
            return pacienteExistente.get();
        }
        // Se o CPF não existe, cria um novo paciente
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