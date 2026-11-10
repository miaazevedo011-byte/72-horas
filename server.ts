import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize server-side Gemini API client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Dynamic AI Narrative Event Endpoint
app.post('/api/narrative', async (req, res) => {
  try {
    const { roomName, hoursLeft, vitals, interactionType } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Serviço de IA indisponível (Chave GEMINI_API_KEY não configurada).',
        fallback: true,
      });
    }

    const systemInstruction = `Você é o narrador de um jogo de sobrevivência atmosférico 2D em estilo Graphic Novel / Nanquim chamado "72 Horas".
O jogador está preso em um abrigo militar cercado por ameaças misteriosas no escuro.
Gere um evento narrativo tenso, curto e imersivo em Português do Brasil com 2 escolhas táticas.
Suas respostas DEVEM ser estritamente em JSON compatível com o schema solicitado.`;

    const promptText = `Situação atual do jogador:
- Cômodo atual: ${roomName || 'Sala'}
- Horas restantes de resgate: ${Math.floor((hoursLeft || 72) / 3600)}h
- Status vitais: Água: ${vitals?.water ?? 80}%, Comida: ${vitals?.food ?? 80}%, Saúde: ${vitals?.health ?? 100}%, Estresse: ${vitals?.stress ?? 20}%
- Ação disparadora: Interação com ${interactionType || 'Rádio Transceptor'}

Gere um evento curto com título em caixa alta, descrição dramática e 2 opções de ação com consequências claras de vitais.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Título em caixa alta para o evento' },
            description: { type: Type.STRING, description: 'Descrição narrativa tensa de 2 a 3 frases' },
            choices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING, description: 'Texto da opção' },
                  outcomeText: { type: Type.STRING, description: 'Resultado da escolha' },
                  waterChange: { type: Type.INTEGER, description: 'Mudança na água (-20 a +20)' },
                  foodChange: { type: Type.INTEGER, description: 'Mudança na comida (-20 a +20)' },
                  healthChange: { type: Type.INTEGER, description: 'Mudança na saúde (-20 a +20)' },
                  stressChange: { type: Type.INTEGER, description: 'Mudança no estresse (-20 a +20)' },
                },
                required: ['id', 'text', 'outcomeText', 'waterChange', 'foodChange', 'healthChange', 'stressChange'],
              },
            },
          },
          required: ['title', 'description', 'choices'],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      return res.status(500).json({ error: 'Resposta da IA vazia', fallback: true });
    }

    const data = JSON.parse(textOutput);
    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Erro na API Narrative Gemini:', err);
    return res.status(500).json({
      error: err.message || 'Erro ao comunicar com a IA',
      fallback: true,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(
          url,
          `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>72 Horas - Sobrevivência Narrativa 2D</title>
    <meta name="description" content="Um jogo de sobrevivência narrativa 2D em estilo graphic novel nanquim onde você precisa sobreviver a 72 horas de cerco em um refúgio isolado." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-[#111319] text-[#e2e2ea] antialiased selection:bg-[#E5A93C] selection:text-[#111319]">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
        );
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  }

  app.listen(PORT, () => {
    console.log(`[72 HORAS SERVER] Servidor rodando na porta ${PORT}`);
  });
}

startServer();
