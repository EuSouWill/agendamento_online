package br.com.agendamentosonline.agendamento.controller;

import br.com.agendamentosonline.agendamento.model.Agendamento;
import br.com.agendamentosonline.agendamento.service.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:63342") // Permite apenas essa origem
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    // Endpoint para criar um novo agendamento
    @PostMapping
    public ResponseEntity<Agendamento> criarAgendamento(@RequestBody Agendamento agendamento) {
        Agendamento novoAgendamento = agendamentoService.salvarAgendamento(agendamento);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoAgendamento);
    }

    // Endpoint para listar todos os agendamentos
    @GetMapping
    public ResponseEntity<List<Agendamento>> listarTodos() {
        List<Agendamento> agendamentos = agendamentoService.listarTodos();
        return ResponseEntity.ok(agendamentos);
    }

    // Endpoint para buscar um agendamento pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<Agendamento> buscarPorId(@PathVariable Long id) {
        Optional<Agendamento> agendamento = agendamentoService.buscarPorId(id);
        return agendamento.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Endpoint para deletar um agendamento pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPorId(@PathVariable Long id) {
        agendamentoService.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para atualizar o status de um agendamento
    @PutMapping("/{id}/status")
    public ResponseEntity<Agendamento> atualizarStatus(@PathVariable Long id, @RequestBody Map<String, String> statusRequest) {
        String novoStatus = statusRequest.get("status");
        Agendamento agendamentoAtualizado = agendamentoService.atualizarStatus(id, novoStatus);
        return ResponseEntity.ok(agendamentoAtualizado);
    }

    // Endpoint para listar agendamentos com filtro por período e status
    @GetMapping("/filtro")
    public ResponseEntity<?> filtrarAgendamentos(
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String profissional,
            @RequestParam(required = false) String nomePaciente) {

        try {
            // Converter as Strings para LocalDate, se forem fornecidas
            LocalDate dataInicioParsed = (dataInicio != null && !dataInicio.isEmpty()) ? LocalDate.parse(dataInicio) : null;
            LocalDate dataFimParsed = (dataFim != null && !dataFim.isEmpty()) ? LocalDate.parse(dataFim) : null;

            // Chamar o serviço com os valores convertidos
            List<Agendamento> agendamentos = agendamentoService.filtrarAgendamentos(
                    dataInicioParsed, dataFimParsed, status, profissional, nomePaciente);
            return ResponseEntity.ok(agendamentos);

        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Formato de data inválido.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao filtrar agendamentos.");
        }
    }

}