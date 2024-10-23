document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('profissional-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const profissional = {
            nome: document.getElementById('nome').value,
            especialidade: document.getElementById('especialidade').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value
        };

        fetch('http://localhost:8080/api/profissionais', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profissional),
        })
        .then(response => {
            if (response.ok) {
                alert('Profissional cadastrado com sucesso!');
                document.getElementById('profissional-form').reset();
            } else {
                alert('Erro ao cadastrar o profissional.');
            }
        })
        .catch(error => {
            console.error('Erro ao cadastrar o profissional:', error);
        });
    });
});
