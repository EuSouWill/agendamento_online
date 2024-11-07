package br.com.agendamentosonline.agendamento.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String senha;
}
