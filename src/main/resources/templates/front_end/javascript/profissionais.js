document.getElementById("form-profissional").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const permissao = document.getElementById("permissao").value;
    const cro = document.getElementById("cro").value;
    const especialidade = document.getElementById("especialidade").value;
    const senha = document.getElementById("senha").value;

    console.log("Dados do Profissional:");
    console.log("Nome:", nome);
    console.log("CPF:", cpf);
    console.log("Email:", email);
    console.log("Telefone:", telefone);
    console.log("Permissão:", permissao);
    console.log("CRO:", cro);
    console.log("Especialidade:", especialidade);
    console.log("Senha:", senha);

    const profissional = {
        nome,
        cpf,
        email,
        telefone,
        permissao,
        cro,
        especialidade,
        senha
    };

    try {
        const response = await fetch("https://simplesagendamento.onrender.com/api/profissionais", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profissional)
        });

        if (response.ok) {
            alert("Profissional cadastrado com sucesso!");
            document.getElementById("form-profissional").reset();
        } else {
            const errorData = await response.json();
            alert("Erro ao cadastrar profissional: " + errorData.message);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao cadastrar profissional. Tente novamente.");
    }
});
