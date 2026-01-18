# Widget de Imóveis - marioaragao.com

Widget React para exibir listagem e detalhes de imóveis, integrado com Supabase. Compilado como uma biblioteca embeddable (IIFE) para ser inserido em qualquer página HTML.

## 🚀 Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Supabase

Crie um arquivo `.env` na raiz do projeto com suas credenciais:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

### 3. Estrutura da Tabela `imoveis`

A tabela no Supabase deve ter os seguintes campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid/text | Identificador único |
| `titulo` | text | Título do imóvel |
| `descricao` | text | Descrição completa |
| `tipo` | text | `venda` ou `aluguel` |
| `cidade` | text | Cidade do imóvel |
| `bairro` | text | (opcional) Bairro |
| `endereco` | text | (opcional) Endereço completo |
| `preco` | numeric | Valor do imóvel |
| `area` | numeric | (opcional) Área em m² |
| `quartos` | integer | (opcional) Número de quartos |
| `banheiros` | integer | (opcional) Número de banheiros |
| `vagas` | integer | (opcional) Vagas de garagem |
| `imagem_principal` | text | URL da imagem principal |
| `galeria_imagens` | text[] | (opcional) Array de URLs de imagens |
| `caracteristicas` | text[] | (opcional) Array de características |
| `created_at` | timestamp | Data de criação |

---

## 🔨 Build

Para gerar os arquivos de produção:

```bash
npm run build
```

Arquivos gerados na pasta `dist/`:
- `imoveis-widget.js` - Script principal (IIFE)
- `imoveis-widget.css` - Estilos

---

## 📦 Como Embeddar no Site

### Snippet HTML para Widget HTML

Cole este código no seu "Widget HTML" do site:

```html
<!-- Widget de Imóveis - marioaragao.com -->
<div id="aracon-imoveis-widget"></div>
<link rel="stylesheet" href="https://SEU_CDN/imoveis-widget.css">
<script src="https://SEU_CDN/imoveis-widget.js"></script>
```

> **Importante:** Substitua `SEU_CDN` pela URL onde você hospedou os arquivos (`imoveis-widget.js` e `imoveis-widget.css`).

### Opções de Hospedagem

1. **Vercel/Netlify** - Faça deploy do projeto completo
2. **GitHub Pages** - Hospede a pasta `dist`
3. **AWS S3/CloudFront** - Upload dos arquivos para bucket S3
4. **Seu próprio servidor** - Copie os arquivos para um diretório público

---

## 🛣️ Roteamento

O widget detecta automaticamente a URL para decidir o que exibir:

| URL | Componente |
|-----|------------|
| `/imoveis` | Grid de imóveis com filtros |
| `/imovel?id=123` | Detalhes do imóvel com ID 123 |
| Qualquer outra | Grid de imóveis (fallback) |

### Criação das Páginas no CMS

No seu CMS/construtor de sites, você precisará criar **duas páginas**:

1. **Página `/imoveis`** - Para a listagem
2. **Página `/imovel`** - Para os detalhes

Em ambas, insira o mesmo snippet HTML do widget.

---

## 🎨 Personalização

### Prefixo CSS

Todas as classes Tailwind usam o prefixo `ma:` para evitar conflitos com estilos existentes. Exemplo: `ma:bg-white`, `ma:text-gray-900`.

### Variáveis CSS

Você pode sobrescrever as cores do tema editando estas variáveis CSS:

```css
:root {
  --ma-primary: #1e40af;
  --ma-primary-hover: #1e3a8a;
  --ma-secondary: #64748b;
  --ma-accent: #f59e0b;
  --ma-success: #10b981;
  --ma-error: #ef4444;
  --ma-background: #f8fafc;
  --ma-surface: #ffffff;
  --ma-text: #1e293b;
  --ma-text-muted: #64748b;
  --ma-border: #e2e8f0;
}
```

---

## 🔧 Desenvolvimento

### Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse:
- `http://localhost:5173/imoveis` - Listagem
- `http://localhost:5173/imovel?id=ID_DO_IMOVEL` - Detalhes

### Estrutura do Projeto

```
src/
├── components/
│   ├── PropertyCard.tsx      # Card do imóvel
│   ├── PropertyFilters.tsx   # Filtros
│   ├── PropertyGrid.tsx      # Grid/lista
│   ├── PropertyDetails.tsx   # Página de detalhes
│   └── ImageGallery.tsx      # Galeria de fotos
├── hooks/
│   └── useProperties.ts      # Hooks para Supabase
├── lib/
│   └── supabase.ts           # Cliente Supabase
├── types/
│   └── property.ts           # Tipos TypeScript
├── App.tsx                   # Router
├── main.tsx                  # Entry point
└── index.css                 # Estilos Tailwind
```

---

## 📝 Licença

Projeto privado para marioaragao.com
