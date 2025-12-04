<?php
header('Content-Type: application/json');
require 'conexao.php';

$dados = json_decode(file_get_contents('php://input'));

if (!isset($dados->usuario_id) || !isset($dados->carro_id)) {
    echo json_encode(['erro' => 'Dados incompletos.']);
    exit;
}

$usuario_id = $dados->usuario_id;
$carro_id = $dados->carro_id;

try {
    $pdo->beginTransaction();

    // 1. Verifica se o carro AINDA está disponível (evitar condição de corrida)
    $stmtCheck = $pdo->prepare("SELECT status FROM carros WHERE id = :id");
    $stmtCheck->execute([':id' => $carro_id]);
    $carro = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    if ($carro['status'] !== 'disponivel') {
        throw new Exception("Este carro já foi alugado por outra pessoa!");
    }

    // 2. Cria o registro na tabela de histórico (alugueis)
    $sql1 = "INSERT INTO alugueis (usuario_id, carro_id, data_inicio, status) VALUES (:uid, :cid, NOW(), 'ativo')";
    $stmt1 = $pdo->prepare($sql1);
    $stmt1->execute([':uid' => $usuario_id, ':cid' => $carro_id]);

    // 3. Atualiza o status do carro e define quem está usando
    $sql2 = "UPDATE carros SET status = 'alugado', usuario_id = :uid WHERE id = :cid";
    $stmt2 = $pdo->prepare($sql2);
    $stmt2->execute([':uid' => $usuario_id, ':cid' => $carro_id]);

    $pdo->commit();
    echo json_encode(['sucesso' => true, 'mensagem' => 'Aluguel realizado com sucesso!']);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['erro' => $e->getMessage()]);
}
?>