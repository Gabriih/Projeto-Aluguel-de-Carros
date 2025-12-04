<?php
require 'conexao.php';

try {
    // Seleciona todos os carros
    $sql = "SELECT * FROM carros";
    $stmt = $pdo->query($sql);
    
    // Pega todos os resultados como um array associativo
    $carros = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Envia como JSON
    echo json_encode($carros);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao buscar carros: ' . $e->getMessage()]);
}
?>