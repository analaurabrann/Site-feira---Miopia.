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

  // 3. LEITURA EM VOZ ALTA COM SELEÇÃO DE VOZ TRADICIONAL/PADRÃO
  const btnTTS = document.getElementById('btn-tts');
  let isSpeaking = false;
  let portugueseVoice = null;

  // Função para carregar a melhor voz em PT-BR disponível no navegador
  function loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    // Procura por vozes do Google ou nativas em português do Brasil
    portugueseVoice = voices.find(voice => 
      voice.lang.includes('pt-BR') || voice.lang.includes('pt_BR')
    ) || voices.find(voice => voice.lang.startsWith('pt'));
  }

  // Carrega as vozes (alguns navegadores carregam de forma assíncrona)
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
    utterance.rate = 1.0; // Velocidade da fala

    // Define a voz localizada caso encontrada
    if (portugueseVoice) {
      utterance.voice = portugueseVoice;
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