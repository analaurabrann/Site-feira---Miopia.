document.addEventListener('DOMContentLoaded', () => {
  // 1. AUMENTAR E DIMINUIR FONTE
  const btnIncrease = document.getElementById('btn-increase-font');
  const btnDecrease = document.getElementById('btn-decrease-font');
  let currentFontSize = 16;

  btnIncrease.addEventListener('click', () => {
    if (currentFontSize < 24) {
      currentFontSize += 2;
      document.documentElement.style.setProperty('--font-size-base', `${currentFontSize}px`);
    }
  });

  btnDecrease.addEventListener('click', () => {
    if (currentFontSize > 12) {
      currentFontSize -= 2;
      document.documentElement.style.setProperty('--font-size-base', `${currentFontSize}px`);
    }
  });

  // 2. ALTO CONTRASTE
  const btnContrast = document.getElementById('btn-contrast');
  btnContrast.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
  });

  // 3. LEITURA EM VOZ ALTA (VOZ FEMININA EM PT-BR)
  const btnTTS = document.getElementById('btn-tts');
  let isSpeaking = false;
  let femalePortugueseVoice = null;

  function loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    
    // Filtra primeiro todas as vozes em Português do Brasil
    const ptVoices = voices.filter(voice => 
      voice.lang.includes('pt-BR') || voice.lang.includes('pt_BR') || voice.lang.startsWith('pt')
    );

    // Busca por nomes comuns de vozes femininas ou marcações do sistema
    femalePortugueseVoice = ptVoices.find(voice => 
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('fernanda') ||
      voice.name.toLowerCase().includes('francisca') ||
      voice.name.toLowerCase().includes('helena') ||
      voice.name.toLowerCase().includes('maria') ||
      voice.name.toLowerCase().includes('google') // A voz padrão do Google PT-BR é feminina
    ) || ptVoices[0]; // Fallback para qualquer voz PT caso não encontre o nome específico
  }

  loadVoices();
  if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  btnTTS.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      alert('Desculpe, seu navegador não suporta a função de leitura em voz alta.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      btnTTS.innerHTML = '🔊 Leitura em Voz Alta';
      return;
    }

    const mainContent = document.getElementById('main-content');
    const textToRead = mainContent ? mainContent.innerText : '';

    if (!textToRead) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;

    if (femalePortugueseVoice) {
      utterance.voice = femalePortugueseVoice;
    }

    utterance.onend = () => {
      isSpeaking = false;
      btnTTS.innerHTML = '🔊 Leitura em Voz Alta';
    };

    utterance.onerror = () => {
      isSpeaking = false;
      btnTTS.innerHTML = '🔊 Leitura em Voz Alta';
    };

    window.speechSynthesis.speak(utterance);
    isSpeaking = true;
    btnTTS.innerHTML = '⏹️ Parar Leitura';
  });
});