(function() {
  function waitForConsole(callback) {
    if (window.fallingConsole && window.fallingConsole.container) {
      callback();
    } else {
      setTimeout(() => waitForConsole(callback), 100);
    }
  }

  waitForConsole(() => {
    const console = window.fallingConsole;

    // Phase 1
    console.onInitialMessageComplete = function() {
      const hintEl = console.container.querySelector('.top-row .hint');
      if (hintEl) hintEl.textContent = 'terminal <-> Houston';
      
      console.setInputValue('1. yes 2. dont reply');
      console.enableInput('Press 1 or 2 to choose');

      console.onChoice((choice) => {
        if (choice === '1') {
          console.showMessage('> Send?: yes');
          console.setInputValue('press Enter to send');
          console.enableConfirmation('Press Enter to send');


          console.onConfirm(() => {

            console.clearMessages();
            console.showMessage('> Sent: yes');
            console.setInputValue('sent: yes');
            

            setTimeout(() => {
              startPhase2();
            }, 1000);
          });
        } else if (choice === '2') {
          console.showMessage('> Send?: [no reply]');
          console.setInputValue('press Enter to confirm');
          console.enableConfirmation('Press Enter to confirm');

          console.onConfirm(() => {
            console.clearMessages();
            console.showMessage('> Connection lost.');
            console.setInputValue('connection lost');
            console.fadeOut();
          });
        }
      });
    };

    // Phase 2
    function startPhase2() {
      console.clearMessages();

      console.typeWords('good, connection seems optimal', () => {
        const hintEl = console.container.querySelector('.top-row .hint');
        if (hintEl) hintEl.textContent = 'terminal <-> Houston';
        
        console.setInputValue('1. same here 2. connection is going haywire');
        console.enableInput('Press 1 or 2 to choose');

        console.onChoice((choice) => {
          if (choice === '1') {
            console.showMessage('> Send?: same here');
            console.setInputValue('press Enter to send');
            console.enableConfirmation('Press Enter to send');

            console.onConfirm(() => {
              console.clearMessages();
              console.showMessage('> Sent: same here');
              console.setInputValue('sent: same here');
              
            });
          } else if (choice === '2') {
            console.showMessage('> Send?: connection is going haywire');
            console.setInputValue('press Enter to send');
            console.enableConfirmation('Press Enter to send');

            console.onConfirm(() => {
              console.clearMessages();
              console.showMessage('> Sent: connection is going haywire');
              console.setInputValue('connection unstable');
              
              setTimeout(() => {
                console.showMessage('> Signal degrading...');
                console.fadeOut();
              }, 800);
            });
          }
        });
      });
    }

    // function startPhase3() { ... }
  });
})();
