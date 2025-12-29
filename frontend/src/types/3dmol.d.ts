declare module '3dmol/build/3Dmol.js' {
  interface ViewerOptions {
    backgroundColor?: string;
  }

  interface StyleSpec {
    stick?: {
      radius?: number;
      colorscheme?: string;
      color?: string;
      opacity?: number;
    };
    sphere?: {
      scale?: number;
      color?: string;
      opacity?: number;
    };
  }

  interface AtomSelectionSpec {
    elem?: string;
    serial?: number;
    model?: number;
  }

  interface GLModel {
    setStyle(sel: AtomSelectionSpec, style: StyleSpec): void;
  }

  interface GLViewer {
    addModel(data: string, format: string): GLModel;
    setStyle(sel: AtomSelectionSpec, style: StyleSpec): void;
    zoomTo(): void;
    render(): void;
    clear(): void;
  }

  function createViewer(element: HTMLElement, options?: ViewerOptions): GLViewer;

  export { createViewer, GLViewer, GLModel, StyleSpec, AtomSelectionSpec, ViewerOptions };
}
