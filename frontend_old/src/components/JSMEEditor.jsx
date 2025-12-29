import React, { useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useTheme } from "next-themes";

const JSMEEditor = forwardRef(({ onChange, initialSmiles, className }, ref) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const { theme } = useTheme();
  
  // Stable ID
  const uniqueId = useMemo(() => "jsme_container_" + Math.random().toString(36).substr(2, 9), []);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    undo: () => {
      if (editorRef.current && editorRef.current.undo) editorRef.current.undo();
    },
    redo: () => {
      if (editorRef.current && editorRef.current.redo) editorRef.current.redo();
    },
    reset: () => {
      if (editorRef.current && editorRef.current.reset) editorRef.current.reset();
    },
    getSmiles: () => {
      return editorRef.current ? editorRef.current.smiles() : "";
    }
  }));

  useEffect(() => {
    const initEditor = () => {
      if (window.JSApplet && containerRef.current) {
        // Clear previous instance if any
        containerRef.current.innerHTML = "";
        
        // Define colors based on theme
        // JSME allows setting background color via HTML/Applet param, but for JS version it's trickier.
        // We often pass options string.
        // "newlook" is cleaner.
        // Sadly JSME doesn't have a robust "dark mode" API, but we can try to style the surrounding.
        // However, we can trick it by initializing with specific parameters if supported.
        
        editorRef.current = new window.JSApplet.JSME(uniqueId, "100%", "100%", {
          "options": "oldlook,star,nocanonize,newlook"
        });
        
        if (initialSmiles) {
            editorRef.current.readGenericMolecularInput(initialSmiles);
        }

        editorRef.current.setCallBack("AfterStructureModified", (jsmeEvent) => {
           if (editorRef.current && typeof editorRef.current.smiles === 'function') {
               const smiles = editorRef.current.smiles();
               if(onChange) onChange(smiles);
           }
        });
      } else if (!window.JSApplet) {
        setTimeout(initEditor, 500);
      }
    };

    initEditor();
  }, [uniqueId]); // Re-init if ID changes (which shouldn't happen often)

  // Handle external SMILES updates
  useEffect(() => {
      if(editorRef.current && initialSmiles) {
          const currentSmiles = editorRef.current.smiles();
          if(currentSmiles !== initialSmiles) {
             editorRef.current.readGenericMolecularInput(initialSmiles);
          }
      }
  }, [initialSmiles]);

  return (
    <div className={`w-full h-full relative ${className}`}>
      {/* We can use CSS filters to invert the editor in dark mode if we want a "hacky" dark mode */}
      {/* invert(1) hue-rotate(180deg) makes white->black but keeps colors roughly sane */}
      <div 
        ref={containerRef}
        id={uniqueId} 
        className={`w-full h-full absolute inset-0 transition-all duration-300 ${theme === 'dark' ? 'invert-[.92] hue-rotate-180 contrast-125 saturate-200' : ''}`}
      ></div>
    </div>
  );
});

export default JSMEEditor;
