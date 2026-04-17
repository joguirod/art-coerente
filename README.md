# ART Analyzer

Sistema web para análise de coerência técnica de **Anotações de Responsabilidade Técnica (ARTs)** e acompanhamento de obras civis. Desenvolvido como Trabalho de Conclusão de Curso (TCC).

---

## O que é

Engenheiros registrados no CREA precisam preencher ARTs declarando as atividades técnicas que executarão em uma obra. Erros de coerência entre a descrição da obra e as atividades declaradas são comuns e podem gerar problemas no processo de registro.

O **ART Analyzer** automatiza essa verificação usando **RAG (Retrieval-Augmented Generation)**: os dados da ART são comparados contra uma base de conhecimento normativo (Resoluções CONFEA, NBRs, Lei 5.194/66) via busca vetorial com pgvector, e o resultado é analisado pelo **Gemini Flash**, que gera um score de coerência, alertas fundamentados em norma e sugestões de melhoria.

### Módulos

- **Pré-ART** — analisa a coerência antes do registro oficial no CREA
- **Pós-ART** — analisa ARTs já emitidas, com suporte a upload de PDF (layout CREA-PI) ou preenchimento manual
- **Acompanhamento de Obras** — controle de etapas construtivas com atualizações de texto e imagem, vinculadas opcionalmente a uma ART

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Java 21 + Spring Boot 3.x |
| Frontend | Next.js 14 + TypeScript + Tailwind + shadcn/ui |
| Banco de dados | PostgreSQL 16 + pgvector |
| Embeddings | Google Embedding API (text-embedding-004) |
| Modelo de linguagem | Gemini Flash (Google AI) |
| Autenticação | JWT (Spring Security) |
| Extração de PDF | Apache PDFBox |
| Containerização | Docker + Docker Compose |

---

## Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose
- [Node.js 20+](https://nodejs.org/) (para rodar o frontend localmente)
- Chave de API do Google AI (Gemini + Embeddings) — obtenha em [aistudio.google.com](https://aistudio.google.com)
- Conta Gmail com **senha de app** configurada (para envio de e-mails de reset de senha)

---

## Configuração

### 1. Variáveis de ambiente do backend

Copie o arquivo de exemplo e preencha os valores:

```bash
cp backend/.env.example backend/.env
```

Edite `backend/.env`:

```env
JWT_SECRET=gere-uma-chave-aleatoria-longa-aqui
GOOGLE_API_KEY=sua-chave-do-google-ai
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=seu-email@gmail.com
MAIL_PASSWORD=sua-senha-de-app-do-gmail
FRONTEND_URL=http://localhost:3000
```

> **JWT_SECRET**: use uma string aleatória longa (mínimo 256 bits). Exemplo para gerar: `openssl rand -hex 64`

### 2. Variáveis de ambiente do frontend

O arquivo `frontend/.env.local` já existe com o valor padrão para desenvolvimento local:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Altere apenas se o backend estiver em outro endereço.

---

## Executando com Docker (recomendado)

### Backend + Banco de dados

```bash
cd backend
docker compose up --build -d
```

Isso sobe:
- **PostgreSQL 16 com pgvector** na porta `5432`
- **Backend Spring Boot** na porta `8080`

Para acompanhar os logs:

```bash
docker compose logs -f backend
```

Para parar:

```bash
docker compose down
```

> Os dados do banco e os uploads de imagem são persistidos em volumes Docker (`postgres_data` e `uploads_data`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## Executando localmente (sem Docker)

### Banco de dados

É necessário ter PostgreSQL 16 com a extensão pgvector instalada. Com Docker apenas para o banco:

```bash
docker run -d \
  --name artanalyzer-db \
  -e POSTGRES_DB=artanalyzer \
  -e POSTGRES_USER=artuser \
  -e POSTGRES_PASSWORD=artpass \
  -p 5432:5432 \
  pgvector/pgvector:pg16
```

### Backend

```bash
cd backend

# Defina as variáveis de ambiente (ou exporte-as no seu shell)
export DB_URL=jdbc:postgresql://localhost:5432/artanalyzer
export DB_USERNAME=artuser
export DB_PASSWORD=artpass
export JWT_SECRET=sua-chave-secreta
export GOOGLE_API_KEY=sua-chave-google
export MAIL_USERNAME=seu-email@gmail.com
export MAIL_PASSWORD=sua-senha-de-app
export FRONTEND_URL=http://localhost:3000

./mvnw spring-boot:run
```

O backend inicia na porta `8080`. As migrações do banco são aplicadas automaticamente via Flyway.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Indexando a base de conhecimento normativa

A análise de coerência depende de uma base de documentos normativos indexados. Sem ela, o sistema funciona, mas as análises terão fundamentação normativa limitada.

Para indexar um documento, use o endpoint administrativo após subir o backend:

```bash
curl -X POST http://localhost:8080/api/admin/index \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Resolução CONFEA 1025/2009",
    "text": "conteúdo do documento aqui..."
  }'
```

Documentos recomendados para indexar:
- Resolução CONFEA 1025/2009
- Resolução CONFEA 1048/2013
- NBR 13531
- NBR 13532
- Lei 5.194/1966

Para listar ou desativar chunks já indexados:

```bash
# Listar chunks
GET http://localhost:8080/api/admin/chunks

# Desativar um chunk
PATCH http://localhost:8080/api/admin/chunks/{id}
```

---

## Estrutura do projeto

```
art-analyzer/
├── backend/          # API REST — Java 21 + Spring Boot
│   ├── src/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .env.example
└── frontend/         # Interface web — Next.js 14
    └── src/
```

---

## Observações

- O sistema **não integra** com sistemas oficiais do CREA e não substitui o processo formal de registro de ART.
- A extração de PDF suporta inicialmente apenas o layout padrão do **CREA-PI**.
- O JWT expira em 30 minutos. Não há refresh token — o usuário precisará fazer login novamente.
