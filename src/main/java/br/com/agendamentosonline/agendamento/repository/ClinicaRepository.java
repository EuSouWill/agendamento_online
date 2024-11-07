package br.com.agendamentosonline.agendamento.repository;

import br.com.agendamentosonline.agendamento.model.Clinica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClinicaRepository extends JpaRepository<Clinica, Long> {
    Clinica findByEmailAndSenha(String email, String senha);

}
