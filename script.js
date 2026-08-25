document.addEventListener('DOMContentLoaded', () => {
  // 1. AUMENTAR E DIMINUIR FONTE
  const btnIncrease = document.getElementById('btn-increase-font');
  const btnDecrease = document.getElementById('btn-decrease-font');
  let currentFontSize = 16; // tamanho base em px

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

  // 3. LEITURA EM VOZ ALTA (Web Speech API)
  const btnTTS = document.getElementById('btn-tts');
  let isSpeaking = false;

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

    // Lê todo o conteúdo textual do elemento principal (#main-content)
    const mainContent = document.getElementById('main-content');
    const textToRead = mainContent.innerText;

    if (!textToRead) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;

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