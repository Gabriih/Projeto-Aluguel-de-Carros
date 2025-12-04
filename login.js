document.addEventListener('DOMContentLoaded', function() {
    // 1. Tenta achar o formulário com segurança
    const formLogin = document.getElementById('login-form');

    // Se o formulário não existir, avisa no console e PARA o script (evita crash)
    if (!formLogin) {
        console.error("ERRO CRÍTICO: Não encontrei o <form id='login-form'> no HTML!");
        return;
    }

    // 2. Agora sim, adiciona o evento
    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault(); // O FREIO DE MÃO: Impede a página de recarregar
        
        console.log("Freio de mão acionado! JS assumiu o controle.");

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        try {
            const response = await fetch('login.php', {
                method: 'POST',
                body: JSON.stringify({ email, senha })
            });

            const resultado = await response.json();
            console.log("Resposta do PHP:", resultado);

            if (resultado.sucesso) {
                // Salvando...
                localStorage.setItem('usuario_id', resultado.id);
                localStorage.setItem('usuario_nome', resultado.nome);
                
                alert('Login Sucesso! ID salvo: ' + resultado.id);
                window.location.href = 'minha_conta.html';
            } else {
                alert("Erro: " + resultado.erro);
            }

        } catch (erro) {
            console.error("Erro no JS:", erro);
        }
    });
});