package br.com.agendamentosonline.agendamento.service;

import br.com.agendamentosonline.agendamento.model.Agendamento;
import br.com.agendamentosonline.agendamento.model.Disponibilidade;
import br.com.agendamentosonline.agendamento.model.Profissional;
import br.com.agendamentosonline.agendamento.repository.DisponibilidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Service
public class DisponibilidadeService {

    @Autowired
    private DisponibilidadeRepository disponibilidadeRepository;

    // Método para verificar a disponibilidade de um profissional em um horário específico
    public boolean verificarDisponibilidade(Profissional profissional, DayOfWeek diaSemana, LocalTime hora) {
        List<Disponibilidade> disponibilidades = disponibilidadeRepository.findByProfissionalAndDiaSemana(profissional, diaSemana);
        for (Disponibilidade disponibilidade : disponibilidades) {
            if (disponibilidade.isDisponivel(hora)) {
                return true;
            }
        }
        return false;
    }

    // Método para validar um agendamento com base na disponibilidade do profissional
    public String validarAgendamento(Agendamento agendamento, Profissional profissional) {
        if (!profissional.isDentista()) {
            return "Apenas dentistas estão disponíveis para agendamento.";
        }

        DayOfWeek diaSemana = agendamento.getData().getDayOfWeek();
        LocalTime hora = LocalTime.parse(agendamento.getHora());

        if (verificarDisponibilidade(profissional, diaSemana, hora)) {
            return null; // Horário disponível
        } else {
            return "O profissional não está disponível neste horário. Por favor, escolha outro horário.";
        }
    }

    // Novo método para salvar a disponibilidade de um profissional
    public Disponibilidade salvar(Disponibilidade disponibilidade) {
        return disponibilidadeRepository.save(disponibilidade);
    }
}
