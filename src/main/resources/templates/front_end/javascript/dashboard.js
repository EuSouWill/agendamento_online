document.addEventListener('DOMContentLoaded', function () {
    const profissionaisDropdown = document.getElementById('profissionaisDropdown');
    const agendamentosPendentesDiv = document.getElementById('agendamentosPendentes');
    const agendamentosProcessadosDiv = document.getElementById('agendamentosProcessados');
    const dataInicioInput = document.getElementById('dataInicio');
    const dataFimInput = document.getElementById('dataFim');
    const statusSelect = document.getElementById('statusFiltro');
    const buscarAgendamentosBtn = document.getElementById('filtroAgendamentos');
    const resultadosBuscaTabela = document.getElementById('resultadosBusca');
    const mensagemSemAgendamentos = document.getElementById('mensagemSemAgendamentos');

    let agendamentos = [];

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

    // Função para limpar divs ao selecionar novo profissional
    function limparAgendamentos() {
        agendamentosPendentesDiv.innerHTML = '';
        agendamentosProcessadosDiv.innerHTML = '';
        resultadosBuscaTabela.innerHTML = '';
    }

    // Carregar agendamentos por profissional ao selecionar no dropdown
    profissionaisDropdown.addEventListener('change', function () {
        const profissionalId = this.value;
        if (profissionalId) {
            limparAgendamentos(); // Limpar os agendamentos anteriores
            carregarAgendamentosPorProfissional(profissionalId); // Carregar novos agendamentos
        }
    });

    // Função para carregar agendamentos por profissional
    function carregarAgendamentosPorProfissional(profissionalId) {
        fetch(`http://localhost:8080/api/agendamentos?profissionalId=${profissionalId}`)
            .then(response => response.json())
            .then(data => {
                agendamentos = data;
                if (agendamentos.length === 0) {
                    mensagemSemAgendamentos.style.display = 'block';
                } else {
                    mensagemSemAgendamentos.style.display = 'none';
                    exibirAgendamentosPendentes();
                    exibirAgendamentosProcessados();
                }
            })
            .catch(error => console.error('Erro ao carregar agendamentos:', error));
    }

    // Exibir agendamentos pendentes
    function exibirAgendamentosPendentes() {
        agendamentosPendentesDiv.innerHTML = '';
        const agendamentosPendentes = agendamentos.filter(agendamento => agendamento.status === 'Pendente');
        agendamentosPendentes.forEach(agendamento => {
            const div = document.createElement('div');
            div.classList.add('agendamento', 'pendente');
            div.innerHTML = `
                <p>Paciente: ${agendamento.nomePaciente}</p>
                <p>Profissional: ${agendamento.profissional}</p>
                <p>Data: ${agendamento.data}</p>
                <p>Hora: ${agendamento.hora}</p>
                <select class="statusAgendamento">
                    <option value="Pendente" ${agendamento.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                    <option value="Confirmado" ${agendamento.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                    <option value="Cancelado" ${agendamento.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                    <option value="Reagendado" ${agendamento.status === 'Reagendado' ? 'selected' : ''}>Reagendado</option>
                </select>
                <button class="alterarStatus" data-id="${agendamento.id}">Alterar Status</button>
            `;
            agendamentosPendentesDiv.appendChild(div);
        });

        document.querySelectorAll('.alterarStatus').forEach(button => {
            button.addEventListener('click', function () {
                const agendamentoId = this.getAttribute('data-id');
                const novoStatus = this.previousElementSibling.value;
                alterarStatusAgendamento(agendamentoId, novoStatus);
            });
        });
    }

    // Alterar status do agendamento
    function alterarStatusAgendamento(agendamentoId, novoStatus) {
        fetch(`http://localhost:8080/api/agendamentos/${agendamentoId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: novoStatus })
        })
            .then(response => {
                if (response.ok) {
                    alert(`Status atualizado para ${novoStatus}`);
                    carregarAgendamentosPorProfissional(profissionaisDropdown.value);
                } else {
                    alert('Erro ao alterar o status');
                }
            })
            .catch(error => console.error('Erro ao alterar status:', error));
    }

    // Exibir agendamentos processados
    function exibirAgendamentosProcessados() {
        agendamentosProcessadosDiv.innerHTML = '';
        const agendamentosProcessados = agendamentos.filter(agendamento =>
            agendamento.status !== 'Pendente'
        );
        agendamentosProcessados.forEach(agendamento => {
            const div = document.createElement('div');
            div.classList.add('agendamento', agendamento.status.toLowerCase());
            div.innerHTML = `
                <p>Paciente: ${agendamento.nomePaciente}</p>
                <p>Profissional: ${agendamento.profissional}</p>
                <p>Data: ${agendamento.data}</p>
                <p>Hora: ${agendamento.hora}</p>
                <p>Status: ${agendamento.status}</p>
            `;
            agendamentosProcessadosDiv.appendChild(div);
        });
    }

    // Filtro de agendamentos por data e status
    buscarAgendamentosBtn.addEventListener('click', function () {
        const dataInicio = dataInicioInput.value;
        const dataFim = dataFimInput.value;
        const status = statusSelect.value;

        fetch(`http://localhost:8080/api/agendamentos/filtro?dataInicio=${dataInicio}&dataFim=${dataFim}&status=${status}`)
            .then(response => response.json())
            .then(data => {
                exibirResultadosBusca(data);
            })
            .catch(error => console.error('Erro ao buscar agendamentos:', error));
    });

    // Exibir resultados de busca por filtros
    function exibirResultadosBusca(agendamentosFiltrados) {
        resultadosBuscaTabela.innerHTML = '';
        agendamentosFiltrados.forEach(agendamento => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${agendamento.nomePaciente}</td>
                <td>${agendamento.data}</td>
                <td>${agendamento.hora}</td>
                <td>${agendamento.profissional}</td>
                <td>${agendamento.status}</td>
            `;
            resultadosBuscaTabela.appendChild(row);
        });
    }
});
