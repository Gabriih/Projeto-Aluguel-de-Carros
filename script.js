document.addEventListener('DOMContentLoaded', function(){
    //Seleciona o formulário pelo seletor de classe
    const form = document.querySelector('.cadastro-form');

    //Adiciona um listener de evento para quando o formulário for submetido
    form.addEventListener('submit', function(event){
        //impede o comportamento padrão de envio do formulário, que recarregaria a página
        event.preventDefault();

        //chama a função de validação
        if (validarFormulario()){
            //se a validação for bem sucedida
            alert('Cadastro realizado com sucesso!');
            //aqui eu tenho que enviar os dados para tratamento no PHP

            //limpar formulario
            form.reset();
        }
    });

    function validarFormulario(){
        //seleciona os campos
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const cpf = document.getElementById('cpf').value.trim();

        //expressao regular para verificar o formato do e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        //armazena a mensagem de erro
        let erro = '';

        //valida se os campos obrigatorios nao estao vazios
        if (nome === '' || email === '' || senha === '' || cpf === ''){
            erro += 'Todos os campos são obrigatórios.\n';
        }

        //checa o formato do e-mail
        if (email !== '' && !emailRegex.test(email)){
            erro += 'Por favor, insira um e-mail válido.\n';
        }

        //checa se a senha tem menos de 6 caracteres
        if (senha !== '' && senha.length < 6){
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
});