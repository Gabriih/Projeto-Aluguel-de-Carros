<?php
header('Content-Type: application/json');
require 'conexao.php'; // Seu arquivo de conexão

$id_usuario = $_GET['id_usuario']; // Recebe o ID do JS

// Query poderosa: Traz dados do aluguel + dados do carro
$sql = "SELECT 
            al.id as aluguel_id, 
            al.data_inicio, 
            al.data_devolucao, 
            al.status,
            c.nome as carro_nome, 
            c.foto, 
            c.valor_mensal 
        FROM alugueis al
        JOIN carros c ON al.carro_id = c.id
        WHERE al.usuario_id = :id
        ORDER BY al.data_inicio DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute([':id' => $id_usuario]);
$resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($resultado);
?>