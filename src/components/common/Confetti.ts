// LEVEL UP 73 - Celebration Confetti Utility
import confetti from 'canvas-confetti';

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#3987FF', '#8B5CF6', '#22C55E', '#F59E0B', '#38BDF8'],
    });
  } catch (e) {
    console.log('Confetti trigger omitted', e);
  }
}

export function triggerMilestoneConfetti() {
  try {
    const end = Date.now() + 1500;
    const colors = ['#3987FF', '#8B5CF6', '#22C55E', '#F59E0B'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (e) {
    console.log('Milestone confetti omitted', e);
  }
}

