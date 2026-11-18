import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { BrightnessContrastShader } from 'three/addons/shaders/BrightnessContrastShader.js';

import Camera from '@99Stud/webgl/components/Camera';
import Scene from '@99Stud/webgl/components/Scene';
import { MotionBlurPass } from '@99Stud/webgl/passes/motionBlurPass';
import WebGLStore from '@99Stud/webgl/store/WebGLStore';
import { postProcessingFolder } from '@99Stud/webgl/utils/debugger';

// Optional passes, off by default. Only loaded in debug builds (see PostProcessing.init).

const PARAMS = {
  smaa: {
    enabled: false,
    quality: 1,
  },
  gtao: {
    enabled: false,
    output: GTAOPass.OUTPUT.Default,
    blendIntensity: 0,
    ao: {
      radius: 0.25,
      distanceExponent: 1,
      thickness: 1,
      scale: 1,
      samples: 16,
      distanceFallOff: 1,
      screenSpaceRadius: false,
    },
  },
  brightnessContrast: {
    enabled: false,
    brightness: 0,
    contrast: 0,
  },
  motionBlur: {
    enabled: false,
    intensity: 0.9,
  },
};

function setupSMAA(post) {
  const { width: w, height: h } = WebGLStore.viewport;

  post.smaaPass = new SMAAPass(w, h);
  post.smaaPass.enabled = PARAMS.smaa.enabled;

  post.smaaFolder = postProcessingFolder.addFolder({ title: 'SMAA Pass' });

  post.smaaFolder.addBinding(PARAMS.smaa, 'quality').on('change', (ev) => {
    post.smaaPass.quality = ev.value;
  });
  post.smaaFolder.addBinding(PARAMS.smaa, 'enabled').on('change', (ev) => {
    post.smaaPass.enabled = ev.value;
  });
}

function setupGTAO(post) {
  post.gtaoPass = new GTAOPass(Scene, Camera);
  post.gtaoPass.enabled = PARAMS.gtao.enabled;

  post.gtaoFolder = postProcessingFolder.addFolder({ title: 'GTAO Pass' });

  post.gtaoFolder.addBinding(PARAMS.gtao, 'enabled').on('change', (ev) => {
    post.gtaoPass.enabled = ev.value;
  });

  post.gtaoFolder
    .addBinding(PARAMS.gtao, 'output', {
      options: {
        Default: GTAOPass.OUTPUT.Default,
        Diffuse: GTAOPass.OUTPUT.Diffuse,
        'AO Only': GTAOPass.OUTPUT.AO,
        'AO Only + Denoise': GTAOPass.OUTPUT.Denoise,
        Depth: GTAOPass.OUTPUT.Depth,
        Normal: GTAOPass.OUTPUT.Normal,
      },
    })
    .on('change', (ev) => {
      post.gtaoPass.output = ev.value;
    });
  post.gtaoFolder
    .addBinding(PARAMS.gtao, 'blendIntensity', { min: 0, max: 1, step: 0.01 })
    .on('change', (ev) => {
      post.gtaoPass.blendIntensity = ev.value;
    });

  post.gtaoFolder
    .addBinding(PARAMS.gtao.ao, 'samples', { min: 1, max: 64, step: 1 })
    .on('change', () => {
      post.gtaoPass.updateGtaoMaterial(PARAMS.gtao.ao);
    });
  post.gtaoFolder.addBinding(PARAMS.gtao.ao, 'radius', { min: 0.0, max: 1.0 }).on('change', () => {
    post.gtaoPass.updateGtaoMaterial(PARAMS.gtao.ao);
  });
}

function setupBrightnessContrast(post) {
  post.brightnessContrastPass = new ShaderPass(BrightnessContrastShader);
  post.brightnessContrastPass.enabled = PARAMS.brightnessContrast.enabled;

  post.brightnessContrastFolder = postProcessingFolder.addFolder({
    title: 'Brightness Contrast Pass',
  });

  post.brightnessContrastFolder
    .addBinding(PARAMS.brightnessContrast, 'enabled')
    .on('change', (ev) => {
      post.brightnessContrastPass.enabled = ev.value;
    });

  post.brightnessContrastFolder
    .addBinding(PARAMS.brightnessContrast, 'brightness', { min: -0.5, max: 0.5, step: 0.01 })
    .on('change', (ev) => {
      post.brightnessContrastPass.material.uniforms.brightness.value = ev.value;
    });
  post.brightnessContrastFolder
    .addBinding(PARAMS.brightnessContrast, 'contrast', { min: 0, max: 0.5, step: 0.01 })
    .on('change', (ev) => {
      post.brightnessContrastPass.material.uniforms.contrast.value = ev.value;
    });
}

function setupMotionBlurPass(post) {
  post.motionBlurPass = new MotionBlurPass();
  post.motionBlurPass.enabled = PARAMS.motionBlur.enabled;

  post.motionBlurFolder = postProcessingFolder.addFolder({ title: 'Motion Blur Pass' });

  post.motionBlurFolder.addBinding(PARAMS.motionBlur, 'enabled').on('change', (ev) => {
    post.motionBlurPass.enabled = ev.value;
  });

  post.motionBlurFolder
    .addBinding(PARAMS.motionBlur, 'intensity', { min: 0, max: 1, step: 0.01 })
    .on('change', (ev) => {
      post.motionBlurPass.settings.render.intensity = ev.value;
    });
}

// Slots the optional passes into the composer, in the order they have always run:
// render, SMAA, GTAO, motion blur, bloom, brightness/contrast, final
export function addDebugPasses(post) {
  setupSMAA(post);
  setupGTAO(post);
  setupMotionBlurPass(post);
  setupBrightnessContrast(post);

  const { composer } = post;
  const afterRender = composer.passes.indexOf(post.renderPass) + 1;
  composer.insertPass(post.smaaPass, afterRender);
  composer.insertPass(post.gtaoPass, afterRender + 1);
  composer.insertPass(post.motionBlurPass, afterRender + 2);
  composer.insertPass(post.brightnessContrastPass, composer.passes.indexOf(post.bloomPass) + 1);
}
