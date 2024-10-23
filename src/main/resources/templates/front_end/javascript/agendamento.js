// URL das APIs
const profissionaisApiUrl = "http://localhost:8080/api/profissionais";
const pacientesApiUrl = "http://localhost:8080/api/pacientes";
const agendamentosApiUrl = "http://localhost:8080/api/agendamentos";

// Elementos do DOM
const agendamentoForm = document.getElementById('agendamentoForm');
const profissionalSelect = document.getElementById('profissional');

// Função para carregar profissionais disponíveis
function carregarProfissionais() {
    fetch(profissionaisApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar profissionais.');
            }
            return response.json();
        })
        .then(profissionais => {
            profissionais.forEach(profissional => {
                const option = document.createElement('option');
                option.value = profissional.nome;
                option.textContent = profissional.nome;
                profissionalSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar profissionais:', error));
}

// Função para enviar os dados do paciente e criar um agendamento
agendamentoForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const pacienteData = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value
    };

    const agendamentoData = {
        data: document.getElementById('data').value,
        hora: document.getElementById('hora').value,
        nomePaciente: pacienteData.nome,
        profissional: document.getElementById('profissional').value,
        status: "Pendente"
    };

    // Enviar dados do paciente para a API de pacientes
    fetch(pacientesApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pacienteData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar paciente.');
        }
        return response.json();
    })
    .then(() => {
        // Após cadastrar o paciente, enviar o agendamento para a API de agendamentos
        fetch(agendamentosApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(agendamentoData)
        })
        .then(response => {
            if (response.ok) {
                alert('Consulta agendada com sucesso!');
                agendamentoForm.reset();
            } else {
                throw new Error('Erro ao agendar consulta.');
            }
        })
        .catch(error => console.error('Erro ao agendar consulta:', error));
    })
    .catch(error => console.error('Erro ao cadastrar paciente:', error));
});

// Carregar profissionais no carregamento da página
window.onload = carregarProfissionais;
