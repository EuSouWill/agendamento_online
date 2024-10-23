document.addEventListener('DOMContentLoaded', function () {
    const profissionaisDropdown = document.getElementById('profissionaisDropdown');
    const agendamentosPendentesDiv = document.getElementById('agendamentosPendentes');
    const agendamentosProcessadosDiv = document.getElementById('agendamentosProcessados');

    // Carregar lista de profissionais
    fetch('http://localhost:8080/api/profissionais')
        .then(response => response.json())
        .then(profissionais => {
            profissionais.forEach(profissional => {
                const option = document.createElement('option');
                option.value = profissional.id;
                option.textContent = `${profissional.nome} - ${profissional.especialidade}`;
                profissionaisDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar profissionais:', error));

    // Ver agendamentos de um profissional específico
    document.getElementById('verAgendamentosProfissional').addEventListener('click', () => {
        const profissionalId = profissionaisDropdown.value;
        if (profissionalId) {
            carregarAgendamentos(profissionalId);
        } else {
            alert('Selecione um profissional');
        }
    });

    // Carregar agendamentos pendentes
    function carregarAgendamentos(profissionalId) {
        fetch(`http://localhost:8080/api/agendamentos?profissionalId=${profissionalId}`)
            .then(response => response.json())
            .then(agendamentos => {
                agendamentosPendentesDiv.innerHTML = ''; // Limpa os agendamentos anteriores
                agendamentos.forEach(agendamento => {
                    const div = document.createElement('div');
                    div.classList.add('agendamento');
                    div.dataset.id = agendamento.id;
                    div.innerHTML = `
                        <p>Paciente: ${agendamento.nomePaciente}</p>
                        <p>Data: ${agendamento.data}</p>
                        <p>Hora: ${agendamento.hora}</p>
                        <select class="statusAgendamento">
                            <option value="Pendente">Pendente</option>
                            <option value="Confirmado">Confirmado</option>
                            <option value="Cancelado">Cancelado</option>
                            <option value="Reagendado">Reagendado</option>
                        </select>
                        <button class="alterarStatus">Alterar Status</button>
                    `;
                    agendamentosPendentesDiv.appendChild(div);

                    // Configura a cor do status inicial
                    alterarCorStatus(div.querySelector('.statusAgendamento'));

                    // Adiciona evento de alterar status
                    div.querySelector('.alterarStatus').addEventListener('click', function () {
                        const novoStatus = div.querySelector('.statusAgendamento').value;
                        alterarStatusAgendamento(agendamento.id, novoStatus, div);
                    });

                    // Adiciona evento de mudança de cor
                    div.querySelector('.statusAgendamento').addEventListener('change', function () {
                        alterarCorStatus(this);
                    });
                });
            })
            .catch(error => console.error('Erro ao carregar agendamentos:', error));
    }

    // Alterar status de um agendamento
    function alterarStatusAgendamento(agendamentoId, novoStatus, div) {
        fetch(`http://localhost:8080/api/agendamentos/${agendamentoId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: novoStatus })
        })
            .then(response => {
                if (response.ok) {
                    // Mover para a fila de processados
                    moverParaProcessados(div);
                    // Exibir mensagem de sucesso
                    exibirMensagem(`Status alterado para ${novoStatus} com sucesso!`);
                } else {
                    alert('Erro ao alterar o status');
                }
            })
            .catch(error => console.error('Erro ao alterar status:', error));
    }

    // Mover agendamento para a fila de processados
    function moverParaProcessados(div) {
        agendamentosPendentesDiv.removeChild(div);
        agendamentosProcessadosDiv.appendChild(div);
        div.querySelector('.alterarStatus').remove(); // Remove o botão de alterar status após processado
    }

    // Alterar a cor do status
    function alterarCorStatus(selectElement) {
        const status = selectElement.value;
        switch (status) {
            case 'Confirmado':
                selectElement.style.backgroundColor = 'lightgreen';
                break;
            case 'Cancelado':
                selectElement.style.backgroundColor = 'lightcoral';
                break;
            case 'Reagendado':
                selectElement.style.backgroundColor = 'lightblue';
                break;
            default:
                selectElement.style.backgroundColor = 'lightyellow';
        }
    }

    // Exibir mensagem de sucesso
    function exibirMensagem(mensagem) {
        const mensagemDiv = document.createElement('div');
        mensagemDiv.classList.add('mensagem-sucesso');
        mensagemDiv.textContent = mensagem;
        document.body.appendChild(mensagemDiv);

        // Remover a mensagem após 3 segundos
        setTimeout(() => {
            document.body.removeChild(mensagemDiv);
        }, 3000);
    }
});
