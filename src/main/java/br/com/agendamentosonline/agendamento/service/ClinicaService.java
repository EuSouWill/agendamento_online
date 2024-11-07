package br.com.agendamentosonline.agendamento.service;

import br.com.agendamentosonline.agendamento.model.Clinica;
import br.com.agendamentosonline.agendamento.repository.ClinicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClinicaService {

    @Autowired
    private ClinicaRepository clinicaRepository;

    // Método para salvar uma nova clínica
    public Clinica salvarClinica(Clinica clinica) {
        return clinicaRepository.save(clinica);
    }

    // Método para listar todas as clínicas
    public List<Clinica> listarClinicas() {
        return clinicaRepository.findAll();
    }

    // Método para buscar uma clínica por ID
    public Clinica buscarClinicaPorId(Long id) {
        return clinicaRepository.findById(id).orElse(null);
    }

    // Método para autenticar a clínica pelo e-mail e senha
    public Clinica authenticate(String email, String senha) {
        return clinicaRepository.findByEmailAndSenha(email, senha);
    }
}
