package br.com.agendamentosonline.agendamento.controller;

import br.com.agendamentosonline.agendamento.model.Disponibilidade;
import br.com.agendamentosonline.agendamento.model.Profissional;
import br.com.agendamentosonline.agendamento.service.DisponibilidadeService;
import br.com.agendamentosonline.agendamento.service.ProfissionalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/disponibilidades")
public class DisponibilidadeController {

    @Autowired
    private DisponibilidadeService disponibilidadeService;

    @Autowired
    private ProfissionalService profissionalService;

    @PostMapping
    public ResponseEntity<Disponibilidade> criarDisponibilidade(
            @RequestParam Long profissionalId,
            @RequestParam DayOfWeek diaSemana,
            @RequestParam String horaInicio,
            @RequestParam String horaFim
    ) {
        Profissional profissional = profissionalService.buscarPorId(profissionalId)
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));

        LocalTime inicio = LocalTime.parse(horaInicio);
        LocalTime fim = LocalTime.parse(horaFim);

        Disponibilidade disponibilidade = new Disponibilidade();
        disponibilidade.setProfissional(profissional);
        disponibilidade.setDiaSemana(diaSemana);
        disponibilidade.setHoraInicio(inicio);
        disponibilidade.setHoraFim(fim);

        Disponibilidade novaDisponibilidade = disponibilidadeService.salvar(disponibilidade);
        return ResponseEntity.ok(novaDisponibilidade);
    }
}
