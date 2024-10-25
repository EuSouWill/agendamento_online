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
    const url = `http://localhost:8080/api/agendamentos/filtro?dataInicio=${encodeURIComponent(dataInicio)}&dataFim=${encodeURIComponent(dataFim)}&status=${encodeURIComponent(status)}`;


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

   // Função para carregar agendamentos por profissional (pelo nome do profissional)
   function carregarAgendamentosPorProfissional(profissionalId) {
       const profissionalNome = profissionaisDropdown.options[profissionaisDropdown.selectedIndex].textContent.split(' - ')[0];
       const nomeFormatado = encodeURIComponent(profissionalNome); // Formata o nome para URL

       fetch(`http://localhost:8080/api/agendamentos/filtro?profissional=${nomeFormatado}`)
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
                <button class="alterarStatus">Alterar Status</button>
            `;
            div.querySelector('.alterarStatus').addEventListener('click', function () {
                const novoStatus = div.querySelector('.statusAgendamento').value;
                alterarStatusAgendamento(agendamento.id, novoStatus);
            });
            agendamentosPendentesDiv.appendChild(div);
        });
    }

     // Exibir agendamentos processados
        function exibirAgendamentosProcessados() {
            agendamentosProcessadosDiv.innerHTML = '';
            const agendamentosProcessados = agendamentos.filter(agendamento =>
                ['Confirmado', 'Cancelado', 'Reagendado'].includes(agendamento.status)
            );
            agendamentosProcessados.forEach(agendamento => {
                const div = document.createElement('div');
                div.classList.add('agendamento', agendamento.status.toLowerCase());
                div.innerHTML = `
                    <p>Paciente: ${agendamento.nomePaciente}</p>
                    <p>Profissional: ${agendamento.profissional}</p>
                    <p>Data: ${agendamento.data}</p>
                    <p>Hora: ${agendamento.hora}</p>
                    <select class="statusAgendamento">
                        <option value="Confirmado" ${agendamento.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                        <option value="Cancelado" ${agendamento.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                        <option value="Reagendado" ${agendamento.status === 'Reagendado' ? 'selected' : ''}>Reagendado</option>
                    </select>
                    <button class="alterarStatus">Alterar Status</button>
                `;
                div.querySelector('.alterarStatus').addEventListener('click', function () {
                    const novoStatus = div.querySelector('.statusAgendamento').value;
                    alterarStatusAgendamento(agendamento.id, novoStatus);
                });
                agendamentosProcessadosDiv.appendChild(div);
            });
        }

    // Função para alterar o status do agendamento
    function alterarStatusAgendamento(agendamentoId, novoStatus) {
        fetch(`http://localhost:8080/api/agendamentos/${agendamentoId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: novoStatus }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Status alterado com sucesso:', data);
                // Atualizar os agendamentos após alteração de status
                carregarAgendamentosPorProfissional(profissionaisDropdown.value);
            })
            .catch(error => console.error('Erro ao alterar status:', error));
    }

    buscarAgendamentosBtn.addEventListener('click', function () {
        const dataInicio = dataInicioInput.value;
        const dataFim = dataFimInput.value;
        const status = statusSelect.value;

        // Monta a URL de filtro com parâmetros preenchidos
        let url = `http://localhost:8080/api/agendamentos/filtro`;
        const params = [];

        if (dataInicio) params.push(`dataInicio=${encodeURIComponent(dataInicio)}`);
        if (dataFim) params.push(`dataFim=${encodeURIComponent(dataFim)}`);
        if (status) params.push(`status=${encodeURIComponent(status)}`);

        // Adiciona parâmetros à URL
        if (params.length > 0) url += `?${params.join('&')}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const tbody = resultadosBuscaTabela.querySelector('tbody');
                tbody.innerHTML = '';
                if (data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5">Nenhum agendamento encontrado.</td></tr>';
                } else {
                    data.forEach(agendamento => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${agendamento.nomePaciente}</td>
                            <td>${agendamento.data}</td>
                            <td>${agendamento.hora}</td>
                            <td>${agendamento.profissional}</td>
                            <td>${agendamento.status}</td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            })
            .catch(error => console.error('Erro ao buscar agendamentos:', error));
    });

});
