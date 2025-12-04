document.addEventListener('DOMContentLoaded', function() {
    // 1. Pega o ID da URL (ex: detalhe_carro.html?id=5)
    const params = new URLSearchParams(window.location.search);
    const idCarro = params.get('id');

    // Validação inicial
    if (!idCarro) {
        alert("Nenhum carro selecionado!");
        window.location.href = "frota.html";
        return;
    }

    // Carrega os dados visuais
    carregarDetalhes(idCarro);

    // 2. CONFIGURA O BOTÃO DE ALUGAR (Aqui estava o erro)
    const btnAlugar = document.getElementById('btn-alugar');
    
    btnAlugar.addEventListener('click', function() {
        // Pega o ID do usuário salvo no navegador
        const idUsuario = localStorage.getItem('usuario_id');

        // Se não tiver ID (não está logado), manda pro login
        if (!idUsuario) {
            alert("Você precisa fazer login para alugar um carro!");
            window.location.href = "login.html";
            return;
        }

        // AGORA SIM: Passa os dois IDs para a função
        console.log("Clicou em alugar! Carro:", idCarro, "Usuario:", idUsuario);
        realizarAluguelNoBanco(idCarro, idUsuario);
    });
});

async function carregarDetalhes(id) {
    try {
        const response = await fetch(`get_carro.php?id=${id}`);
        const carro = await response.json();

        if (carro.erro) {
            alert(carro.erro);
            return;
        }

        document.getElementById('carro-nome').innerText = carro.nome;
        document.getElementById('carro-tipo').innerText = "Categoria: " + carro.tipo;
        document.getElementById('carro-preco').innerText = `R$ ${carro.valor_mensal} / mês`;
        
        const img = document.getElementById('carro-img');
        img.src = carro.foto;
        img.style.display = 'block';

        const statusElem = document.getElementById('carro-status');
        const btnAlugar = document.getElementById('btn-alugar');

        // Atualiza visual baseando-se no status
        if (carro.status === 'disponivel') {
            statusElem.innerText = "Disponível";
            statusElem.className = "status-ok"; // Usa classe do CSS
            statusElem.style.color = "var(--gold-primary)";
            btnAlugar.disabled = false;
            btnAlugar.innerText = "Confirmar Aluguel";
        } else {
            statusElem.innerText = "Indisponível (Alugado)";
            statusElem.className = "status-erro"; // Usa classe do CSS
            statusElem.style.color = "var(--status-erro)";
            
            btnAlugar.innerText = "Veículo Indisponível";
            btnAlugar.disabled = true;
            btnAlugar.style.cursor = "not-allowed";
        }

    } catch (erro) {
        console.error("Erro ao carregar detalhes:", erro);
    }
}

async function realizarAluguelNoBanco(idCarro, idUsuario) {
    // Log para confirmar que os dados chegaram na função
    console.log("Enviando para o PHP...", { usuario_id: idUsuario, carro_id: idCarro });

    try {
        const response = await fetch('alugar.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario_id: idUsuario,
                carro_id: idCarro
            })
        });

        // Pega o texto bruto primeiro para debug
        const textoResposta = await response.text();
        console.log("Resposta do PHP:", textoResposta);

        // Tenta converter para JSON
        const resultado = JSON.parse(textoResposta);

        if (resultado.sucesso) {
            alert("Sucesso! " + resultado.mensagem);
            window.location.href = "minha_conta.html";
        } else {
            alert("Erro ao alugar: " + resultado.erro);
            // Se der erro, recarrega para atualizar o status visual
            location.reload();
        }

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Erro de comunicação com o servidor. Verifique o console.");
    }
}