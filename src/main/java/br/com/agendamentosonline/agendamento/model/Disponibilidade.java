package br.com.agendamentosonline.agendamento.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Data
public class Disponibilidade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "profissional_id", nullable = false)
    @JsonBackReference
    private Profissional profissional;


    private DayOfWeek diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFim;

    public boolean isDisponivel(LocalTime hora) {
        return !hora.isBefore(horaInicio) && !hora.isAfter(horaFim);
    }
}

