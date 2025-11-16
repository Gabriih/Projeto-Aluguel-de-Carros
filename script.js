document.addEventListener('DOMContentLoaded', function(){
    //Seleciona o formulário pelo seletor de classe
    const form = document.querySelector('.cadastro-form');

    //Adiciona um listener de evento para quando o formulário for submetido
    form.addEventListener('submit', function(event){
        //impede o comportamento padrão de envio do formulário, que recarregaria a página
        event.preventDefault();

        //seleciona os campos
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const cpf = document.getElementById('cpf').value.trim();

        validarFormulario();

        if (validarFormulario(nomeInput, emailInput, senhaInput, cpfInput)){
            // Se a validação local passar, cria o objeto de dados
            const dadosCadastro = {
                nome: nomeInput.value.trim(),
                email: emailInput.value.trim(),
                senha: senhaInput.value.trim(),
                cpf: cpfInput.value.trim()
            };

            //chama a função de envio para o PHP
            enviarDados(dadosCadastro, form);
        }
    });

    function validarFormulario(){
        // Pega os valores .value.trim() aqui dentro
        const nomeVal = nome.value.trim();
        const emailVal = email.value.trim();
        const senhaVal = senha.value.trim();
        const cpfVal = cpf.value.trim();

        //expressao regular para verificar o formato do e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        //armazena a mensagem de erro
        let erro = '';

        //valida se os campos obrigatorios nao estao vazios
        if (nomeVal === '' || emailVal === '' || senhaVal === '' || cpfVal === ''){
            erro += 'Todos os campos são obrigatórios.\n';
        }

        //checa o formato do e-mail
        if (emailVal !== '' && !emailRegex.test(emailVal)){
            erro += 'Por favor, insira um e-mail válido.\n';
        }

        //checa se a senha tem menos de 6 caracteres
        if (senhaVal !== '' && senhaVal.length < 6){
            erro += 'A senha deve ter no mínimo 6 caracteres.\n';
        }

        //se houver erros, exibe o alerta e retorna falso
        if (erro !== ''){
            alert('Erro no cadastro:\n' + erro);
            return false;
        }

        //se nao houver erros, retorna verdadeiro
        return true;
    }

    //funcao para enviar dados
    async function enviarDados(dados, formElement){
        try{
            const resposta = await fetch('cadastro.php', {
                method: 'POST', //método HTTP
                headers: {
                    'Content-Type': 'application/json' //informa que esta sendo enviado JSON
                },
                body: JSON.stringify(dados) //converte o objeto JS em string JSON
            });

            //converte a resposta do PHP em objeto
            const resultado = await resposta.json();

            //'resposta.ok' checa se o status HTTP foi 2xx (sucesso)
            if (resposta.ok){
                alert(resultado.mensagem); //Exemplo: 'Cadastro realizado com sucesso'
                formElement.reset(); //limpa o formulário
            } else {
                //se o PHP retornou um erro (4xx ou 5xx)
                alert('Erro: ' + resultado.mensagem); //Exemplo: 'E-Mail ou CPF ja cadastrado'
            }
        } catch (erro){
            //captura erros de rede (Exemplo: PHP não encontrado, sem internet)
            console.error('Falha na comunicação', erro);
            alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.')
        }
    }
});