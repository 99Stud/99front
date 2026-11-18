import { PerspectiveCamera, Vector3 } from 'three';

import Renderer from '@99Stud/webgl/components/Renderer';
import { CONTROLS_ENABLED } from '@99Stud/webgl/store/constants';
import WebGLStore from '@99Stud/webgl/store/WebGLStore';

import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type UnitSize = {
  width: number;
  height: number;
};

class Camera extends PerspectiveCamera {
  controls?: OrbitControls;
  lookPos!: Vector3;
  unit!: UnitSize;

  constructor() {
    super(55, 0, 0.1, 100);
    this.onResize();
  }

  init(): void {
    this.position.set(0, 0, 10);
    this.lookPos = new Vector3(0, 0, 0);
    this.fov = 20;
    this.lookAt(this.lookPos);
    if (CONTROLS_ENABLED) this.initOrbitControl();
  }

  async initOrbitControl(): Promise<void> {
    const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
    this.controls = new OrbitControls(this, Renderer.domElement);
    this.controls.target = this.lookPos;
  }

  calculateUnitSize(distance: number = this.position.z): UnitSize {
    const vFov = (this.fov * Math.PI) / 180;
    const height = 2 * Math.tan(vFov / 2) * distance;
    const width = height * this.aspect;

    return {
      width,
      height,
    };
  }

  onTick(): void {
    this.controls?.update();
  }

  onResize(): void {
    const { viewport } = WebGLStore;

    this.aspect = viewport.aspect;
    this.unit = this.calculateUnitSize();
    this.updateProjectionMatrix();
  }
}

const camera = new Camera();

export default camera;
