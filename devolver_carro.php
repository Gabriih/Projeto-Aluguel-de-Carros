<?php
header('Content-Type: application/json');
require 'conexao.php'; // Sua classe gerenciadora de conexão

// Recebe o JSON do JavaScript
$dados = json_decode(file_get_contents('php://input'));

if (!isset($dados->aluguel_id)) {
    echo json_encode(['erro' => 'ID do aluguel não fornecido.']);
    exit;
}

$aluguel_id = $dados->aluguel_id;

try {
    // 1. Inicia a Transação (Modo Atômico)
    $pdo->beginTransaction();

    // 2. Descobre qual é o carro desse aluguel (para poder liberar ele depois)
    $stmt = $pdo->prepare("SELECT carro_id FROM alugueis WHERE id = :id");
    $stmt->execute([':id' => $aluguel_id]);
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$resultado) {
        throw new Exception("Aluguel não encontrado.");
    }
    $carro_id = $resultado['carro_id'];

    // 3. Atualiza o Aluguel (Finaliza e põe data de hoje)
    $sql1 = "UPDATE alugueis SET status = 'finalizado', data_devolucao = NOW() WHERE id = :id";
    $stmt1 = $pdo->prepare($sql1);
    $stmt1->execute([':id' => $aluguel_id]);

    // 4. Atualiza o Carro (Libera para o próximo)
    // Definimos usuario_id como NULL para "desapontar" o ponteiro
    $sql2 = "UPDATE carros SET status = 'disponivel', usuario_id = NULL WHERE id = :id";
    $stmt2 = $pdo->prepare($sql2);
    $stmt2->execute([':id' => $carro_id]);

    // 5. Se chegou até aqui sem erro, Salva Tudo!
    $pdo->commit();

    echo json_encode(['sucesso' => true, 'mensagem' => 'Carro devolvido com sucesso!']);

} catch (Exception $e) {
    // Se deu qualquer erro no meio do caminho, desfaz tudo (Ctrl+Z no banco)
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao processar devolução: ' . $e->getMessage()]);
}
?>