declare module 'three/examples/jsm/geometries/TextGeometry' {
    import { BufferGeometry, Font } from 'three';
    export class TextGeometry extends BufferGeometry {
      constructor(
        text: string,
        parameters?: {
          font: Font;
          size?: number;
          height?: number;
          curveSegments?: number;
          bevelEnabled?: boolean;
          bevelThickness?: number;
          bevelSize?: number;
          bevelOffset?: number;
          bevelSegments?: number;
        }
      );
    }
  }
  
  declare module 'three/examples/jsm/loaders/FontLoader' {
    import { Loader, Shape } from 'three';
  
    export interface Font {
      data: any;
      generateShapes(text: string, size?: number): Shape[];
    }
  
    export class FontLoader extends Loader {
      load(
        url: string,
        onLoad: (font: Font) => void,
        onProgress?: (event: ProgressEvent<EventTarget>) => void,
        onError?: (event: ErrorEvent) => void
      ): void;
  
      parse(json: any): Font;
    }
  }
  
  declare module 'three/examples/jsm/math/MeshSurfaceSampler' {
    import { Mesh, Vector3 } from 'three';
  
    export class MeshSurfaceSampler {
      constructor(mesh: Mesh);
      build(): this;
      sample(target: Vector3): this;
    }
  }
  