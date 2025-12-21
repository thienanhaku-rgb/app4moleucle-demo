import React, { useEffect, useRef } from 'react';
import * as $3Dmol from '3dmol/build/3Dmol.js';

const Molecule3DViewer = ({ smiles, cid, className }) => {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize viewer
    const viewer = $3Dmol.createViewer(containerRef.current, {
      backgroundColor: '#020408', // Match the void background
    });
    viewerRef.current = viewer;

    // Load molecule data
    if (smiles) {
        // Using pubchem for fetching 3D structure from SMILES is a common fallback
        // Since generating 3D coordinates from SMILES strictly in frontend can be heavy without RDKit.js
        // 3Dmol has a way to add models from string. 
        // For accurate 3D, we usually need SDF/MOL with 3D coords.
        // However, let's try 3Dmol's built-in parsing first.
        
        // Wait, 3Dmol doesn't generate 3D coords from SMILES automatically without an external service usually.
        // But for this MVP, we can try using the 'model' method if we have the data, or fetch from pubchem.
        
        // Let's use a public API to get the MOL/SDF for the SMILES to ensure 3D coords
        // Or assume the backend provides 3D structure.
        // For now, I will use a simple fetch to a public resolver if pure SMILES is passed.
        
        // Actually, 3Dmol viewer does not generate coordinates. 
        // We will simulate 3D generation by fetching from PubChem for this MVP if only SMILES is present.
        
        const fetchAndLoad = async () => {
             try {
                // Using cactus or pubchem
                const url = `https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(smiles)}/file?format=sdf&get3d=true`;
                const response = await fetch(url);
                if(response.ok) {
                    const sdf = await response.text();
                    viewer.addModel(sdf, "sdf");
                    viewer.setStyle({}, { stick: { radius: 0.15, colorscheme: "Jmol" }, sphere: { scale: 0.25 } });
                    viewer.zoomTo();
                    viewer.render();
                } else {
                    console.error("Failed to fetch 3D structure");
                }
             } catch(e) {
                 console.error(e);
             }
        }
        fetchAndLoad();

    }

    return () => {
       // cleanup if needed
    };
  }, [smiles]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full min-h-[400px] border border-slate-800/50 bg-slate-900/20 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl ${className}`}
    >
      <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-black/50 text-lime-400 text-xs font-mono border border-lime-500/20 rounded">
         3D VIEWER: ACTIVE
      </div>
    </div>
  );
};

export default Molecule3DViewer;
