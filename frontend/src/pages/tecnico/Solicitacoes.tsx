import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Solicitacao {
    id: number;
    material: string;
    quantidade: number;
    status: "Pendente" | "Aprovado" | "Negado";
    dataSolicitacao: string;
    observacao?: string;
}

const Solicitacoes = () => {
    const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

    useEffect(() => {
        // Simulação de dados (substituir por chamada real ao backend futuramente)
        const dadosFicticios: Solicitacao[] = [
            {
                id: 1,
                material: "Manômetro digital",
                quantidade: 1,
                status: "Aprovado",
                dataSolicitacao: "2025-05-10T10:30:00Z",
                observacao: "Urgente para OS #102",
            },
            {
                id: 2,
                material: "Fluido refrigerante R-404A",
                quantidade: 2,
                status: "Pendente",
                dataSolicitacao: "2025-05-15T08:20:00Z",
            },
            {
                id: 3,
                material: "Detector de vazamento",
                quantidade: 1,
                status: "Negado",
                dataSolicitacao: "2025-05-01T14:10:00Z",
                observacao: "Item fora de estoque",
            },
        ];
        setSolicitacoes(dadosFicticios);
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Solicitações de Material</h1>

            {solicitacoes.map((item) => (
                <Card key={item.id}>
                    <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold">{item.material}</h2>
                            <Badge
                                variant={
                                    item.status === "Aprovado"
                                        ? "secondary"
                                        : item.status === "Negado"
                                            ? "destructive"
                                            : "default"
                                }
                            >
                                {item.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                            Quantidade: {item.quantidade}
                        </p>
                        <p className="text-sm text-gray-600">
                            Solicitado em: {format(new Date(item.dataSolicitacao), "dd/MM/yyyy HH:mm")}
                        </p>
                        {item.observacao && (
                            <p className="text-sm text-gray-500 italic">
                                Observação: {item.observacao}
                            </p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default Solicitacoes;
