import { useAvaliacaoTecnico } from '@/hooks/useAvaliacaoTecnico';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const Avaliacao = () => {
  // Recupera o ID do técnico logado a partir do localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const tecnicoId = user?.id;

  const { data, loading } = useAvaliacaoTecnico(tecnicoId);

  if (loading) return <p>Carregando avaliação...</p>;
  if (!data) return <p>Nenhuma avaliação encontrada.</p>;

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Avaliação Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{data.notaMensal} / 10</p>
          <Progress value={(data.notaMensal / 10) * 100} className="mt-2" />
        </CardContent>
      </Card>

      {data.avaliacoes.map((item, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{item.data}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">{item.descricao}</p>
            <p className="text-md font-semibold mt-2">Nota: {item.nota}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Avaliacao;
