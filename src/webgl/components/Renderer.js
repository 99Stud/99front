import { SRGBColorSpace, WebGLRenderer } from 'three';

import GlobalRaf from '@99Stud/webgl/events/Raf';
import WebGLStore from '@99Stud/webgl/store/WebGLStore';
import tweak, { rendererFolder } from '@99Stud/webgl/utils/debugger';

class Renderer extends WebGLRenderer {
  constructor() {
    super({
      powerPreference: 'high-performance',
      antialias: false,
      // The scene is drawn into the composer's own targets, so the canvas needs neither
      depth: false,
      stencil: false,
    });

    // PostFX
    this.outputColorSpace = SRGBColorSpace;

    this.addDebug();
  }

  async addStats() {
    const { default: Stats } = await import('stats-js');

    this.stats = new Stats();
    this.stats.dom.style.position = 'relative';
    this.stats.dom.style.display = 'flex';
    this.stats.dom.style.flexDirection = 'row';
    this.stats.dom.style.justifyContent = 'flex-start';
    this.stats.dom.style.pointerEvents = 'none';

    for (const child of this.stats.dom.children) {
      child.style.display = 'inline-block';
    }
  }

  addDebug() {
    if (!rendererFolder) return;
    rendererFolder.addBinding(this.info.memory, 'geometries', {
      label: 'geometries',
      readonly: true,
    });
    rendererFolder.addBinding(this.info.memory, 'textures', { readonly: true });
    rendererFolder.addBinding(GlobalRaf, 'isPaused', { label: 'Pause Raf' });
    const lastBinding = rendererFolder.children[rendererFolder.children.length - 1].element;
    this.addStats().then(() => lastBinding.after(this.stats.dom));
    window.addEventListener('keyup', (e) => {
      if (e.key !== 'p') return;
      GlobalRaf.isPaused = !GlobalRaf.isPaused;
      tweak.refresh();
    });
  }

  onResize() {
    const { width, height, dpr } = WebGLStore.viewport;

    // setPixelRatio resizes the drawing buffer too, so only call it when it changed
    if (this.getPixelRatio() !== dpr) this.setPixelRatio(dpr);
    this.setSize(width, height);
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Renderer();
