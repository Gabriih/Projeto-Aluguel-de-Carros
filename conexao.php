<?php
// 1. Configuração do Banco de Dados
$host = 'localhost';      // Ou o host do seu DB
$db_name = 'zenith_db'; // O nome que você criou
$username = 'root';       // Usuário padrão do XAMPP
$password = '';           // Senha padrão do XAMPP

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Se a conexão falhar, envia uma resposta de erro
    http_response_code(500); // Erro interno do servidor
    echo json_encode(['status' => 'erro', 'mensagem' => 'Falha na conexão com o banco de dados.']);
    exit(); // Para o script
}
?>