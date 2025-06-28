// URL das APIs
//Aqui eu alterno entre api local ou web(em teste utilizo a localhost e em deploy utilizo a web)
const profissionaisApiUrl = "http://localhost:8080/api/profissionais";
//const profissionaisApiUrl =  "https://simplesagendamento.onrender.com/api/profissionais";

const pacientesApiUrl = "http://localhost:8080/api/pacientes";
//const pacientesApiUrl = "https://simplesagendamento.onrender.com/api/pacientes";

const agendamentosApiUrl = "http://localhost:8080/api/agendamentos";
//const agendamentosApiUrl = "https://simplesagendamento.onrender.com/api/agendamentos";



// Elementos do DOM
const agendamentoForm = document.getElementById('agendamentoForm');
const profissionalSelect = document.getElementById('profissional');

// Função para carregar profissionais disponíveis com permissão "DENTISTA"
function carregarProfissionais() {
    fetch(profissionaisApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar profissionais.');
            }
            return response.json();
        })
        .then(profissionais => {
            // Filtrar apenas os profissionais que têm permissão "DENTISTA"
            const dentistas = profissionais.filter(profissional => profissional.permissao === "DENTISTA");

            dentistas.forEach(profissional => {
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
    console.log('Formulário enviado!');

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
        status: "Pendente",
        comoChegouNaClinica: document.getElementById('comoChegouNaClinica').value

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
        return fetch(agendamentosApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(agendamentoData)
        });
    })
    .then(response => {
        if (response.ok) {
            alert('Consulta agendada com sucesso! Aguarde a confirmação.');
            resetForm();
        } else if (response.status === 400) {
            alert('Seu pedido de agendamento foi enviado, aguarde a confirmação da clínica.');
            resetForm();
        } else {
            throw new Error('Erro ao agendar consulta.');
        }
    })
    .catch(error => console.error('Erro:', error));
});

// Função para resetar o formulário e limpar campos manualmente
function resetForm() {
    console.log("Resetando o formulário...");
    agendamentoForm.reset();
    // Reset manual para garantir a limpeza de todos os campos
    document.getElementById('nome').value = '';
    document.getElementById('cpf').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('data').value = '';
    document.getElementById('hora').value = '';
    document.getElementById('profissional').value = '';
}


// Carregar profissionais no carregamento da página
window.onload = carregarProfissionais;

//esse codigo.