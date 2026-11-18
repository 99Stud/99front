import { ShaderMaterial } from 'three';
import { FullScreenQuad, Pass } from 'three/addons/postprocessing/Pass.js';

// Tone mapping, film grain and output colour space conversion in one full-screen draw.
// Same maths as three's ACESFilmicToneMappingShader, FilmShader and OutputPass run in a row,
// without the two intermediate full-resolution passes.
const FRAGMENT_SHADER = /* glsl */ `
  #include <common>

  uniform sampler2D tDiffuse;
  uniform bool toneMappingEnabled;
  uniform float exposure;
  uniform bool filmGrainEnabled;
  uniform float grainIntensity;
  uniform bool grainGrayscale;
  uniform float time;

  varying vec2 vUv;

  vec3 rrtAndOdtFit(vec3 v) {
    vec3 a = v * (v + 0.0245786) - 0.000090537;
    vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
    return a / b;
  }

  // ACES Filmic by Stephen Hill, as in three's ACESFilmicToneMappingShader
  vec3 acesFilmic(vec3 color) {
    // sRGB => XYZ => D65_2_D60 => AP1 => RRT_SAT
    const mat3 ACESInputMat = mat3(
      vec3(0.59719, 0.07600, 0.02840),
      vec3(0.35458, 0.90834, 0.13383),
      vec3(0.04823, 0.01566, 0.83777)
    );

    // ODT_SAT => XYZ => D60_2_D65 => sRGB
    const mat3 ACESOutputMat = mat3(
      vec3( 1.60475, -0.10208, -0.00327),
      vec3(-0.53108,  1.10813, -0.07276),
      vec3(-0.07367, -0.00605,  1.07602)
    );

    color = ACESInputMat * color;
    color = rrtAndOdtFit(color);
    color = ACESOutputMat * color;

    return saturate(color);
  }

  void main() {
    vec4 base = texture2D(tDiffuse, vUv);
    vec3 color = base.rgb;

    if (toneMappingEnabled) {
      // Pre-exposed, outside of the tone mapping function
      color = acesFilmic(color * exposure / 0.6);
    }

    if (filmGrainEnabled) {
      float noise = rand(fract(vUv + time));
      vec3 grain = color + color * clamp(0.1 + noise, 0.0, 1.0);

      color = mix(color, grain, grainIntensity);

      if (grainGrayscale) {
        color = vec3(luminance(color));
      }
    }

    gl_FragColor = vec4(color, base.a);

    #include <colorspace_fragment>
  }
`;

class FinalPass extends Pass {
  /**
   * @param {{ toneMapping: { enabled: boolean, exposure: number }, filmGrain: { enabled: boolean, intensity: number, grayscale: boolean } }} settings
   */
  constructor({ toneMapping, filmGrain }) {
    super();

    this.uniforms = {
      tDiffuse: { value: null },
      toneMappingEnabled: { value: toneMapping.enabled },
      exposure: { value: toneMapping.exposure },
      filmGrainEnabled: { value: filmGrain.enabled },
      grainIntensity: { value: filmGrain.intensity },
      grainGrayscale: { value: filmGrain.grayscale },
      time: { value: 0 },
    };

    this.material = new ShaderMaterial({
      name: 'FinalPass',
      uniforms: this.uniforms,
      vertexShader: /* glsl */ `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: FRAGMENT_SHADER,
      // Tone mapping is done above, not by the renderer
      toneMapped: false,
    });

    this.fsQuad = new FullScreenQuad(this.material);
  }

  render(renderer, writeBuffer, readBuffer, deltaTime) {
    this.uniforms.tDiffuse.value = readBuffer.texture;
    this.uniforms.time.value += deltaTime;

    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.fsQuad.render(renderer);
  }

  dispose() {
    this.material.dispose();
    this.fsQuad.dispose();
  }
}

export { FinalPass };
