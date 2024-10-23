document.addEventListener('DOMContentLoaded', () => {
    const listaAgendamentos = document.getElementById('lista-agendamentos');

    // Carregar agendamentos pendentes
    function carregarAgendamentos() {
        fetch('http://localhost:8080/api/agendamentos')
            .then(response => response.json())
            .then(data => {
                listaAgendamentos.innerHTML = '';
                data.forEach(agendamento => {
                    const li = document.createElement('li');
                    li.textContent = `Paciente: ${agendamento.nome}, Profissional: ${agendamento.profissional.nome}, Data: ${agendamento.data}, Horário: ${agendamento.horario}`;
                    listaAgendamentos.appendChild(li);
                });
            });
    }

    carregarAgendamentos();
});
