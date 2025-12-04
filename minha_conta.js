document.addEventListener('DOMContentLoaded', function() {
    // 1. Verifica se está logado
    const usuarioId = localStorage.getItem('usuario_id');
    const usuarioNome = localStorage.getItem('usuario_nome');

    if (!usuarioId) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('nome-usuario').innerText = usuarioNome;
    carregarAlugueis(usuarioId);
});

async function carregarAlugueis(id) {
    const response = await fetch(`meus_alugueis.php?id_usuario=${id}`);
    const alugueis = await response.json();

    const divAtivos = document.getElementById('lista-ativos');
    const tbodyHistorico = document.getElementById('lista-historico');

    alugueis.forEach(aluguel => {
        if (aluguel.status === 'ativo') {
            // Renderiza Card de Ativo
            divAtivos.innerHTML += `
                <div class="car-card">
                    <img src="${aluguel.foto}" style="width:100%">
                    <h3>${aluguel.carro_nome}</h3>
                    <p>Alugado em: ${new Date(aluguel.data_inicio).toLocaleDateString()}</p>
                    <button class="cta-button" onclick="devolverCarro(${aluguel.aluguel_id})">Devolver</button>
                </div>
            `;
        } else {
            // Renderiza Linha da Tabela de Histórico
            tbodyHistorico.innerHTML += `
                <tr style="border-bottom: 1px solid #ccc;">
                    <td>${aluguel.carro_nome}</td>
                    <td>${new Date(aluguel.data_inicio).toLocaleDateString()}</td>
                    <td>${new Date(aluguel.data_devolucao).toLocaleDateString()}</td>
                    <td>Concluído</td>
                </tr>
            `;
        }
    });
    
    if (divAtivos.innerHTML === '') divAtivos.innerHTML = '<p>Você não tem carros alugados no momento.</p>';
}

function fazerLogout() {
    // 1. Remove os dados salvos (o "crachá" virtual)
    // .removeItem apaga chaves específicas. .clear() apaga TUDO do seu site.
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('usuario_nome');

    // 2. Redireciona para a tela de login
    window.location.href = 'login.html';
}

// Função para devolver
async function devolverCarro(idAluguel) {
    if (!confirm("Tem certeza que deseja devolver este veículo?")) {
        return; // Se o usuário cancelar, para a função.
    }

    try {
        const response = await fetch('devolver_carro.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ aluguel_id: idAluguel })
        });

        const resultado = await response.json();

        if (resultado.sucesso) {
            alert(resultado.mensagem);
            // Recarrega a página para atualizar as listas (o carro vai sair de "Ativos" para "Histórico")
            location.reload(); 
        } else {
            alert("Erro: " + resultado.erro);
        }

    } catch (erro) {
        console.error(erro);
        alert("Erro de comunicação com o servidor.");
    }
}