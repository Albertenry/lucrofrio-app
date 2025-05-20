import { useEffect, useState } from "react";
import axios from "axios";

interface Avaliacao {
  data: string;
  descricao: string;
  nota: number;
}

interface AvaliacaoResponse {
  tecnicoId: number;
  notaMensal: number;
  avaliacoes: Avaliacao[];
}

export const useAvaliacaoTecnico = (tecnicoId: number) => {
  const [data, setData] = useState<AvaliacaoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvaliacao = async () => {
      try {
        const response = await axios.get(`/api/tecnicos/${tecnicoId}/avaliacao`);
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar avaliação do técnico:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvaliacao();
  }, [tecnicoId]);

  return { data, loading };
};
