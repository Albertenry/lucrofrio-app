import React, { useState } from 'react';
import { FiSend, FiInfo, FiTool, FiClipboard } from 'react-icons/fi';

const AssistenteIA: React.FC = () => {
  const [pergunta, setPergunta] = useState('');
  const [historico, setHistorico] = useState<Array<{tipo: 'pergunta' | 'resposta', texto: string}>>([
    {
      tipo: 'resposta',
      texto: 'Olá! Sou o assistente virtual da Lucrofrio. Como posso ajudar você hoje? Posso fornecer informações sobre procedimentos técnicos, dicas de manutenção, ou ajudar com diagnósticos de problemas comuns em sistemas de refrigeração.'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEnviarPergunta = () => {
    if (!pergunta.trim()) return;
    
    // Adicionar pergunta ao histórico
    setHistorico([...historico, { tipo: 'pergunta', texto: pergunta }]);
    
    // Simular processamento
    setIsLoading(true);
    
    // Simular resposta da IA (em produção, isso seria uma chamada à API)
    setTimeout(() => {
      let resposta = '';
      
      if (pergunta.toLowerCase().includes('gelo') || pergunta.toLowerCase().includes('evaporador')) {
        resposta = 'Para problemas de acúmulo de gelo no evaporador, recomendo verificar:\n\n1. Sistema de degelo (resistências, timer ou placa eletrônica)\n2. Vedação das portas\n3. Temperatura ambiente muito elevada\n4. Excesso de umidade no ambiente\n\nPara resolver, você pode:\n- Desligar o equipamento e realizar degelo manual\n- Verificar e substituir resistências de degelo com defeito\n- Ajustar o ciclo de degelo na placa eletrônica\n- Verificar e substituir gaxetas de vedação danificadas';
      } else if (pergunta.toLowerCase().includes('compressor') || pergunta.toLowerCase().includes('não liga')) {
        resposta = 'Se o compressor não está ligando, verifique:\n\n1. Tensão de alimentação (deve estar dentro de ±10% da nominal)\n2. Capacitor de partida (teste com capacímetro)\n3. Relé de partida\n4. Protetor térmico\n5. Bobinas do compressor (teste de continuidade)\n\nLembre-se de sempre desligar a energia antes de realizar testes elétricos. Se o compressor estiver muito quente, aguarde esfriar antes de tentar novamente.';
      } else if (pergunta.toLowerCase().includes('vazamento') || pergunta.toLowerCase().includes('gás')) {
        resposta = 'Para identificar vazamentos de gás refrigerante:\n\n1. Use detector eletrônico de vazamento\n2. Aplique solução de água com detergente nas conexões\n3. Verifique manchas de óleo nas tubulações\n\nPara reparar:\n- Em pequenos vazamentos em conexões, reaperte as conexões\n- Para vazamentos em soldas, refaça a solda após recuperar o gás\n- Substitua componentes danificados\n- Após o reparo, faça vácuo no sistema antes de recarregar o gás';
      } else if (pergunta.toLowerCase().includes('barulho') || pergunta.toLowerCase().includes('ruído')) {
        resposta = 'Ruídos em sistemas de refrigeração podem ter várias causas:\n\n1. Ventiladores desbalanceados ou com rolamentos gastos\n2. Tubulações vibrando (falta de fixação adequada)\n3. Compressor com problemas internos\n4. Expansão/contração de componentes durante ciclos\n\nRecomendações:\n- Verifique e aperte parafusos de fixação\n- Lubrifique ou substitua ventiladores com ruído\n- Instale isoladores de vibração sob o compressor\n- Verifique se há tubulações em contato com partes metálicas';
      } else {
        resposta = 'Entendi sua pergunta sobre "' + pergunta + '". Para esse tipo de situação, recomendo verificar o manual técnico específico do equipamento ou entrar em contato com o supervisor para orientações mais detalhadas. Posso ajudar com alguma outra questão sobre refrigeração?';
      }
      
      setHistorico([...historico, { tipo: 'pergunta', texto: pergunta }, { tipo: 'resposta', texto: resposta }]);
      setPergunta('');
      setIsLoading(false);
    }, 1500);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarPergunta();
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assistente IA</h1>
        <p className="text-gray-600">Tire dúvidas técnicas e receba orientações para seus serviços</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-start">
          <FiInfo className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Este assistente utiliza IA para fornecer sugestões técnicas. Sempre siga os procedimentos de segurança e consulte seu supervisor em caso de dúvidas.
          </p>
        </div>
        
        <div className="p-4 h-96 overflow-y-auto">
          {historico.map((item, index) => (
            <div 
              key={index} 
              className={`mb-4 ${item.tipo === 'pergunta' ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block max-w-3/4 p-3 rounded-lg ${
                  item.tipo === 'pergunta' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {item.tipo === 'resposta' && (
                  <div className="flex items-center mb-2">
                    <FiTool className="mr-2" />
                    <span className="font-semibold">Assistente Lucrofrio</span>
                  </div>
                )}
                <p className="whitespace-pre-line">{item.texto}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="text-left mb-4">
              <div className="inline-block bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex">
            <textarea
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre refrigeração..."
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={2}
              disabled={isLoading}
            ></textarea>
            <button
              onClick={handleEnviarPergunta}
              disabled={!pergunta.trim() || isLoading}
              className={`px-4 py-2 bg-primary text-white rounded-r-lg ${
                !pergunta.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              <FiSend />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <FiClipboard className="mr-1" />
            <span>Pressione Enter para enviar ou Shift+Enter para nova linha</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Perguntas Frequentes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => setPergunta('Como resolver problema de acúmulo de gelo no evaporador?')}
            className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Como resolver problema de acúmulo de gelo no evaporador?
          </button>
          <button
            onClick={() => setPergunta('O que fazer quando o compressor não liga?')}
            className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            O que fazer quando o compressor não liga?
          </button>
          <button
            onClick={() => setPergunta('Como identificar vazamento de gás refrigerante?')}
            className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Como identificar vazamento de gás refrigerante?
          </button>
          <button
            onClick={() => setPergunta('O que causa ruídos anormais no sistema de refrigeração?')}
            className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            O que causa ruídos anormais no sistema de refrigeração?
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistenteIA;
