import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Assistente = () => {
    const [descricao, setDescricao] = useState("");
    const [resposta, setResposta] = useState("");

    const simularIA = () => {
        // Simulação local de IA (você pode substituir por integração real com o backend futuramente)
        if (descricao.toLowerCase().includes("evaporadora")) {
            setResposta(`🔧 Ferramentas Recomendadas:
- Multímetro
- Termômetro digital
- Escada

📋 Instruções:
1. Desenergize a unidade.
2. Verifique sensor de temperatura e ventiladores.
3. Meça a corrente dos motores.
4. Faça higienização completa.`);
        } else if (descricao.toLowerCase().includes("vazamento")) {
            setResposta(`🔧 Ferramentas Recomendadas:
- Detector de vazamento
- Cilindro de nitrogênio
- Manifold

📋 Instruções:
1. Pressurize o sistema com nitrogênio.
2. Identifique o ponto de vazamento com detector.
3. Solde o ponto e teste novamente.
4. Refaça carga com fluido.`);
        } else {
            setResposta(`🔧 Ferramentas Recomendadas:
- Kit básico de manutenção
- Multímetro
- Alicate amperímetro

📋 Instruções:
1. Leia atentamente a descrição do problema.
2. Inspecione componentes elétricos e sensores.
3. Teste controladores e verifique alarmes.`);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Assistente Técnico com IA</h1>

            <Card>
                <CardContent className="p-4 space-y-4">
                    <Textarea
                        placeholder="Descreva o problema ou situação da ordem de serviço..."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />

                    <Button onClick={simularIA}>Obter Recomendações</Button>

                    {resposta && (
                        <div className="mt-4 bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap">
                            {resposta}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Assistente;
