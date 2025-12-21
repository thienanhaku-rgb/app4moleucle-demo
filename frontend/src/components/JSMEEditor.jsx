import React, { useEffect, useRef } from 'react';

const JSMEEditor = ({ onChange, initialSmiles }) => {
  const editorRef = useRef(null);
  const containerId = "jsme_container_" + Math.random().toString(36).substr(2, 9);

  useEffect(() => {
    const initEditor = () => {
      if (window.JSApplet && !editorRef.current) {
        editorRef.current = new window.JSApplet.JSME(containerId, "100%", "400px", {
          "options": "oldlook,star,nocanonize"
        });
        
        if (initialSmiles) {
            editorRef.current.readGenericMolecularInput(initialSmiles);
        }

        editorRef.current.setCallBack("AfterStructureModified", (jsme) => {
           const smiles = jsme.smiles();
           if(onChange) onChange(smiles);
        });
      } else if (!window.JSApplet) {
        // Retry if script not loaded yet
        setTimeout(initEditor, 500);
      }
    };

    initEditor();
  }, [containerId, initialSmiles]);

  return (
    <div className="w-full h-full border border-slate-700 bg-white rounded overflow-hidden">
      <div id={containerId} className="w-full h-full"></div>
    </div>
  );
};

export default JSMEEditor;
