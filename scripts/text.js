(function () {
  const WIDTH = 420;
  const HEIGHT = 140;
  const PADDING = 12;
  const LOAD_DURATION = 3000;
  const TYPE_DELAY = 120;

  // styles
  const styleId = 'falling-console-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .falling-console {
        position: fixed;
        left: 20px;
        bottom: 20px;
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        padding: ${PADDING}px;
        background: rgba(0,0,0,0.55);
        color: #d6ffd6;
        font-family: "SFMono-Regular", "Menlo", "Monaco", "Roboto Mono", "Source Code Pro", monospace;
        font-size: 14px;
        line-height: 1.35;
        border-radius: 6px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.45);
        backdrop-filter: blur(2px);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        pointer-events: auto;
      }

      .falling-console .top-row { display:flex; gap:8px; align-items:center; }
      .falling-console .loader { color: #9fd; font-weight: 600; }
      .falling-console .message { margin-top:6px; min-height:40px; }
      .falling-console .cursor { display:inline-block; width:10px; background:transparent; animation: blink 1s steps(2,start) infinite; }

      @keyframes blink { to { background: transparent; } from { background: #d6ffd6; } }

      .falling-console .input-row { display:flex; align-items:center; gap:8px; }
      .falling-console .input-underline {
        border: none;
        border-bottom: 1px solid #9fd;
        background: transparent;
        color: #d6ffd6;
        outline: none;
        padding: 4px 6px;
        font-family: inherit;
        font-size: 14px;
        width: 100%;
      }

      .falling-console .hint { color: #9fb; font-size:12px; opacity:0.9 }
      .falling-console.faded { opacity: 0.08; transition: opacity 600ms ease; pointer-events:none }
    `;
    document.head.appendChild(style);
  }

  // terminal container
  const container = document.createElement('div');
  container.className = 'falling-console';
  container.setAttribute('aria-live', 'polite');

  container.innerHTML = `
    <div class="top-row">
      <div class="loader">connecting</div>
      <div class="hint">terminal <--> Houston</div>
    </div>
    <div class="message" aria-atomic="true"><span class="dots"></span><span class="cursor"> </span></div>
    <div class="input-row">
      <input class="input-underline" type="text" readonly value="1. yes 2. dont reply" />
    </div>
  `;

  // Insert into DOM
  document.body.appendChild(container);

  const dotsEl = container.querySelector('.dots');
  const messageEl = container.querySelector('.message');
  const inputEl = container.querySelector('.input-underline');
  const cursorEl = container.querySelector('.cursor');

  
  const pattern = ['.', '..', '...', '....'];
  let idx = 0;
  let loadingInterval;

  function startLoading() {
    dotsEl.textContent = pattern[idx];
    loadingInterval = setInterval(() => {
      idx = (idx + 1) % pattern.length;
      dotsEl.textContent = pattern[idx];
    }, 350);
  }

  function stopLoading() {
    clearInterval(loadingInterval);
    dotsEl.textContent = '';
  }

  // Typewriter
  function typeWords(text, onComplete) {
    const words = text.split(' ');
    messageEl.textContent = '';
    let i = 0;
    function nextWord() {
      if (i >= words.length) {
        messageEl.appendChild(cursorEl);
        if (onComplete) onComplete();
        return;
      }
      const word = words[i];
      const wordSpan = document.createElement('span');
      wordSpan.textContent = (i === 0 ? '' : ' ') + word;
      messageEl.appendChild(wordSpan);
      i++;
      setTimeout(nextWord, TYPE_DELAY + Math.random() * 80);
    }
    nextWord();
  }

  let currentKeyListener = null;
  let choiceCallback = null;
  let confirmCallback = null;
  let awaitingConfirmation = false;

  function handleChoice(choice) {
    if (currentKeyListener) {
      document.removeEventListener('keydown', currentKeyListener);
      currentKeyListener = null;
    }

    if (choiceCallback) {
      choiceCallback(choice);
    }
  }

  function handleConfirm() {
    // Remove current listener
    if (currentKeyListener) {
      document.removeEventListener('keydown', currentKeyListener);
      currentKeyListener = null;
    }

    // Call confirm callback
    if (confirmCallback) {
      confirmCallback();
    }
  }

  function keyListener(e) {
    if (awaitingConfirmation && e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    } else if (!awaitingConfirmation && (e.key === '1' || e.key === '2')) {
      e.preventDefault();
      handleChoice(e.key);
    }
  }

  // API for external control
  window.fallingConsole = window.fallingConsole || {};
  window.fallingConsole.container = container;
  window.fallingConsole.sendChoice = handleChoice;
  window.fallingConsole.typeWords = typeWords;
  window.fallingConsole.startLoading = startLoading;
  window.fallingConsole.stopLoading = stopLoading;
  window.fallingConsole.messageEl = messageEl;
  window.fallingConsole.inputEl = inputEl;
  window.fallingConsole.cursorEl = cursorEl;
  
  window.fallingConsole.onChoice = function(callback) {
    choiceCallback = callback;
    awaitingConfirmation = false;
  };

  // confirmation handler
  window.fallingConsole.onConfirm = function(callback) {
    confirmCallback = callback;
    awaitingConfirmation = true;
  };

  window.fallingConsole.enableInput = function(promptText) {
    inputEl.focus?.();
    inputEl.setAttribute('readonly', 'true');
    const prompt = document.createElement('div');
    prompt.className = 'hint';
    prompt.style.marginTop = '6px';
    prompt.textContent = promptText || 'Press 1 or 2 to choose';
    container.appendChild(prompt);
    
    awaitingConfirmation = false;
    currentKeyListener = keyListener;
    document.addEventListener('keydown', currentKeyListener);
  };

  window.fallingConsole.enableConfirmation = function(promptText) {
    inputEl.focus?.();
    inputEl.setAttribute('readonly', 'true');
    
    const oldPrompts = container.querySelectorAll('.hint:not(.top-row .hint)');
    oldPrompts.forEach(p => p.remove());
    
    const prompt = document.createElement('div');
    prompt.className = 'hint';
    prompt.style.marginTop = '6px';
    prompt.textContent = promptText || 'Press Enter to send';
    container.appendChild(prompt);
    
    awaitingConfirmation = true;
    currentKeyListener = keyListener;
    document.addEventListener('keydown', currentKeyListener);
  };

  window.fallingConsole.fadeOut = function() {
    container.classList.add('faded');
    if (currentKeyListener) {
      setTimeout(() => {
        document.removeEventListener('keydown', currentKeyListener);
        currentKeyListener = null;
      }, 200);
    }
  };

  window.fallingConsole.showMessage = function(text) {
    const msg = document.createElement('div');
    msg.style.marginTop = '6px';
    msg.textContent = text;
    container.appendChild(msg);
  };

  window.fallingConsole.setInputValue = function(value) {
    inputEl.value = value;
  };

  window.fallingConsole.clearMessages = function() {
    const dynamicElements = container.querySelectorAll('div:not(.top-row):not(.message):not(.input-row)');
    dynamicElements.forEach(el => el.remove());
    
    const hints = container.querySelectorAll('.hint:not(.top-row .hint)');
    hints.forEach(h => h.remove());
  };

  // Initial sequence: start loader, after LOAD_DURATION stop and type out message, then enable input
  startLoading();
  setTimeout(() => {
    stopLoading();
    const message = 'Houston, CapCom, calling ISS, do you copy?';
    typeWords(message, () => {
      if (window.fallingConsole.onInitialMessageComplete) {
        window.fallingConsole.onInitialMessageComplete();
      }
    });
  }, LOAD_DURATION);
})();
