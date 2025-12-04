document.addEventListener('DOMContentLoaded', function() {
    carregarCarros();
});

async function carregarCarros() {
    try {
        const response = await fetch('listar_carros.php');
        const carros = await response.json();

        const container = document.getElementById('container-carros');
        container.innerHTML = ''; // Limpa o "Carregando..."

        carros.forEach(carro => {
            // Cria o card do carro
            const card = document.createElement('div');
            card.classList.add('car-card');

            // Lógica visual: Se estiver alugado, muda o estilo
            const statusTexto = carro.status === 'disponivel' ? 'Disponível' : 'Indisponível';
            const statusClass = carro.status === 'disponivel' ? 'status-ok' : 'status-erro';
            
            // Botão: Se disponível, link para alugar. Se não, botão desabilitado.
            let botaoHTML = '';
            if(carro.status === 'disponivel') {
                // Passamos o ID do carro via URL (GET)
                botaoHTML = `<a href="detalhe_carro.html?id=${carro.id}" class="cta-button">Alugar Agora</a>`;
            } else {
                botaoHTML = `<button disabled style="background-color: grey; cursor: not-allowed;">Alugado</button>`;
            }

            card.innerHTML = `
                <img src="${carro.foto}" alt="${carro.nome}" style="width:100%; border-radius: 5px;">
                <h3>${carro.nome}</h3>
                <p>Tipo: ${carro.tipo}</p>
                <p class="price">R$ ${carro.valor_mensal} / mês</p>
                <p class="${statusClass}">Status: ${statusTexto}</p>
                ${botaoHTML}
            `;

            container.appendChild(card);
        });

    } catch (erro) {
        console.error('Erro:', erro);
        document.getElementById('container-carros').innerHTML = '<p>Erro ao carregar carros.</p>';
    }
}