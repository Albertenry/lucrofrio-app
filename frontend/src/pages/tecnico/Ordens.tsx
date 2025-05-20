import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface OrdemServico {
    id: number;
    cliente: string;
    endereco: string;
    status: string;
    chegada?: string;
    saida?: string;
}

const Ordens = () => {
    const [ordens, setOrdens] = useState<OrdemServico[]>([]);

    useEffect(() => {
        // Simula a busca de ordens atribuídas ao técnico logado
        const ordensMock: OrdemServico[] = [
            {
                id: 101,
                cliente: "Supermercado Central",
                endereco: "Av. Brasil, 123",
                status: "Em andamento",
            },
            {
                id: 102,
                cliente: "Padaria do Bairro",
                endereco: "Rua das Flores, 45",
                status: "Pendente",
            },
        ];
        setOrdens(ordensMock);
    }, []);

    const atualizarOrdem = (id: number, campo: "chegada" | "saida", valor: string) => {
        setOrdens((prev) =>
            prev.map((ordem) =>
                ordem.id === id ? { ...ordem, [campo]: valor } : ordem
            )
        );
    };

    const finalizarOrdem = (id: number) => {
        setOrdens((prev) =>
            prev.map((ordem) =>
                ordem.id === id ? { ...ordem, status: "Finalizada" } : ordem
            )
        );
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Minhas Ordens de Serviço</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ordens.map((ordem) => (
                    <Card key={ordem.id}>
                        <CardContent className="space-y-4 p-4">
                            <h2 className="text-lg font-semibold text-primary">
                                Ordem #{ordem.id} - {ordem.cliente}
                            </h2>
                            <p className="text-sm text-gray-600">{ordem.endereco}</p>
                            <p className="text-sm text-gray-700 font-medium">Status: {ordem.status}</p>

                            <div className="flex flex-col gap-2">
                                <Input
                                    type="time"
                                    value={ordem.chegada || ""}
                                    onChange={(e) => atualizarOrdem(ordem.id, "chegada", e.target.value)}
                                    placeholder="Hora de chegada"
                                />
                                <Input
                                    type="time"
                                    value={ordem.saida || ""}
                                    onChange={(e) => atualizarOrdem(ordem.id, "saida", e.target.value)}
                                    placeholder="Hora de saída"
                                />
                            </div>

                            <Button
                                className="mt-2"
                                onClick={() => finalizarOrdem(ordem.id)}
                                disabled={ordem.status === "Finalizada"}
                            >
                                Finalizar Ordem
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Ordens;
