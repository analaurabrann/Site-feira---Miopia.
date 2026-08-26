document.addEventListener('DOMContentLoaded', () => {
  // 1. CONTROLE DE TAMANHO DA FONTE (A+ / A-)
  const btnIncrease = document.getElementById('btn-increase-font');
  const btnDecrease = document.getElementById('btn-decrease-font');
  let currentFontSize = 16;

  if (btnIncrease) {
    btnIncrease.addEventListener('click', () => {
      if (currentFontSize < 24) {
        currentFontSize += 2;
        document.documentElement.style.setProperty('--font-size-base', `${currentFontSize}px`);
      }
    });
  }

  if (btnDecrease) {
    btnDecrease.addEventListener('click', () => {
      if (currentFontSize > 12) {
        currentFontSize -= 2;
        document.documentElement.style.setProperty('--font-size-base', `${currentFontSize}px`);
      }
    });
  }

  // 2. ALTERNAR ALTO CONTRASTE
  const btnContrast = document.getElementById('btn-contrast');
  if (btnContrast) {
    btnContrast.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
    });
  }

  // 3. LEITURA EM VOZ ALTA (SELEÇÃO DE VOZ FEMININA PT-BR)
  const btnTTS = document.getElementById('btn-tts');
  let isSpeaking = false;
  let selectedFemaleVoice = null;

  function setFemaleVoice() {
    const voices = window.speechSynthesis.getVoices();
    
    // Filtra todas as vozes em Português do Brasil
    const ptVoices = voices.filter(voice => 
      voice.lang.includes('pt-BR') || voice.lang.includes('pt_BR') || voice.lang.startsWith('pt')
    );

    if (ptVoices.length === 0) return;

    // Prioriza vozes com nomes femininos conhecidos do sistema/navegador
    selectedFemaleVoice = ptVoices.find(voice => {
      const name = voice.name.toLowerCase();
      return (
        name.includes('female') ||
        name.includes('fernanda') ||
        name.includes('francisca') ||
        name.includes('helena') ||
        name.includes('maria') ||
        name.includes('luciana') ||
        name.includes('vitoria') ||
        name.includes('google português do brasil') // Voz nativa feminina do Chrome
      );
    }) || ptVoices[0]; // Fallback para a primeira voz PT-BR disponível
  }

  // Carrega as vozes (compatível com o evento assíncrono dos navegadores)
  setFemaleVoice();
  if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = setFemaleVoice;
  }

  if (btnTTS) {
    btnTTS.addEventListener('click', () => {
      if (!('speechSynthesis' in window)) {
        alert('Desculpe, seu navegador não suporta a função de leitura em voz alta.');
        return;
      }

      // Se já estiver lendo, para a leitura
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
      utterance.rate = 1.0; // Velocidade de fala padrão

      // Aplica a voz feminina selecionada
      if (selectedFemaleVoice) {
        utterance.voice = selectedFemaleVoice;
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
  }
});