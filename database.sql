-- Criação das tabelas

-- Tabela empresas
CREATE TABLE empresas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  endereco TEXT,
  telefone VARCHAR(20),
  login VARCHAR(50) UNIQUE NOT NULL,
  senha VARCHAR(100) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela clientes
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas(id),
  nome VARCHAR(100) NOT NULL,
  endereco TEXT,
  pessoa_contato VARCHAR(100),
  telefone VARCHAR(20),
  email VARCHAR(100),
  CONSTRAINT fk_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
);

-- Tabela usuários
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas(id),
  nome_completo VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  funcao VARCHAR(50) NOT NULL,
  login VARCHAR(50) UNIQUE NOT NULL,
  senha VARCHAR(100) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
);

-- Tabela ordens_servico
CREATE TABLE ordens_servico (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas(id),
  criticidade VARCHAR(20) NOT NULL,
  descricao TEXT NOT NULL,
  tecnico_id INTEGER REFERENCES usuarios(id),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  hora_chegada TIMESTAMP,
  hora_saida TIMESTAMP,
  status VARCHAR(30) DEFAULT 'pendente',
  CONSTRAINT fk_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  CONSTRAINT fk_tecnico FOREIGN KEY (tecnico_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabela solicitacoes
CREATE TABLE solicitacoes (
  id SERIAL PRIMARY KEY,
  ordem_id INTEGER REFERENCES ordens_servico(id),
  nome_material VARCHAR(100) NOT NULL,
  quantidade INTEGER NOT NULL,
  notas TEXT,
  status VARCHAR(30) DEFAULT 'solicitado',
  CONSTRAINT fk_ordem FOREIGN KEY (ordem_id) REFERENCES ordens_servico(id) ON DELETE CASCADE
);

-- Inserir administrador padrão
INSERT INTO empresas (nome, cnpj, endereco, telefone, login, senha)
VALUES ('Lucrofrio', '00.000.000/0001-00', 'Endereço da Matriz', '(00) 0000-0000', 'admin', 'admin123');

INSERT INTO usuarios (empresa_id, nome_completo, email, funcao, login, senha)
VALUES (1, 'Administrador', 'albertenry2@gmail.com', 'admin', 'admin', 'admin123');
