package br.com.agendamentosonline.agendamento.controller;

import br.com.agendamentosonline.agendamento.model.Profissional;
import br.com.agendamentosonline.agendamento.service.ProfissionalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profissionais")
public class ProfissionalController {

    @Autowired
    private ProfissionalService profissionalService;

    // Endpoint para criar um novo profissional
    @PostMapping
    public ResponseEntity<Profissional> criarProfissional(@RequestBody Profissional profissional) {
        Profissional novoProfissional = profissionalService.salvarProfissional(profissional);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProfissional);
    }

    // Endpoint para listar todos os profissionais
    @GetMapping
    public ResponseEntity<List<Profissional>> listarTodos() {
        List<Profissional> profissionais = profissionalService.listarTodos();
        return ResponseEntity.ok(profissionais);
    }

    // Endpoint para buscar um profissional pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<Profissional> buscarPorId(@PathVariable Long id) {
        Optional<Profissional> profissional = profissionalService.buscarPorId(id);
        return profissional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Endpoint para deletar um profissional pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPorId(@PathVariable Long id) {
        profissionalService.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }
}

