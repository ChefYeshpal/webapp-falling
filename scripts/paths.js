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
    console.setHeader({ 
      loader: 'connecting', 
      hint: 'terminal <--> Houston' 
    });

    // ==================== PHASE 1 ====================
    console.onInitialMessageComplete = function() {
      
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

            console.setHeader({ 
              loader: 'connected', 
              hint: 'terminal <--> Houston' 
            });

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

    // ==================== PHASE 2 ====================
    function startPhase2() {
      console.clearMessages();
      
      
      console.typeWords('good, connection seems optimal', () => {
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
              
              setTimeout(() => {
                startPhase3();
              }, 1200);
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

    // ==================== PHASE 3 ====================
    function startPhase3() {
      console.clearMessages();
      
      const tutorialLines = [
        'alright, let me explain how this works',
        'the ISS is in constant free fall',
        'it is basically falling faster than the earth can rotate',
        'so it forms a temporary orbit',
        'to make sure that the ISS does not crash into the earth',
        'you have to use fuel canisters to push the earth farther',
        'if you look at the right corner',
        'you will notice a vertical bar',
        'red means too close to earth',
        'blue means too far from earth',
        'green is just the perfect distance'
      ];

      let currentLineIndex = 0;

      function showNextLine() {
        if (currentLineIndex >= tutorialLines.length) {
          setTimeout(() => {
            console.clearMessages();
            console.typeWords('press the space bar, to push the ISS farther from the earth', () => {
              console.setInputValue('press space bar');
              // game controls
              if (typeof window.startGame === 'function') {
                window.startGame();
              }
            });
          }, 800);
          return;
        }

        console.typeWords(tutorialLines[currentLineIndex], () => {
          currentLineIndex++;
          console.setInputValue('');
          console.enableConfirmation('Press Enter to continue');

          console.onConfirm(() => {
            console.clearMessages();
            showNextLine();
          });
        });
      }

      showNextLine();
    }
  });
})();
