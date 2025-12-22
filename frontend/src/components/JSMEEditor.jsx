import React, { useEffect, useRef, useMemo } from 'react';

const JSMEEditor = ({ onChange, initialSmiles }) => {
  const editorRef = useRef(null);
  // Stable ID for the container to prevent re-rendering the DOM node
  const uniqueId = useMemo(() => "jsme_container_" + Math.random().toString(36).substr(2, 9), []);

  useEffect(() => {
    // Initialization logic
    const initEditor = () => {
      if (window.JSApplet && !editorRef.current) {
        // Initialize JSME
        // width/height 100% to fill container
        editorRef.current = new window.JSApplet.JSME(uniqueId, "100%", "100%", {
          "options": "oldlook,star,nocanonize,newlook" 
        });
        
        // Set initial value if present
        if (initialSmiles) {
            editorRef.current.readGenericMolecularInput(initialSmiles);
        }

        // Setup Callback
        editorRef.current.setCallBack("AfterStructureModified", (jsme) => {
           const smiles = jsme.smiles();
           if(onChange) onChange(smiles);
        });
      } else if (!window.JSApplet) {
        // Retry if script not loaded yet (CDN delay)
        setTimeout(initEditor, 500);
      }
    };

    initEditor();
  }, [uniqueId]); // Only run once on mount (technically when uniqueId is created, which is once)

  // Separate effect to handle external updates to SMILES (e.g. from History or Generation)
  useEffect(() => {
      if(editorRef.current && initialSmiles) {
          // Avoid infinite loop: only update if different from current
          const currentSmiles = editorRef.current.smiles();
          if(currentSmiles !== initialSmiles) {
             editorRef.current.readGenericMolecularInput(initialSmiles);
          }
      }
  }, [initialSmiles]);

  return (
    <div className="w-full h-full bg-white rounded overflow-hidden relative">
      <div id={uniqueId} className="w-full h-full absolute inset-0"></div>
    </div>
  );
};

export default JSMEEditor;
