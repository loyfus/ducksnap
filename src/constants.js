export const MESSAGES = {
  ERRORS: {
    FILL_FIELDS: 'Por favor, preencha todos os campos',
    CREATE_FAILED: 'Falha ao criar snapshot',
    DELETE_FAILED: 'Falha ao excluir snapshot',
    OPEN_FOLDER_FAILED: 'Falha ao abrir pasta',
    FILE_NOT_FOUND: 'Arquivo não encontrado',
    NOT_DIRECTORY: 'O caminho fornecido não é uma pasta válida'
  },
  SUCCESS: {
    SNAPSHOT_CREATED: 'Snapshot v{version} criado com sucesso!',
    SNAPSHOT_DELETED: 'Snapshot excluído com sucesso'
  },
  UI: {
    APP_SUBTITLE: 'Controle de Versões Profissional',
    CREATE_SNAPSHOT: 'Criar Novo Snapshot',
    SAVED_SNAPSHOTS: 'Snapshots Salvos',
    ALL_PROJECTS: 'Todos os Projetos',
    NO_SNAPSHOTS: 'Nenhum snapshot ainda',
    NO_SNAPSHOTS_HINT: 'Crie seu primeiro snapshot arrastando uma pasta acima',
    DRAG_ACTIVE: 'Solte a pasta aqui',
    DRAG_INACTIVE: 'Arraste uma pasta aqui',
    CLICK_TO_BROWSE: 'ou clique para selecionar',
    READY_TO_CREATE: 'Pronto para criar snapshot',
    PROJECT_NAME: 'Nome do Projeto',
    VERSION: 'Versão',
    CREATING: 'Criando...',
    CREATE_BUTTON: 'Criar Snapshot',
    OPEN: 'Abrir',
    FILES: 'arquivos'
  }
};

export const IGNORED_DIRECTORIES = [
  'node_modules',
  '.git', 
  'target',
  'dist',
  'build',
  '.idea',
  '.vscode',
  '__pycache__',
  '.pytest_cache',
  '.next',
  '.nuxt',
  'coverage',
  '.env'
];

export const DATE_FORMAT = {
  locale: 'pt-BR',
  options: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
};

export const NOTIFICATION_DURATION = 4000;

export const ANIMATION_CONFIG = {
  spring: { 
    type: "spring", 
    stiffness: 400, 
    damping: 10 
  },
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  },
  notification: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }
};