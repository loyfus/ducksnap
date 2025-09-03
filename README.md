# Duck Snap

Gerenciador de snapshots versionados para projetos locais - Uma alternativa simples ao Git para projetos em desenvolvimento inicial.

## Sobre o Projeto

Duck Snap é um aplicativo desktop desenvolvido em Electron que permite criar snapshots versionados de seus projetos locais de forma rápida e intuitiva. Ideal para desenvolvedores que querem versionar projetos pessoais sem a complexidade do Git, especialmente em fases iniciais de desenvolvimento.

## Funcionalidades

### Principais

- **Drag & Drop**: Arraste pastas diretamente para criar snapshots
- **Versionamento Automático**: Sugestão inteligente da próxima versão
- **Compactação Inteligente**: Ignora automaticamente pastas desnecessárias (node_modules, .git, etc)
- **Interface Dark Mode**: Design moderno e minimalista

### Recursos Avançados

- **Comparação de Versões**: Compare tamanho e número de arquivos entre snapshots
- **Exportação de Projetos**: Exporte todos os snapshots de um projeto para backup
- **Metadados Detalhados**: Visualize data, tamanho e quantidade de arquivos
- **Gerenciamento Completo**: Liste, abra e exclua snapshots facilmente

## Instalação

### Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn

### Passos

1. Clone o repositório ou copie os arquivos do projeto:

```bash
cd duck-snap
```

2. Instale as dependências:

```bash
npm install
```

3. Execute o aplicativo em modo de desenvolvimento:

```bash
npm run dev
```

## Scripts Disponíveis

- `npm start` - Inicia o aplicativo Electron (requer build do React)
- `npm run dev` - Inicia em modo de desenvolvimento com hot reload
- `npm run build` - Cria o build de produção
- `npm run dist` - Gera o instalador do aplicativo

## Como Usar

### Criar um Snapshot

1. **Arraste uma pasta** para a área de drop ou clique em "Selecionar Pasta"
2. **Digite o nome do projeto** (ou use o nome da pasta automaticamente)
3. **Defina a versão** (o app sugere automaticamente a próxima)
4. **Clique em "Criar Snapshot"**

### Gerenciar Snapshots

- **Visualizar**: Todos os snapshots aparecem em cards na tela principal
- **Filtrar**: Use o dropdown para filtrar por projeto
- **Abrir Pasta**: Clique no ícone de pasta para abrir o local do arquivo
- **Excluir**: Clique no ícone de lixeira para remover um snapshot
- **Comparar**: Ative o modo de comparação e selecione dois snapshots

### Exportar Projeto

1. Selecione um projeto no filtro
2. Clique em "Exportar Projeto"
3. Escolha o destino
4. Os snapshots serão copiados para `DuckSnap/{nome-do-projeto}/`

## Estrutura de Arquivos Ignorados

O aplicativo automaticamente ignora as seguintes pastas ao criar snapshots:

- `node_modules`
- `.git`
- `target`
- `dist`
- `build`
- `.idea`
- `.vscode`
- `__pycache__`
- `.pytest_cache`
- `.next`
- `.nuxt`
- `coverage`
- `.env`

## Arquitetura

```
duck-snap/
├── src/
│   ├── main/
│   │   └── main.js          # Processo principal Electron
│   ├── backend/
│   │   └── snapshotManager.js  # Lógica de negócio
│   ├── preload/
│   │   └── preload.js       # Bridge segura entre processos
│   └── renderer/
│       ├── App.js           # Componente React principal
│       └── App.css          # Estilos da aplicação
├── public/
│   └── index.html           # HTML base
└── package.json             # Configurações e dependências
```

## Tecnologias Utilizadas

- **Electron** - Framework para aplicações desktop
- **React** - Interface de usuário
- **Node.js** - Backend e processamento
- **better-sqlite3** - Banco de dados local
- **archiver** - Compactação de arquivos
- **react-dropzone** - Funcionalidade drag & drop

## Build para Produção

Para gerar o executável do aplicativo:

```bash
npm run dist
```

Os arquivos serão gerados na pasta `dist/`:
- **macOS**: .dmg
- **Windows**: .exe (instalador NSIS)
- **Linux**: .AppImage

## Dados e Armazenamento

- **Snapshots**: Salvos em `~/Library/Application Support/duck-snap/snapshots/` (macOS)
- **Banco de dados**: SQLite local para metadados
- **Configurações**: Armazenadas no diretório de dados do usuário

## Contribuindo

Sinta-se à vontade para contribuir com melhorias! Algumas ideias:

- Adicionar suporte para mais formatos de compactação
- Implementar diff visual entre versões
- Adicionar notas/comentários aos snapshots
- Criar sistema de tags/categorias
- Implementar backup na nuvem

## Licença

MIT

## Autor

Felipe Penha

---

**Duck Snap** - Versionamento simples para projetos complexos! 🦆