import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

const TecnicoDashboard = () => {
    const [progressoMensal, setProgressoMensal] = useState(65); // Simulado

    useEffect(() => {
        // Aqui você pode buscar dados reais da API depois
        setProgressoMensal(65);
    }, []);

    const indicadores = [
        { label: "Ordens Finalizadas", valor: 28 },
        { label: "Ordens Pendentes", valor: 5 },
        { label: "Solicitações de Material", valor: 3 },
        { label: "Tempo Médio por Serviço", valor: "42 min" },
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Painel do Técnico</h1>

            {/* Cards de indicadores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {indicadores.map((item, idx) => (
                    <Card key={idx}>
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                            <p className="text-xl font-semibold">
                                {typeof item.valor === "number" ? item.valor : item.valor}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Progresso mensal */}
            <div>
                <h2 className="text-lg font-semibold mb-2 text-gray-700">
                    Progresso Mensal
                </h2>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-500">Meta mensal</span>
                            <span className="text-sm text-gray-700 font-medium">
                                {progressoMensal}%
                            </span>
                        </div>
                        <Progress value={progressoMensal} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TecnicoDashboard;
