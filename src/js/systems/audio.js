// Sistema de Audio
class AudioManager {
    constructor() {
        this.audioContext = null;
    }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playSound(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        try {
            let now = this.audioContext.currentTime;
            let osc = this.audioContext.createOscillator();
            let gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.value = frequency;
            osc.type = type;
            
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
            
            osc.start(now);
            osc.stop(now + duration);
        } catch (e) {
            console.log('Audio error:', e);
        }
    }

    playRadarSound() { this.playSound(800, 0.1); }
    playFireSound() { this.playSound(1200, 0.15); }
    playHitSound() { this.playSound(1500, 0.08); }
    playKillSound() { this.playSound(2000, 0.25, 'square'); }
    playExplosionSound() { this.playSound(400, 0.4, 'square'); }
    playGameOverSound() { this.playSound(200, 0.6); }
}

const audio = new AudioManager();
