document.addEventListener('DOMContentLoaded', function() {
    atualizarMenu();
});

function atualizarMenu() {
    const navUl = document.querySelector('header nav ul');
    const usuarioId = localStorage.getItem('usuario_id');

    if (usuarioId) {
        // --- MODO LOGADO ---
        // Se o usuário tem ID, montamos o menu com "Minha Conta" e "Sair"
        navUl.innerHTML = `
            <li><a href="index.html">Início</a></li>
            <li><a href="frota.html">Frota</a></li>
            <li><a href="minha_conta.html">Minha Conta</a></li>
            <li><a href="#" id="btn-logout">Sair</a></li>
        `;

        // Adiciona a funcionalidade ao botão Sair
        document.getElementById('btn-logout').addEventListener('click', function(e) {
            e.preventDefault();
            fazerLogout();
        });

    } else {
        // --- MODO VISITANTE ---
        // Se não tem ID, mostre Cadastro e Entrar
        navUl.innerHTML = `
            <li><a href="index.html">Início</a></li>
            <li><a href="frota.html">Frota</a></li>
            <li><a href="cadastro.html">Cadastro</a></li>
            <li><a href="login.html">Entrar</a></li>
        `;
    }
}

function fazerLogout() {
    // Limpa a memória
    localStorage.clear();
    // Redireciona para a home ou login
    window.location.href = 'login.html';
}