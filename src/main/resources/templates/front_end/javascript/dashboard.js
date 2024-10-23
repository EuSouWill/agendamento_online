document.addEventListener('DOMContentLoaded', function () {
    const profissionaisDropdown = document.getElementById('profissionaisDropdown');
    const agendamentosPendentesDiv = document.getElementById('agendamentosPendentes');
    const agendamentosProcessadosDiv = document.getElementById('agendamentosProcessados');
    const dataInicioInput = document.getElementById('dataInicio');
    const dataFimInput = document.getElementById('dataFim');
    const statusSelect = document.getElementById('statusSelect');
    const buscarAgendamentosBtn = document.getElementById('buscarAgendamentos');

    let agendamentos = [];  // Array para armazenar todos os agendamentos

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
            .then(data => {
                agendamentos = data;  // Atualiza a lista de agendamentos
                exibirAgendamentosPendentes();
                exibirAgendamentosProcessados();  // Exibe os processados ao carregar a lista
            })
            .catch(error => console.error('Erro ao carregar agendamentos:', error));
    }

    // Exibir agendamentos pendentes
    function exibirAgendamentosPendentes() {
        agendamentosPendentesDiv.innerHTML = ''; // Limpa os agendamentos anteriores
        const agendamentosPendentes = agendamentos.filter(agendamento => agendamento.status === 'Pendente');

        agendamentosPendentes.forEach(agendamento => {
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
    }

    // Exibir agendamentos processados
    function exibirAgendamentosProcessados() {
        agendamentosProcessadosDiv.innerHTML = ''; // Limpa os agendamentos anteriores
        const agendamentosProcessados = agendamentos.filter(agendamento =>
            agendamento.status === 'Confirmado' || agendamento.status === 'Cancelado' || agendamento.status === 'Reagendado'
        );

        agendamentosProcessados.forEach(agendamento => {
            const div = document.createElement('div');
            div.classList.add('agendamento');
            div.dataset.id = agendamento.id;
            div.innerHTML = `
                <p>Paciente: ${agendamento.nomePaciente}</p>
                <p>Data: ${agendamento.data}</p>
                <p>Hora: ${agendamento.hora}</p>
                <p>Status: ${agendamento.status}</p>
            `;
            agendamentosProcessadosDiv.appendChild(div);
        });
    }

    // Alterar status de um agendamento
    function alterarStatusAgendamento(agendamentoId, novoStatus, div) {
        fetch(`http://localhost:8080/api/agendamentos/${agendamentoId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: novoStatus })  // Envia o status em formato JSON
        })
        .then(response => {
            if (response.ok) {
                // Mover para a fila de processados
                moverParaProcessados(div);
                // Exibir mensagem de sucesso
                exibirMensagem(`Status alterado para ${novoStatus} com sucesso!`);

                // Atualizar a lista de agendamentos pendentes
                carregarAgendamentos(profissionaisDropdown.value);
            } else {
                return response.json().then(err => {
                    console.error('Erro ao alterar o status:', err);
                    alert('Erro ao alterar o status. Verifique o servidor.');
                });
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

    // Lógica para o filtro de agendamentos
    buscarAgendamentosBtn.addEventListener('click', function () {
        const dataInicio = dataInicioInput.value;
        const dataFim = dataFimInput.value;
        const status = statusSelect.value;

        fetch(`http://localhost:8080/api/agendamentos/filtrar?dataInicio=${dataInicio}&dataFim=${dataFim}&status=${status}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(err => {
                        console.error('Erro ao buscar agendamentos:', err);
                        alert('Erro ao buscar agendamentos.');
                    });
                }
            })
            .then(data => {
                agendamentos = data;  // Atualiza os agendamentos com base na busca
                exibirAgendamentosPendentes();  // Atualiza os pendentes
                exibirAgendamentosProcessados();  // Atualiza os processados
            })
            .catch(error => console.error('Erro ao buscar agendamentos:', error));
    });
});
