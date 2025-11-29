<?php
// 1. Configuração do Banco de Dados
$host = 'localhost';      // Ou o host do seu DB
$db_name = 'zenith_db'; // O nome que você criou
$username = 'root';       // Usuário padrão do XAMPP
$password = '';           // Senha padrão do XAMPP

// 2. Conexão com o DB (Usando PDO para segurança)
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Se a conexão falhar, envia uma resposta de erro
    http_response_code(500); // Erro interno do servidor
    echo json_encode(['status' => 'erro', 'mensagem' => 'Falha na conexão com o banco de dados.']);
    exit(); // Para o script
}

// 3. Receber os dados do JavaScript (JSON)
// O PHP não entende JSON vindo do 'body' por padrão, então lemos o input "cru"
$dadosJson = file_get_contents('php://input');
$dados = json_decode($dadosJson);

// 4. Validação simples no servidor (sempre valide no back-end também!)
if (empty($dados->nome) || empty($dados->email) || empty($dados->senha) || empty($dados->cpf)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'erro', 'mensagem' => 'Todos os campos são obrigatórios.']);
    exit();
}

// 5. Preparar os dados para inserir
$nome = $dados->nome;
$email = $dados->email;
$cpf = $dados->cpf;
// CRIPTOGRAFIA DA SENHA (ESSENCIAL!)
$senhaHash = password_hash($dados->senha, PASSWORD_DEFAULT);

// 6. Inserir no Banco de Dados (com Prepared Statements)
// Isso previne SQL Injection!
try {
    $sql = "INSERT INTO usuarios (nome, email, senha, cpf) VALUES (:nome, :email, :senha, :cpf)";
    $stmt = $pdo->prepare($sql);
    
    $stmt->execute([
        ':nome' => $nome,
        ':email' => $email,
        ':senha' => $senhaHash,
        ':cpf' => $cpf
    ]);

    // 7. Enviar resposta de sucesso de volta ao JavaScript
    http_response_code(201); // 201 Created
    echo json_encode(['status' => 'sucesso', 'mensagem' => 'Cadastro realizado com sucesso!']);

} catch (PDOException $e) {
    // Tratar erros comuns (ex: e-mail ou CPF duplicado)
    if ($e->getCode() == 23000) { // Código de violação de constraint (UNIQUE)
        http_response_code(409); // Conflict
        echo json_encode(['status' => 'erro', 'mensagem' => 'E-mail ou CPF já cadastrado.']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao processar o cadastro: ' . $e->getMessage()]);
    }
}
?>