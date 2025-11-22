// Sistema de respostas da IA (MVP com respostas fixas, depois conectar à API)
import { 
  MoodType, 
  PriorityType, 
  ConcernType, 
  DayRatingType, 
  AIResponse,
  UserProfile 
} from './types';

// Respostas da manhã
export const getMorningAdvice = (
  mood: MoodType,
  priority: PriorityType,
  profile: UserProfile
): AIResponse => {
  const adviceMap: Record<MoodType, Record<PriorityType, AIResponse>> = {
    tired: {
      work: {
        advice: "Começa devagar hoje. A tua energia vai aumentar ao longo do dia.",
        action: "Escolhe apenas 2 tarefas importantes e aceita que o resto pode esperar.",
      },
      family: {
        advice: "Mesmo cansado, pequenos gestos fazem diferença para quem amas.",
        action: "Envia uma mensagem carinhosa a alguém especial hoje.",
      },
      money: {
        advice: "Decisões financeiras importantes podem esperar. Descansa primeiro.",
        action: "Revê apenas o essencial das tuas finanças hoje.",
      },
      health: {
        advice: "O teu corpo está a pedir descanso. Ouve-o.",
        action: "Bebe água, faz pausas e dorme cedo hoje.",
      },
      relationship: {
        advice: "Relações precisam de energia. Cuida de ti primeiro.",
        action: "Comunica como te sentes e pede compreensão.",
      },
    },
    ok: {
      work: {
        advice: "Estás num bom ponto de equilíbrio. Aproveita!",
        action: "Foca-te nas tarefas que exigem mais concentração agora.",
      },
      family: {
        advice: "É um bom dia para estar presente com quem importa.",
        action: "Planeia um momento de qualidade com a família hoje.",
      },
      money: {
        advice: "Momento neutro é bom para decisões financeiras equilibradas.",
        action: "Revê um objetivo financeiro e dá um pequeno passo.",
      },
      health: {
        advice: "Mantém o ritmo. Consistência é a chave.",
        action: "Faz pelo menos 20 minutos de movimento hoje.",
      },
      relationship: {
        advice: "Relações florescem com atenção constante.",
        action: "Pergunta a alguém especial como está o dia dele.",
      },
    },
    motivated: {
      work: {
        advice: "Aproveita esta energia! É o momento perfeito para avançar.",
        action: "Ataca aquela tarefa que tens adiado há dias.",
      },
      family: {
        advice: "A tua energia positiva contagia quem está à tua volta.",
        action: "Surpreende alguém da família com um gesto especial.",
      },
      money: {
        advice: "Motivação é ótima, mas mantém os pés no chão nas finanças.",
        action: "Pesquisa uma forma de aumentar os teus rendimentos.",
      },
      health: {
        advice: "Este é o dia perfeito para desafiar-te fisicamente!",
        action: "Experimenta um treino mais intenso ou uma nova atividade.",
      },
      relationship: {
        advice: "Usa esta energia para fortalecer as tuas relações.",
        action: "Planeia algo especial para fazer com alguém que amas.",
      },
    },
    down: {
      work: {
        advice: "Dias difíceis fazem parte. Sê gentil contigo mesmo.",
        action: "Faz apenas o essencial hoje. Amanhã será melhor.",
      },
      family: {
        advice: "Está tudo bem não estar bem. A família entende.",
        action: "Partilha como te sentes com alguém de confiança.",
      },
      money: {
        advice: "Não tomes decisões financeiras importantes quando estás em baixo.",
        action: "Adia decisões importantes. Foca-te em estabilizar primeiro.",
      },
      health: {
        advice: "A saúde mental é tão importante quanto a física.",
        action: "Faz algo que te acalme: caminha, respira, descansa.",
      },
      relationship: {
        advice: "Vulnerabilidade fortalece relações verdadeiras.",
        action: "Deixa alguém cuidar de ti hoje. Aceita ajuda.",
      },
    },
  };

  const response = adviceMap[mood][priority];
  
  // Adicionar prompt Suno se o utilizador quiser
  if (profile.wantsSunoPrompts) {
    const sunoPrompts: Record<MoodType, string> = {
      tired: "Cria uma música suave e relaxante, estilo lo-fi, para começar o dia com calma",
      ok: "Cria uma música equilibrada e positiva, estilo pop acústico, para manter o foco",
      motivated: "Cria uma música energética e inspiradora, estilo pop/rock, para potenciar a motivação",
      down: "Cria uma música reconfortante e esperançosa, estilo balada suave, para acolher as emoções",
    };
    response.sunoPrompt = sunoPrompts[mood];
  }

  return response;
};

// Respostas da tarde
export const getAfternoonSuggestion = (
  concern: ConcernType,
  dayRating: number,
  profile: UserProfile
): AIResponse => {
  const suggestions: Record<ConcernType, (rating: number) => AIResponse> = {
    dinner: (rating) => {
      const foods = profile.foodPreferences;
      const isGoodDay = rating >= 6;
      
      if (foods.includes('saudável') && isGoodDay) {
        return {
          advice: "O dia está a correr bem! Mantém a energia com algo nutritivo.",
          suggestion: "Que tal um salmão grelhado com legumes assados e quinoa? Simples e delicioso.",
        };
      } else if (foods.includes('fast food') && !isGoodDay) {
        return {
          advice: "Dias difíceis pedem conforto. Está tudo bem.",
          suggestion: "Um hambúrguer caseiro ou uma pizza pode ser exatamente o que precisas hoje.",
        };
      } else if (foods.includes('massa')) {
        return {
          advice: "Massa é sempre uma boa escolha!",
          suggestion: "Esparguete à carbonara ou penne ao pesto. Rápido e reconfortante.",
        };
      } else if (foods.includes('sushi')) {
        return {
          advice: "Sushi é uma excelente opção equilibrada.",
          suggestion: "Pede um combinado variado ou faz temaki em casa - é mais fácil do que parece!",
        };
      }
      
      return {
        advice: "Escolhe algo que te faça sentir bem.",
        suggestion: "Um prato que gostes, feito com calma. A comida também é autocuidado.",
      };
    },
    
    movie: (rating) => {
      const genres = profile.movieGenres;
      const isGoodDay = rating >= 6;
      
      if (isGoodDay && genres.includes('comédia')) {
        return {
          advice: "O dia está bom! Continua com algo leve e divertido.",
          suggestion: "Uma comédia romântica ou um stand-up comedy. Rir faz sempre bem!",
        };
      } else if (!isGoodDay && genres.includes('drama')) {
        return {
          advice: "Às vezes precisamos de algo que nos faça sentir compreendidos.",
          suggestion: "Um drama emocional pode ajudar a processar o dia. Escolhe algo que ressoe contigo.",
        };
      } else if (genres.includes('ação')) {
        return {
          advice: "Ação para desligar a mente!",
          suggestion: "Um filme de ação ou aventura para te transportar para outro mundo.",
        };
      } else if (genres.includes('romance')) {
        return {
          advice: "Romance para aquecer o coração.",
          suggestion: "Um romance que te faça acreditar no amor e nas conexões humanas.",
        };
      }
      
      return {
        advice: "Escolhe algo que te apeteça ver.",
        suggestion: "Segue a tua intuição. O melhor filme é aquele que te chama agora.",
      };
    },
    
    create: (rating) => {
      if (!profile.wantsSunoPrompts) {
        return {
          advice: "Criar é uma forma poderosa de expressar o que sentes.",
          suggestion: "Escreve, desenha, fotografa... deixa a criatividade fluir sem julgamento.",
        };
      }
      
      const musicStyles = profile.musicStyles;
      const isGoodDay = rating >= 6;
      
      if (isGoodDay && musicStyles.includes('pop')) {
        return {
          advice: "Canaliza esta energia positiva para criar!",
          suggestion: "Cria algo alegre e dançante.",
          sunoPrompt: `Cria uma música pop alegre e dançante, com batida contagiante, sobre aproveitar os bons momentos da vida`,
        };
      } else if (!isGoodDay && musicStyles.includes('gospel')) {
        return {
          advice: "A música pode ser cura e esperança.",
          suggestion: "Cria algo que te reconforte espiritualmente.",
          sunoPrompt: `Cria uma música gospel reconfortante e esperançosa, com mensagem de fé e superação`,
        };
      } else if (musicStyles.includes('kizomba')) {
        return {
          advice: "Deixa o ritmo guiar as tuas emoções.",
          suggestion: "Cria algo sensual e envolvente.",
          sunoPrompt: `Cria uma kizomba suave e sensual, com batida envolvente, sobre conexão e sentimentos`,
        };
      }
      
      return {
        advice: "Expressa o que sentes através da música.",
        suggestion: "Cria algo autêntico, que reflita o teu momento atual.",
        sunoPrompt: `Cria uma música que expresse os sentimentos de hoje, autêntica e pessoal`,
      };
    },
    
    advice: (rating) => {
      if (rating >= 8) {
        return {
          advice: "O dia está ótimo! Aproveita este momento.",
          action: "Guarda esta sensação. Lembra-te dela nos dias mais difíceis.",
        };
      } else if (rating >= 5) {
        return {
          advice: "Está a ser um dia normal, e isso é perfeitamente ok.",
          action: "Faz uma pausa, respira fundo e reconhece o que já conquistaste hoje.",
        };
      } else {
        return {
          advice: "Dias difíceis são temporários. Amanhã é um novo começo.",
          action: "Sê gentil contigo. Faz algo pequeno que te traga conforto agora.",
        };
      }
    },
  };

  return suggestions[concern](dayRating);
};

// Respostas da noite
export const getNightReflection = (
  dayComparison: DayRatingType,
  didSomethingGood: boolean,
  profile: UserProfile
): AIResponse => {
  const reflections: Record<DayRatingType, Record<string, AIResponse>> = {
    better: {
      yes: {
        advice: "Que dia incrível! Fizeste bem por ti e o dia superou as expectativas. Celebra estas vitórias, por mais pequenas que pareçam.",
        action: "Antes de dormir, escreve 3 coisas boas que aconteceram hoje. Vais dormir com o coração mais leve.",
      },
      no: {
        advice: "O dia foi melhor que esperavas, mas sentes que podias ter feito mais por ti. Está tudo bem. Amanhã é uma nova oportunidade.",
        action: "Perdoa-te. Reconhece o que correu bem e descansa. Amanhã cuidas melhor de ti.",
      },
    },
    same: {
      yes: {
        advice: "O dia foi como esperavas e ainda assim cuidaste de ti. Isso é consistência e merece reconhecimento.",
        action: "A consistência constrói grandes mudanças. Continua assim, um dia de cada vez.",
      },
      no: {
        advice: "Foi um dia normal, mas sentes que te esqueceste de ti. Acontece a todos nós.",
        action: "Faz algo pequeno por ti agora: um chá, uma música que gostes, 5 minutos de silêncio. Conta como autocuidado.",
      },
    },
    worse: {
      yes: {
        advice: "O dia foi difícil, mas fizeste algo bom por ti. Isso mostra força e autocuidado mesmo na adversidade.",
        action: "Orgulha-te de teres cuidado de ti num dia difícil. Isso é coragem. Descansa agora.",
      },
      no: {
        advice: "Foi um dia difícil e sentes que não cuidaste de ti. Respira. Estás a fazer o melhor que podes.",
        action: "Amanhã é um novo dia. Por agora, descansa. O simples facto de chegares ao fim do dia já é uma vitória.",
      },
    },
  };

  const key = didSomethingGood ? 'yes' : 'no';
  const response = reflections[dayComparison][key];

  // Adicionar sugestão de música calma se o utilizador quiser
  if (profile.wantsSunoPrompts && profile.musicStyles.length > 0) {
    response.sunoPrompt = "Cria uma música calma e introspectiva para relaxar antes de dormir, estilo ambient/lo-fi";
  }

  return response;
};
