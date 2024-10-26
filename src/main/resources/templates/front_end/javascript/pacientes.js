// URLs das APIs
const profissionaisApiUrl = "http://localhost:8080/api/profissionais";
const pacientesApiUrl = "http://localhost:8080/api/pacientes";
const agendamentosApiUrl = "http://localhost:8080/api/agendamentos";

// Elementos do DOM
const tabelaPacientes = document.getElementById('tabelaPacientes').querySelector('tbody');
const searchInput = document.getElementById('searchPaciente');
const buscarBtn = document.getElementById('buscarBtn');
const exportarPdfBtn = document.getElementById('exportarPdfBtn');
const agendamentoForm = document.getElementById('agendamentoForm');
const profissionalSelect = document.getElementById('profissional');




// Função para carregar os pacientes da API e filtrar com base na busca
function carregarPacientes(query = '') {
    const url = query ? `${pacientesApiUrl}?filtro=${query}` : pacientesApiUrl;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            tabelaPacientes.innerHTML = ''; // Limpa a tabela de pacientes antes de exibir

            // Filtra e exibe apenas os pacientes correspondentes ao critério de busca
            data
                .filter(paciente =>
                    paciente.nome.toLowerCase().includes(query.toLowerCase()) ||
                    paciente.cpf.includes(query) ||
                    paciente.telefone.includes(query) ||
                    paciente.email.toLowerCase().includes(query.toLowerCase())
                )
                .forEach(paciente => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${paciente.nome}</td>
                        <td>${paciente.telefone}</td>
                        <td>${paciente.email}</td>
                        <td>${paciente.cpf}</td>
                        <td class="actions">
                            <button class="whatsapp" onclick="contatoWhatsApp('${paciente.telefone}', '${paciente.nome}')">WhatsApp</button>
                            <button class="edit" onclick="editarPaciente(${paciente.id})">Editar</button>
                            <button class="delete" onclick="excluirPaciente(${paciente.id})">Excluir</button>
                        </td>
                    `;
                    tabelaPacientes.appendChild(row);
                });
        })
        .catch(error => console.error('Erro ao carregar pacientes:', error));
}

// Adiciona o evento de busca ao botão de busca e ao input de busca
buscarBtn.addEventListener('click', function () {
    carregarPacientes(searchInput.value.trim());
});

searchInput.addEventListener('input', function () {
    carregarPacientes(searchInput.value.trim());
});


// Função para contato via WhatsApp
window.contatoWhatsApp = function (telefone, nomePaciente) {
    const mensagem = `Olá, ${nomePaciente}, como você está? Gostaríamos de agendar um retorno para acompanhamento odontológico.`;
    const urlWhatsApp = `https://api.whatsapp.com/send/?phone=55${telefone}&text=${encodeURIComponent(mensagem)}&type=phone_number&app_absent=0`;
    window.open(urlWhatsApp, '_blank');
};

// Função para editar paciente
// Função para editar paciente
window.editarPaciente = function (id) {
    // Faz uma solicitação para obter os dados do paciente pelo ID
    fetch(`${pacientesApiUrl}/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao obter dados do paciente.');
            return response.json();
        })
        .then(paciente => {
            // Exibe um formulário de edição com os dados do paciente preenchidos
            const formEdicaoPaciente = document.createElement('form');
            formEdicaoPaciente.id = 'formEdicaoPaciente';
            formEdicaoPaciente.innerHTML = `
                <h3>Editar Paciente</h3>
                <label>Nome:</label>
                <input type="text" id="editNome" value="${paciente.nome}" required>
                <label>CPF:</label>
                <input type="text" id="editCpf" value="${paciente.cpf}" required>
                <label>E-mail:</label>
                <input type="email" id="editEmail" value="${paciente.email}" required>
                <label>Telefone:</label>
                <input type="text" id="editTelefone" value="${paciente.telefone}" required>
                <button type="submit">Salvar Alterações</button>
                <button type="button" onclick="document.getElementById('formEdicaoPaciente').remove();">Cancelar</button>
            `;

            // Exibe o formulário na página
            document.body.appendChild(formEdicaoPaciente);

            // Adiciona evento de envio para atualizar o paciente
            formEdicaoPaciente.addEventListener('submit', function (event) {
                event.preventDefault();

                const updatedPacienteData = {
                    nome: document.getElementById('editNome').value,
                    cpf: document.getElementById('editCpf').value,
                    email: document.getElementById('editEmail').value,
                    telefone: document.getElementById('editTelefone').value
                };

                // Faz uma requisição PUT para atualizar o paciente no backend
                fetch(`${pacientesApiUrl}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedPacienteData)
                })
                .then(response => {
                    if (!response.ok) throw new Error('Erro ao atualizar o paciente.');
                    return response.json();
                })
                .then(() => {
                    alert('Paciente atualizado com sucesso!');
                    carregarPacientes(); // Atualiza a lista de pacientes na tela
                    formEdicaoPaciente.remove(); // Remove o formulário de edição
                })
                .catch(error => console.error('Erro ao atualizar paciente:', error));
            });
        })
        .catch(error => console.error('Erro ao obter dados do paciente:', error));
};


// Função para excluir paciente
window.excluirPaciente = function (id) {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
        fetch(`${pacientesApiUrl}/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    carregarPacientes();
                    alert('Paciente excluído com sucesso!');
                } else {
                    alert('Erro ao excluir o paciente.');
                }
            })
            .catch(error => console.error('Erro ao excluir paciente:', error));
    }
};

// Função para exportar a tabela de pacientes para PDF
exportarPdfBtn.addEventListener('click', function () {
    const { jsPDF } = window.jspdf; // Obtém a classe jsPDF do módulo importado

    const doc = new jsPDF();
    doc.text('Lista de Pacientes', 14, 10);

    // Captura os dados das linhas da tabela
    const rows = [...tabelaPacientes.rows].map(row =>
        [...row.cells].map(cell => cell.innerText)
    );

    // Adiciona a tabela ao PDF
    doc.autoTable({
        head: [['Nome', 'Telefone', 'E-mail', 'CPF']],
        body: rows,
    });

    doc.save('pacientes.pdf');
});


// Função para criação de um novo paciente
formNovoPaciente.addEventListener('submit', function (event) {
    event.preventDefault();

    const novoPacienteData = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
    };

    fetch("http://localhost:8080/api/pacientes", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoPacienteData),
    })
    .then(response => {
        if (response.ok) {
            alert('Paciente cadastrado com sucesso!');
            formNovoPaciente.reset();
            novoPacienteForm.style.display = 'none';
            carregarPacientes(); // Recarrega a lista de pacientes
        } else {
            alert('Erro ao cadastrar paciente.');
        }
    })
    .catch(error => console.error('Erro ao cadastrar paciente:', error));
});
// Adiciona o evento de busca ao campo de entrada e ao botão de busca
searchInput.addEventListener('input', function () {
    carregarPacientes(searchInput.value.trim());
});

buscarBtn.addEventListener('click', function () {
    carregarPacientes(searchInput.value.trim());
});

// Função para exibir o formulário de novo paciente
document.getElementById('novoPacienteBtn').addEventListener('click', function () {
    formNovoPaciente.reset();
    novoPacienteForm.style.display = 'block';
});

// Função para criação de um novo paciente com verificação de CPF duplicado
formNovoPaciente.addEventListener('submit', function (event) {
    event.preventDefault();

    const novoPacienteData = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
    };

    // Verifica se o CPF já existe antes de criar o paciente
    fetch(`http://localhost:8080/api/pacientes?cpf=${novoPacienteData.cpf}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {  // Verifica se algum paciente com o mesmo CPF foi encontrado
                alert("Erro: Já existe um paciente cadastrado com esse CPF.");
            } else {
                // Caso o CPF seja único, faz a criação do paciente
                return fetch("http://localhost:8080/api/pacientes", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoPacienteData),
                })
                .then(response => {
                    if (response.ok) {
                        alert('Paciente cadastrado com sucesso!');
                        formNovoPaciente.reset();
                        novoPacienteForm.style.display = 'none'; // Oculta o formulário após o cadastro
                        carregarPacientes(); // Recarrega a lista de pacientes
                    } else {
                        alert('Erro ao cadastrar paciente.');
                    }
                });
            }
        })
        .catch(error => console.error('Erro ao verificar CPF:', error));
});

// Ocultar formulário ao clicar em "Cancelar"
document.getElementById('cancelarNovoPaciente').addEventListener('click', function () {
    novoPacienteForm.style.display = 'none';
});


