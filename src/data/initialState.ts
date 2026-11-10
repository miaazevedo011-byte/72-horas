import { Room, InteractiveObject, Item, Recipe, StoryEvent, JournalEntry, Vitals } from '../types/game';

export const INITIAL_VITALS: Vitals = {
  water: 85,
  food: 75,
  health: 100,
  stress: 20,
};

export const TOTAL_SURVIVAL_SECONDS = 72 * 3600; // 72 horas em segundos (259200s)

export const ROOMS: Room[] = [
  {
    id: 'quarto',
    name: 'QUARTO DE DORMIR',
    shortName: 'Quarto',
    color: '#E5A93C',
    bounds: { x: 20, y: 20, width: 240, height: 260 },
    description: 'Seu refúgio pessoal. Uma cama simples e uma escrivaninha de madeira rangente.'
  },
  {
    id: 'sala',
    name: 'SALA DE ESTAR',
    shortName: 'Sala',
    color: '#4A90E2',
    bounds: { x: 280, y: 20, width: 240, height: 260 },
    description: 'O centro do abrigo. Janelas reforçadas e o único rádio de comunicação.'
  },
  {
    id: 'cozinha',
    name: 'COZINHA E DESPENSA',
    shortName: 'Cozinha',
    color: '#48BB78',
    bounds: { x: 540, y: 20, width: 240, height: 260 },
    description: 'Estoque de mantimentos e utensílios básicos de sobrevivência.'
  },
  {
    id: 'banheiro',
    name: 'BANHEIRO E SANITÁRIO',
    shortName: 'Banheiro',
    color: '#a4c9ff',
    bounds: { x: 20, y: 300, width: 240, height: 280 },
    description: 'Reservatório secundário de água e armário de primeiros socorros.'
  },
  {
    id: 'oficina',
    name: 'OFICINA E SAÍDA',
    shortName: 'Oficina',
    color: '#F4C458',
    bounds: { x: 280, y: 300, width: 240, height: 280 },
    description: 'Bancada de trabalho pesada, gerador elétrico e a porta blindada principal.'
  },
  {
    id: 'porao',
    name: 'PORÃO E DEPOSITO',
    shortName: 'Porão',
    color: '#D64045',
    bounds: { x: 540, y: 300, width: 240, height: 280 },
    description: 'Área subterrânea fria. Guarda caixas de suprimentos e o cofre de segurança.'
  }
];

export const INITIAL_OBJECTS: InteractiveObject[] = [
  {
    id: 'cama',
    name: 'Cama de Solteiro',
    roomId: 'quarto',
    x: 40,
    y: 50,
    width: 80,
    height: 110,
    iconName: 'Bed',
    actionText: 'Descansar / Dormir',
    color: '#E5A93C',
    type: 'rest',
    timesInteracted: 0
  },
  {
    id: 'diario_mesa',
    name: 'Escrivaninha e Diário',
    roomId: 'quarto',
    x: 150,
    y: 50,
    width: 85,
    height: 65,
    iconName: 'BookOpen',
    actionText: 'Escrever no Diário',
    color: '#4A90E2',
    type: 'journal',
    timesInteracted: 0
  },
  {
    id: 'armario_quarto',
    name: 'Armário de Madeira',
    roomId: 'quarto',
    x: 150,
    y: 160,
    width: 80,
    height: 90,
    iconName: 'Archive',
    actionText: 'Procurar Roupas e Panos',
    color: '#9d8f7c',
    type: 'search',
    timesInteracted: 0
  },
  {
    id: 'janela_barricada',
    name: 'Janela Fortificada',
    roomId: 'sala',
    x: 340,
    y: 30,
    width: 120,
    height: 40,
    iconName: 'Eye',
    actionText: 'Observar o Exterior',
    color: '#D64045',
    type: 'search',
    timesInteracted: 0
  },
  {
    id: 'radio_transceptor',
    name: 'Rádio Transceptor Mil-Spec',
    roomId: 'sala',
    x: 440,
    y: 130,
    width: 65,
    height: 55,
    iconName: 'Radio',
    actionText: 'Sintonizar Frequências',
    color: '#4A90E2',
    type: 'radio',
    timesInteracted: 0
  },
  {
    id: 'sofa_sala',
    name: 'Sofá de Couro Rasgado',
    roomId: 'sala',
    x: 300,
    y: 130,
    width: 100,
    height: 70,
    iconName: 'Armchair',
    actionText: 'Sentar e Acalmar a Mente',
    color: '#E5A93C',
    type: 'rest',
    timesInteracted: 0
  },
  {
    id: 'geladeira',
    name: 'Geladeira Antiga',
    roomId: 'cozinha',
    x: 560,
    y: 50,
    width: 70,
    height: 95,
    iconName: 'Refrigerator',
    actionText: 'Buscar Alimentos',
    color: '#48BB78',
    type: 'food',
    timesInteracted: 0
  },
  {
    id: 'despensa_fogao',
    name: 'Despensa e Armários',
    roomId: 'cozinha',
    x: 650,
    y: 50,
    width: 110,
    height: 75,
    iconName: 'Utensils',
    actionText: 'Vasculhar Alimentos Secos',
    color: '#48BB78',
    type: 'search',
    timesInteracted: 0
  },
  {
    id: 'filtro_agua',
    name: 'Filtro e Pia de Água',
    roomId: 'banheiro',
    x: 40,
    y: 330,
    width: 70,
    height: 70,
    iconName: 'Droplet',
    actionText: 'Beber / Filtrar Água',
    color: '#4A90E2',
    type: 'water',
    timesInteracted: 0
  },
  {
    id: 'kit_medico',
    name: 'Armário de Socorros',
    roomId: 'banheiro',
    x: 160,
    y: 330,
    width: 70,
    height: 60,
    iconName: 'HeartPulse',
    actionText: 'Pegar Medicamentos',
    color: '#48BB78',
    type: 'search',
    timesInteracted: 0
  },
  {
    id: 'bancada_trabalho',
    name: 'Bancada de Ferramentas',
    roomId: 'oficina',
    x: 300,
    y: 330,
    width: 115,
    height: 75,
    iconName: 'Wrench',
    actionText: 'Fabricar Itens / Barricadas',
    color: '#F4C458',
    type: 'craft',
    timesInteracted: 0
  },
  {
    id: 'gerador_eletrico',
    name: 'Gerador a Combustível',
    roomId: 'oficina',
    x: 440,
    y: 330,
    width: 70,
    height: 75,
    iconName: 'Zap',
    actionText: 'Operar Gerador',
    color: '#E5A93C',
    type: 'generator',
    timesInteracted: 0
  },
  {
    id: 'porta_blindada',
    name: 'Porta Principal Blindada',
    roomId: 'oficina',
    x: 360,
    y: 535,
    width: 85,
    height: 35,
    iconName: 'Shield',
    actionText: 'Reforçar Trancas',
    color: '#D64045',
    type: 'door',
    timesInteracted: 0
  },
  {
    id: 'caixa_mantimentos',
    name: 'Caixas de Madeira do Porão',
    roomId: 'porao',
    x: 560,
    y: 330,
    width: 90,
    height: 80,
    iconName: 'Package',
    actionText: 'Abrir Caixas Lacradas',
    color: '#9d8f7c',
    type: 'search',
    timesInteracted: 0
  },
  {
    id: 'cofre_antigo',
    name: 'Cofre de Aço Trancado',
    roomId: 'porao',
    x: 670,
    y: 330,
    width: 75,
    height: 75,
    iconName: 'Lock',
    actionText: 'Tentar Segredo do Cofre',
    color: '#D64045',
    type: 'safe',
    timesInteracted: 0
  }
];

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'garrafa_agua',
    name: 'Garrafa de Água Mineral',
    description: 'Água limpa e lacrada. Recupera 30 de hidratação.',
    category: 'water',
    quantity: 3,
    iconName: 'Droplet',
    usable: true,
    vitalsRestore: { water: 30, stress: -5 }
  },
  {
    id: 'lata_comida',
    name: 'Ração de Combate em Lata',
    description: 'Comida enlatada nutritiva. Recupera 35 de alimento.',
    category: 'food',
    quantity: 3,
    iconName: 'Utensils',
    usable: true,
    vitalsRestore: { food: 35, health: 5 }
  },
  {
    id: 'kit_gaze',
    name: 'Gaze e Antisséptico',
    description: 'Material médico básico. Recupera 25 de saúde e reduz estresse.',
    category: 'medical',
    quantity: 1,
    iconName: 'Heart',
    usable: true,
    vitalsRestore: { health: 25, stress: -10 }
  },
  {
    id: 'lanterna',
    name: 'Lanterna Tática',
    description: 'Funciona com pilhas. Ajuda na exploração do porão e reduz pânico.',
    category: 'tool',
    quantity: 1,
    iconName: 'Sun',
    usable: false
  },
  {
    id: 'sucata_metal',
    name: 'Sucata e Pregos',
    description: 'Usado na bancada para fabricar reforços e barricadas.',
    category: 'crafting',
    quantity: 4,
    iconName: 'Wrench',
    usable: false
  },
  {
    id: 'pilhas_aa',
    name: 'Pilhas AA Recarregáveis',
    description: 'Necessárias para manter o rádio funcionando em frequências longas.',
    category: 'crafting',
    quantity: 2,
    iconName: 'Battery',
    usable: false
  }
];

export const CRAFTING_RECIPES: Recipe[] = [
  {
    id: 'barricada_reforcada',
    name: 'Reforço de Barricada',
    resultItemId: 'reforco_madeira',
    resultQty: 1,
    description: 'Um painel de madeira e metal para blindar portas e janelas contra invasões.',
    ingredients: [
      { itemId: 'sucata_metal', qty: 2 }
    ]
  },
  {
    id: 'filtro_caseiro',
    name: 'Filtro Purificador',
    resultItemId: 'filtro_carvao',
    resultQty: 1,
    description: 'Filtro de carvão ativado para purificar água suja da chuva.',
    ingredients: [
      { itemId: 'sucata_metal', qty: 1 },
      { itemId: 'pilhas_aa', qty: 1 }
    ]
  },
  {
    id: 'kit_primeiros_socorros',
    name: 'Atadura Médica',
    resultItemId: 'kit_gaze',
    resultQty: 1,
    description: 'Combina panos limpos e antisséptico para tratar ferimentos.',
    ingredients: [
      { itemId: 'sucata_metal', qty: 1 }
    ]
  }
];

export const SCRIPTED_EVENTS: StoryEvent[] = [
  {
    id: 'ev_inicio_cerco',
    title: 'ALERTA DE SEGURANÇA — O CERCO COMEÇOU',
    timestamp: '72:00:00',
    triggerSecondsLeft: 72 * 3600 - 10, // dispara no início
    description: 'As sirenes da cidade cessaram repentinamente. No rádio, apenas estática e uma transmissão militar interrompida: "Seja quem estiver ouvindo... feche tudo. Não abra para ninguém nos próximos três dias." Você está trancado dentro do refúgio. O relógio de 72 horas começou a rodar.',
    choices: [
      {
        id: 'c1_1',
        text: 'Conferir trancas das portas e janelas imediatamente',
        outcomeText: 'Você reforça as trancas principais. A sensação de segurança acalma seu pulso acelerado.',
        vitalsChange: { stress: -10, health: 0 },
        objectiveUpdate: 'Vasculhe os cômodos para encontrar comida, água e pilhas para o rádio.'
      },
      {
        id: 'c1_2',
        text: 'Tentar sintonizar o rádio em busca de mais informações',
        outcomeText: 'Você capta a frequência governamental emergency 104.9 MHz. Um resgate está previsto para daqui a 72 horas.',
        vitalsChange: { stress: -5 },
        objectiveUpdate: 'Racionar suprimentos até a chegada do resgate militar.'
      }
    ],
    triggered: false
  },
  {
    id: 'ev_hora_60_ruido',
    title: 'PASSOS NO TELHADO — HORA 60',
    timestamp: '60:00:00',
    triggerSecondsLeft: 60 * 3600,
    description: 'Um rangido metálico ecoa sobre a estrutura do teto. Algo ou alguém está se movendo acima de você no silêncio da noite. Seu coração dispara enquanto poeira cai sobre a sala de estar.',
    choices: [
      {
        id: 'c2_1',
        text: 'Ficar em silêncio absoluto no quarto e aguardar passar',
        outcomeText: 'Os passos continuam por alguns minutos excruciantes e depois somem na escuridão. Seu estresse aumentou pelo suspense.',
        vitalsChange: { stress: 15 },
        objectiveUpdate: 'Manter a vigilância e economizar energia.'
      },
      {
        id: 'c2_2',
        text: 'Bater com um cano de ferro no teto para assustar o invasor',
        outcomeText: 'O som estrondoso faz quem quer que fosse sair correndo pelo telhado! Você evitou um arrombamento, mas ficou exausto.',
        vitalsChange: { stress: -5, food: -5 },
        objectiveUpdate: 'Inspecionar as portas para garantir que ninguém desceu.'
      }
    ],
    triggered: false
  },
  {
    id: 'ev_hora_48_tempestade',
    title: 'TEMPESTADE TÓXICA E CORTE DE ENERGIA — HORA 48',
    timestamp: '48:00:00',
    triggerSecondsLeft: 48 * 3600,
    description: 'Uma tempestade violenta atinge a região com ventos cortantes. As luzes do abrigo piscam e apagam completamente. O gerador na oficina começou a chiar e soltar fumaça!',
    choices: [
      {
        id: 'c3_1',
        text: 'Ir à oficina imediatamente consertar o gerador',
        outcomeText: 'Você consegue religar a energia antes do frio congelante afetar a casa, mas consumiu parte dos seus recursos.',
        vitalsChange: { stress: 5, health: 5 },
        itemReward: { itemId: 'sucata_metal', qty: 1, name: 'Sucata extra' },
        objectiveUpdate: 'Verifique se há filtros de água e alimentos na cozinha.'
      },
      {
        id: 'c3_2',
        text: 'Permanecer na escuridão usando a lanterna para economizar combustível',
        outcomeText: 'A escuridão é opressiva e assustadora. Você ouve o vento uivando pelas frestas.',
        vitalsChange: { stress: 20, water: -10 }
      }
    ],
    triggered: false
  },
  {
    id: 'ev_hora_24_batida_porta',
    title: 'BATIDAS DESESPERADAS NA PORTA — HORA 24',
    timestamp: '24:00:00',
    triggerSecondsLeft: 24 * 3600,
    description: 'Uma voz feminina sufocada implora do outro lado da porta blindada: "Por favor! Tem algo lá fora! Me deixa entrar, eu tenho mantimentos para trocar!" Você vê pelo olho mágico uma mulher ferida segurando uma caixa.',
    choices: [
      {
        id: 'c4_1',
        text: 'Abrir uma fresta com cuidado e ajudar a mulher',
        outcomeText: 'Ela entra trêmula e divide uma lata de ração e gaze com você antes de desmaiar num canto. Uma boa ação que renovou sua esperança.',
        vitalsChange: { stress: -15, health: 10 },
        itemReward: { itemId: 'garrafa_agua', qty: 2, name: 'Garrafas de Água' },
        objectiveUpdate: 'Apenas 24 horas restantes! Aguarde a frequência final do rádio.'
      },
      {
        id: 'c4_2',
        text: 'Manter a porta trancada por precaução e falar pelo interfone',
        outcomeText: 'Você diz a ela para se esconder no beco. Ela deixa a caixa na entrada e foge. Você resgata a caixa mais tarde sem correr perigo direto.',
        vitalsChange: { stress: 10 },
        itemReward: { itemId: 'lata_comida', qty: 1, name: 'Lata de Comida' }
      }
    ],
    triggered: false
  },
  {
    id: 'ev_hora_12_frequencia_final',
    title: 'TRANSMISSÃO DE RESGATE DE EMERGÊNCIA — HORA 12',
    timestamp: '12:00:00',
    triggerSecondsLeft: 12 * 3600,
    description: 'O rádio acende com uma luz vermelha pulsante! A voz do Comandante de Operações soa clara: "Atenção sobreviventes no quadrante 7. O helicóptero de evacuação pousará no teto do setor em exatamente 12 horas. Preparem o sinalizador visual!"',
    choices: [
      {
        id: 'c5_1',
        text: 'Fabricar sinalizador na bancada de trabalho',
        outcomeText: 'Você prepara tudo para garantir que o helicóptero o aviste no escuro.',
        vitalsChange: { stress: -20 },
        objectiveUpdate: 'SOBREVIVA AS ÚLTIMAS 12 HORAS ATÉ A CHEGADA DO HELICÓPTERO!'
      },
      {
        id: 'c5_2',
        text: 'Racionar a última água e descansar para estar forte na evacuação',
        outcomeText: 'Você descansa o corpo desgastado e ganha vigor vital para a corrida final.',
        vitalsChange: { health: 15, stress: -10 }
      }
    ],
    triggered: false
  }
];

export const INITIAL_JOURNAL_LOGS: JournalEntry[] = [
  {
    id: 'log_0',
    timestamp: '72:00:00',
    title: 'DIÁRIO DO SOBREVIVENTE - ENTRADA #01',
    content: 'O cerco começou. As autoridades isolaram o perímetro da cidade. Estou preso no refúgio blindado com suprimentos limitados para 72 horas. Meu objetivo é um só: manter a sanidade, economizar água e comida e chegar vivo até a evacuação.',
    category: 'journal'
  },
  {
    id: 'log_radio_1',
    timestamp: '71:45:00',
    title: 'RECEPTOR MIL-SPEC - FREQUÊNCIA 104.9 MHz',
    content: 'CHAMADA DE EMERGÊNCIA MILITAR: Manter portas trancadas. Não usar luzes externas. Equipe de resgate enviada em comboio com rota de fuga aérea em 72h.',
    category: 'radio'
  }
];
