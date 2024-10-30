document.getElementById('login-btn').addEventListener('click', async function () {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch(`https://simplesagendamento.onrender.com/api/profissionais`);

        if (!response.ok) {
            throw new Error("Erro ao acessar a API");
        }

        const profissionais = await response.json();
        const profissional = profissionais.find(p => p.email === email && p.senha === senha);

        if (!profissional) {
            throw new Error("Profissional não encontrado ou credenciais inválidas");
        }

        document.getElementById('profissional-id').value = profissional.id; // Armazena o ID do profissional
        alert("Profissional carregado com sucesso!");

        document.getElementById('login-section').style.display = 'none'; // Esconde a seção de login
        document.getElementById('availability-section').style.display = 'block'; // Mostra a seção de disponibilidade

        await carregarDisponibilidades(profissional.id); // Carregar as disponibilidades existentes
    } catch (error) {
        console.error("Erro ao carregar profissional:", error);
        alert(error.message);
    }
});

document.getElementById('form-disponibilidade').addEventListener('submit', async function (event) {
    event.preventDefault();

    const profissionalId = document.getElementById('profissional-id').value;
    const diasSemana = Array.from(document.querySelectorAll('input[name="diaSemana"]:checked')).map(el => el.value);
    const horaInicio = document.getElementById('hora-inicio').value;
    const horaFim = document.getElementById('hora-fim').value;

    try {
        for (let diaSemana of diasSemana) {
            const response = await fetch(`https://simplesagendamento.onrender.com/api/disponibilidades?profissionalId=${profissionalId}&diaSemana=${diaSemana}&horaInicio=${horaInicio}&horaFim=${horaFim}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao adicionar disponibilidade");
            }

            const data = await response.json();
            console.log("Disponibilidade adicionada:", data);
        }

        alert("Disponibilidades adicionadas com sucesso!");
        await carregarDisponibilidades(profissionalId); // Atualiza a lista de disponibilidades
    } catch (error) {
        console.error("Erro ao salvar disponibilidades:", error);
        alert(error.message);
    }
});

async function carregarDisponibilidades(profissionalId) {
    try {
        const response = await fetch(`https://simplesagendamento.onrender.com/api/disponibilidades?profissionalId=${profissionalId}`);

        if (!response.ok) {
            throw new Error("Erro ao acessar as disponibilidades");
        }

        const disponibilidades = await response.json();

        const lista = document.getElementById('lista-disponibilidades');
        lista.innerHTML = '';

        disponibilidades.forEach(disponibilidade => {
            const item = document.createElement('li');
            item.textContent = `${disponibilidade.diaSemana} - ${disponibilidade.horaInicio} até ${disponibilidade.horaFim}`;
            lista.appendChild(item);
        });
    } catch (error) {
        console.error("Erro ao carregar disponibilidades:", error);
    }
}
