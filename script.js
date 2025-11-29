document.addEventListener('DOMContentLoaded', function(){
    const form = document.querySelector('.cadastro-form');

    form.addEventListener('submit', function(event){
        event.preventDefault(); // Impede o envio padrão

        // Pega a referência dos campos SÓ UMA VEZ
        const nomeInput = document.getElementById('nome');
        const emailInput = document.getElementById('email');
        const senhaInput = document.getElementById('senha');
        const cpfInput = document.getElementById('cpf');

        if (validarFormulario(nomeInput, emailInput, senhaInput, cpfInput)){
            // Se a validação local passar, cria o objeto de dados
            const dadosCadastro = {
                nome: nomeInput.value.trim(),
                email: emailInput.value.trim(),
                senha: senhaInput.value.trim(),
                cpf: cpfInput.value.trim()
            };

            // CHAMA A FUNÇÃO DE ENVIO PARA O PHP
            enviarParaPHP(dadosCadastro, form);
        }
    });

    function validarFormulario(nome, email, senha, cpf){
        // Pega os valores .value.trim() aqui dentro
        const nomeVal = nome.value.trim();
        const emailVal = email.value.trim();
        const senhaVal = senha.value.trim();
        const cpfVal = cpf.value.trim();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let erro = '';

        if (nomeVal === '' || emailVal === '' || senhaVal === '' || cpfVal === ''){
            erro += 'Todos os campos são obrigatórios.\n';
        }

        if (emailVal !== '' && !emailRegex.test(emailVal)){
            erro += 'Por favor, insira um e-mail válido.\n';
        }

        if (senhaVal !== '' && senhaVal.length < 6){
            erro += 'A senha deve ter no mínimo 6 caracteres.\n';
        }

        if (erro !== ''){
            alert('Erro no cadastro:\n' + erro);
            return false;
        }
        return true;
    }

    // NOVA FUNÇÃO para enviar os dados
    async function enviarParaPHP(dados, formElement) {
        try {
            const resposta = await fetch('api.php', {
                method: 'POST', // Método HTTP
                headers: {
                    'Content-Type': 'application/json' // Informa que estamos enviando JSON
                },
                body: JSON.stringify(dados) // Converte o objeto JS em string JSON
            });

            // Converte a resposta do PHP (que também é JSON) em objeto
            const resultado = await resposta.json(); 

            // `resposta.ok` checa se o status HTTP foi 2xx (sucesso)
            if (resposta.ok) { 
                alert(resultado.mensagem); // Ex: "Cadastro realizado com sucesso!"
                formElement.reset(); // Limpa o formulário
            } else {
                // Se o PHP retornou um erro (4xx ou 5xx)
                alert('Erro: ' + resultado.mensagem); // Ex: "E-mail ou CPF já cadastrado."
            }

        } catch (erro) {
            // Captura erros de rede (ex: PHP não encontrado, sem internet)
            console.error('Falha na comunicação:', erro);
            alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
        }
    }
});