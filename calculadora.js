// Espera o documento carregar para rodar o script
        document.addEventListener('DOMContentLoaded', () => {

            // Seleciona os elementos do HTML
            const carValueInput = document.getElementById('carValue');
            const durationInput = document.getElementById('duration');
            const unitSelect = document.getElementById('unit');
            const calculateBtn = document.getElementById('calculateBtn');
            const totalCostEl = document.getElementById('totalCost');
            const logicAppliedEl = document.getElementById('logicApplied');

            // Adiciona o "escutador" de evento no botão
            calculateBtn.addEventListener('click', calcularAluguel);

            function calcularAluguel() {
                // Pega os valores dos inputs
                const monthlyRate = parseFloat(carValueInput.value);
                const duration = parseFloat(durationInput.value);
                const unit = unitSelect.value;

                // Validação simples
                if (isNaN(monthlyRate) || isNaN(duration) || monthlyRate <= 0 || duration <= 0) {
                    alert('Por favor, insira valores válidos em todos os campos.');
                    return;
                }

                // 4. Normaliza o tempo para MESES (para a lógica de desconto)
                // Usamos 4.345 como uma média de semanas por mês (365.25 dias / 12 meses / 7 dias)
                const WEEKS_IN_MONTH = 4.345;
                let durationInMonths = 0;
                let baseCost = 0;

                if (unit === 'meses') {
                    durationInMonths = duration;
                    baseCost = monthlyRate * duration;
                } else if (unit === 'semanas') {
                    durationInMonths = duration / WEEKS_IN_MONTH;
                    
                    // Calcula o custo com base na diária (mais justo para semanas)
                    const dailyRate = monthlyRate / (WEEKS_IN_MONTH * 7);
                    baseCost = dailyRate * (duration * 7);
                }

                // 5. Aplica a LÓGICA DE NEGÓCIO (Acréscimos e Descontos)
                
                let totalCost = baseCost;
                let adjustmentPercent = 0;
                let logicMessage = ""; // Mensagem para o usuário

                // --- INÍCIO DA LÓGICA FLEXÍVEL ---
                
                if (durationInMonths < 1) { 
                    // Acréscimo para aluguéis curtos (menos de 1 mês)
                    adjustmentPercent = 15; // +15%
                    logicMessage = `Acréscimo de ${adjustmentPercent}% (aluguel < 1 mês)`;

                } else if (durationInMonths >= 3 && durationInMonths < 6) {
                    // Desconto para aluguéis de médio prazo (3 a 6 meses)
                    adjustmentPercent = -10; // -10%
                    logicMessage = `Desconto de ${Math.abs(adjustmentPercent)}% (aluguel de ${durationInMonths.toFixed(0)} meses)`;

                } else if (durationInMonths >= 6) {
                    // Desconto maior para longo prazo (6+ meses)
                    adjustmentPercent = -20; // -20%
                    logicMessage = `Desconto de ${Math.abs(adjustmentPercent)}% (aluguel de longo prazo)`;
                } else {
                    // Aluguel entre 1 e 3 meses (sem desconto/acréscimo)
                    logicMessage = "Tarifa padrão aplicada.";
                }

                // Calcula o custo final
                totalCost = baseCost * (1 + (adjustmentPercent / 100));

                // Exibe o resultado formatado
                
                // Formata o número como moeda brasileira (BRL)
                totalCostEl.textContent = totalCost.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });
                
                // Exibe a lógica que foi usada
                logicAppliedEl.textContent = logicMessage;
            }
        });