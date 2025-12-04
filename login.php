<?php
header('Content-Type: application/json');
require 'conexao.php'; // arquivo para conectar no DB

// Pega os dados do JS
$dados = json_decode(file_get_contents('php://input'));

if (!$dados) {
    echo json_encode(['erro' => 'Sem dados']);
    exit;
}

try {
    // Busca usuário pelo email
    $stmt = $pdo->prepare("SELECT id, nome, senha FROM usuarios WHERE email = :email");
    $stmt->execute([':email' => $dados->email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verifica se usuário existe E se a senha bate (usando o hash)
    if ($user && password_verify($dados->senha, $user['senha'])) {
        // Sucesso! Retorna o ID e Nome para o JS salvar
        echo json_encode([
            'sucesso' => true,
            'id' => $user['id'],
            'nome' => $user['nome']
        ]);
    } else {
        echo json_encode(['sucesso' => false, 'erro' => 'E-mail ou senha incorretos.']);
    }

} catch (Exception $e) {
    echo json_encode(['erro' => 'Erro no servidor.']);
}
?>