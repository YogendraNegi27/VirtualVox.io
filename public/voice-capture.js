// AudioContext performs device resampling to 16 kHz; send exactly 20 ms PCM16 frames.
class VoiceCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.samples = new Int16Array(320);
    this.index = 0;
  }
  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;
    for (const value of channel) {
      const sample = Math.max(-1, Math.min(1, value));
      this.samples[this.index++] = Math.round(
        sample * (sample < 0 ? 32768 : 32767),
      );
      if (this.index === 320) {
        // Explicit little endian; do not depend on typed-array byte order.
        const frame = new ArrayBuffer(640),
          view = new DataView(frame);
        for (let i = 0; i < 320; i++)
          view.setInt16(i * 2, this.samples[i], true);
        this.port.postMessage(frame, [frame]);
        this.index = 0;
      }
    }
    return true;
  }
}
registerProcessor("voice-capture", VoiceCapture);
