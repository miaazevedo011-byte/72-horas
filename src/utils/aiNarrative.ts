import { StoryEvent, Vitals, RoomId } from '../types/game';

export async function generateAINarrativeEvent(
  roomName: string,
  hoursLeft: number,
  vitals: Vitals,
  interactionType: string
): Promise<Partial<StoryEvent> | null> {
  try {
    const response = await fetch('/api/narrative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomName,
        hoursLeft,
        vitals,
        interactionType,
      }),
    });

    if (!response.ok) {
      console.warn('API de narrativa Gemini indisponível, usando eventos pré-programados.');
      return null;
    }

    const json = await response.json();
    if (json.success && json.data) {
      const data = json.data;
      const hoursFormatted = Math.floor(hoursLeft / 3600);
      const minutesFormatted = Math.floor((hoursLeft % 3600) / 60);
      const secondsFormatted = Math.floor(hoursLeft % 60);

      const timestampStr = `${String(hoursFormatted).padStart(2, '0')}:${String(minutesFormatted).padStart(2, '0')}:${String(secondsFormatted).padStart(2, '0')}`;

      return {
        id: `ai_ev_${Date.now()}`,
        title: data.title || 'TRANSMISSÃO DE FREQUÊNCIA DESCONHECIDA',
        timestamp: `HORA ${timestampStr}`,
        description: data.description || 'Uma mensagem truncada é captada nas sombras do abrigo...',
        choices: (data.choices || []).map((c: any, index: number) => ({
          id: `ai_c_${index}`,
          text: c.text,
          outcomeText: c.outcomeText,
          vitalsChange: {
            water: c.waterChange || 0,
            food: c.foodChange || 0,
            health: c.healthChange || 0,
            stress: c.stressChange || 0,
          },
        })),
      };
    }
    return null;
  } catch (error) {
    console.warn('Erro ao conectar com API de IA, usando fallback:', error);
    return null;
  }
}
