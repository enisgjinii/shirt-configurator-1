import * as THREE from 'three';

export class AnimationSystem {
  constructor() {
    this.animations = new Map();
    this.isPlaying = false;
  }

  // Add animation preset
  addAnimation(name, animationFunction) {
    this.animations.set(name, animationFunction);
  }

  // Initialize default animations
  initializeDefaultAnimations() {
    // Rotate Y animation
    this.addAnimation('rotateY', (object, time, speed = 1) => {
      object.rotation.y = time * speed;
    });

    // Rotate X animation
    this.addAnimation('rotateX', (object, time, speed = 1) => {
      object.rotation.x = Math.sin(time * speed) * 0.3;
    });

    // Float animation
    this.addAnimation('float', (object, time, speed = 1) => {
      object.position.y = Math.sin(time * speed) * 0.5;
    });

    // Pulse animation
    this.addAnimation('pulse', (object, time, speed = 1) => {
      const scale = 1 + Math.sin(time * speed * 2) * 0.1;
      object.scale.setScalar(scale);
    });

    // Swing animation
    this.addAnimation('swing', (object, time, speed = 1) => {
      object.rotation.z = Math.sin(time * speed) * 0.2;
    });

    // Bounce animation
    this.addAnimation('bounce', (object, time, speed = 1) => {
      object.position.y = Math.abs(Math.sin(time * speed * 2)) * 0.5;
    });

    // Complex showcase animation
    this.addAnimation('showcase', (object, time, speed = 1) => {
      object.rotation.y = time * speed * 0.5;
      object.position.y = Math.sin(time * speed) * 0.2;
      object.rotation.x = Math.sin(time * speed * 0.7) * 0.1;
    });

    // Wobble animation
    this.addAnimation('wobble', (object, time, speed = 1) => {
      object.rotation.z = Math.sin(time * speed * 3) * 0.1;
      object.rotation.x = Math.cos(time * speed * 2) * 0.05;
    });
  }

  // Apply animation to object
  applyAnimation(object, animationName, time, speed = 1) {
    const animation = this.animations.get(animationName);
    if (animation && object) {
      animation(object, time, speed);
    }
  }

  // Get available animations
  getAvailableAnimations() {
    return Array.from(this.animations.keys());
  }
}

// Recording system for animations
export class AnimationRecorder {
  constructor() {
    this.isRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
  }

  // Start recording canvas
  startRecording(canvas, options = {}) {
    if (!canvas || this.isRecording) return false;

    const {
      videoBitsPerSecond = 2500000,
      mimeType = 'video/webm;codecs=vp9'
    } = options;

    try {
      const stream = canvas.captureStream(30); // 30 FPS
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond
      });

      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.saveRecording();
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      return false;
    }
  }

  // Stop recording
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      return true;
    }
    return false;
  }

  // Save recorded video
  saveRecording(filename = 'shirt-animation.webm', requestedFormat = 'webm') {
    if (this.recordedChunks.length === 0) return;

    // Browsers only support webm natively. If user requests mp4, save as .mp4 but file is webm format.
    let ext = requestedFormat === 'mp4' ? 'mp4' : 'webm';
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace(/\.(webm|mp4)$/i, '') + '.' + ext;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.recordedChunks = [];
  }

  // Get recording status
  getStatus() {
    return {
      isRecording: this.isRecording,
      hasRecording: this.recordedChunks.length > 0
    };
  }
}

export default { AnimationSystem, AnimationRecorder };
