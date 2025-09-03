# DuckSnap 🦆

Aplicativo desktop para criar snapshots versionados de projetos locais - Uma alternativa simples ao Git para projetos em desenvolvimento inicial.

![DuckSnap Screenshot](./assets/screenshot.png)

## Funcionalidades

- **Drag & Drop** - Arraste pastas para criar snapshots instantâneos
- **Versionamento automático** - Sugestão inteligente de versões
- **Comparação de versões** - Compare tamanho e arquivos entre snapshots
- **Exportação em lote** - Exporte todos os snapshots de um projeto

## Instalação

```bash
# Clone o repositório
git clone https://github.com/loyfus/duckSnap.git
cd duckSnap

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev
```

## Como usar

1. **Criar Snapshot**: Arraste uma pasta ou clique para selecionar
2. **Gerenciar**: Visualize, compare e exclua snapshots na interface
3. **Exportar**: Selecione um projeto e exporte todos os snapshots

## Tecnologias

- Electron + React
- SQLite (better-sqlite3)
- Tailwind CSS
- Archiver para compactação

## Build

```bash
npm run dist  # Gera executável para sua plataforma
```

## Licença

MIT