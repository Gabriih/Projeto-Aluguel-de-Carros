<?php
// get_carro.php
header('Content-Type: application/json');
require 'conexao.php';

try {

    // Verifica se o ID foi passado na URL
    if (!isset($_GET['id'])) {
        echo json_encode(['erro' => 'ID não fornecido']);
        exit;
    }

    $id = $_GET['id'];

    // Busca o carro específico
    // Usamos prepare() para evitar que alguém coloque "?id=1 OR 1=1" (SQL Injection)
    $stmt = $pdo->prepare("SELECT * FROM carros WHERE id = :id");
    $stmt->execute([':id' => $id]);
    
    $carro = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$carro) {
        echo json_encode(['erro' => 'Carro não encontrado']);
        exit;
    }

    echo json_encode($carro);

} catch (PDOException $e) {
   
}
?>