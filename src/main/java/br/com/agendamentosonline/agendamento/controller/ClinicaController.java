package br.com.agendamentosonline.agendamento.controller;

import br.com.agendamentosonline.agendamento.dto.LoginRequest;
import br.com.agendamentosonline.agendamento.model.Clinica;
import br.com.agendamentosonline.agendamento.service.ClinicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clinicas")
public class ClinicaController {

    @Autowired
    private ClinicaService clinicaService;

    // Endpoint para criar uma nova clínica
    @PostMapping
    public ResponseEntity<Clinica> cadastrarClinica(@RequestBody Clinica clinica) {
        Clinica novaClinica = clinicaService.salvarClinica(clinica);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaClinica);
    }

    // Endpoint para listar todas as clínicas
    @GetMapping
    public ResponseEntity<List<Clinica>> listarClinicas() {
        List<Clinica> clinicas = clinicaService.listarClinicas();
        return ResponseEntity.ok(clinicas);
    }

    // Endpoint para buscar uma clínica por ID
    @GetMapping("/{id}")
    public ResponseEntity<Clinica> buscarClinicaPorId(@PathVariable Long id) {
        Clinica clinica = clinicaService.buscarClinicaPorId(id);
        if (clinica != null) {
            return ResponseEntity.ok(clinica);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @PostMapping("/login/auth")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Clinica clinica = clinicaService.authenticate(loginRequest.getEmail(), loginRequest.getSenha());
        if (clinica != null) {
            return ResponseEntity.ok().body("Login bem-sucedido");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha incorretos");
        }
    }

}


