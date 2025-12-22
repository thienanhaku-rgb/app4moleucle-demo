import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import Molecule3DViewer from '@/components/Molecule3DViewer';
import { ProStructureEditor } from '@/components/ProStructureEditor';
import { useDebounce } from '@/hooks/use-debounce';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, Sparkles, CheckCircle2, ChevronRight 
} from "lucide-react";

const DASHBOARD_API = process.env.REACT_APP_BACKEND_URL + "/api/molecules";

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModels, setSelectedModels] = useState(["model_a"]);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeSmiles, setActiveSmiles] = useState(null); 
  const [mode, setMode] = useState("generate"); // generate | edit

  const debouncedSmiles = useDebounce(activeSmiles, 800);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await axios.post(`${DASHBOARD_API}/generate`, {
        prompt,
        models: selectedModels
      });
      setResults(res.data.results);
      if (res.data.results.length > 0) {
        setActiveSmiles(res.data.results[0].smiles);
        toast.success("Molecule generated successfully");
      }
      fetchHistory();
    } catch (e) {
      toast.error("Generation failed");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
        const res = await axios.get(`${DASHBOARD_API}/history`);
        setHistory(res.data);
    } catch(e) {
        console.error("Failed to fetch history");
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <MainLayout 
        history={history} 
        onHistoryClick={(record) => {
            setResults(record.results);
            if(record.results.length > 0) setActiveSmiles(record.results[0].smiles);
            setPrompt(record.prompt);
        }}
        mode={mode}
        setMode={setMode}
    >
        <div className="flex-1 relative overflow-hidden flex flex-col md:flex-row h-full">
            
            {/* Left Panel */}
            <motion.div 
                layout
                className={`
                   transition-all duration-500 ease-in-out border-r border-border bg-card/50 z-10 overflow-y-auto flex flex-col relative
                   ${mode === 'edit' ? 'w-full md:w-1/2 p-4' : 'w-full md:w-[420px] p-0'}
                `}
            >
                <AnimatePresence mode="wait">
                    {mode === 'generate' ? (
                        <motion.div 
                            key="generator"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col h-full"
                        >
                            <div className="p-8 border-b border-border/50 bg-gradient-to-b from-muted/30 to-transparent">
                                <h2 className="text-2xl font-display font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">New Synthesis</h2>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Describe the chemical properties or structure you wish to generate. Our AI models will translate natural language into valid molecular structures.
                                </p>
                            </div>
                            
                            <div className="p-8 space-y-8 flex-1">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        Input Prompt
                                    </label>
                                    <div className="relative group">
                                        <textarea 
                                            className="w-full bg-background border-2 border-border/50 focus:border-primary text-foreground p-5 min-h-[160px] rounded-2xl resize-none text-base leading-relaxed placeholder:text-muted-foreground/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm group-hover:border-border"
                                            placeholder="e.g. A potent inhibitor with a pyridine ring and two hydroxyl groups..."
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                        />
                                        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                                            {prompt.length} chars
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        Select Models
                                    </label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {["model_a", "model_b", "model_c"].map(m => (
                                            <div key={m} 
                                                className={`
                                                    flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden
                                                    ${selectedModels.includes(m) 
                                                        ? 'bg-primary/5 border-primary shadow-md shadow-primary/5' 
                                                        : 'bg-background border-border/50 hover:border-primary/30 hover:bg-muted/30'}
                                                `}
                                                onClick={() => {
                                                    if(selectedModels.includes(m)) setSelectedModels(prev => prev.filter(x => x !== m));
                                                    else setSelectedModels(prev => [...prev, m]);
                                                }}
                                            >
                                                <div className={`
                                                    w-5 h-5 rounded-full mr-4 border-2 flex items-center justify-center transition-all duration-300
                                                    ${selectedModels.includes(m) ? 'bg-primary border-primary scale-110' : 'bg-transparent border-muted-foreground scale-100'}
                                                `}>
                                                    {selectedModels.includes(m) && <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold block tracking-tight">{m.replace('_', ' ').toUpperCase()}</span>
                                                    <span className="text-xs text-muted-foreground">High-fidelity molecular generation</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-border/50 bg-background/50 backdrop-blur-sm">
                                <Button 
                                    onClick={handleGenerate} 
                                    disabled={loading || !prompt}
                                    className="w-full h-14 text-base font-bold tracking-wide shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl"
                                >
                                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                                    Initiate Synthesis
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="editor"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="h-full rounded-2xl overflow-hidden border border-border/50 shadow-2xl"
                        >
                            <ProStructureEditor 
                                activeSmiles={activeSmiles} 
                                setActiveSmiles={setActiveSmiles} 
                                className="h-full border-0"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Right Panel: Visualization */}
            <div className="flex-1 bg-muted/20 relative flex flex-col p-6 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

                <div className="flex items-center justify-between mb-4 relative z-10">
                   <div className="flex items-center gap-3">
                       <h3 className="text-sm font-bold text-foreground tracking-wide flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-primary animate-pulse"/>
                           3D VISUALIZATION
                       </h3>
                       <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded-md">interactive</span>
                   </div>
                   
                   {activeSmiles && (
                       <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                               LIVE RENDER
                           </span>
                       </div>
                   )}
                </div>

                {activeSmiles ? (
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className={`w-full h-full grid grid-cols-1 ${mode === 'generate' && results.length > 1 ? 'md:grid-cols-2 gap-6' : 'grid-cols-1'}`}
                   >
                      {/* Main Viewer */}
                      <div className={`relative h-full flex flex-col gap-4 ${mode === 'generate' && results.length > 1 ? 'md:col-span-1' : 'md:col-span-2'}`}>
                         <div className="flex-1 rounded-2xl overflow-hidden border-2 border-border/50 shadow-lg bg-card relative group hover:border-primary/30 transition-all">
                            <Molecule3DViewer smiles={debouncedSmiles || activeSmiles} className="w-full h-full" />
                            
                            {/* Floating Overlay Controls Mockup */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-8 h-8 rounded-lg bg-background/80 backdrop-blur border border-border flex items-center justify-center shadow-sm cursor-pointer hover:bg-primary hover:text-white transition-colors">
                                    <ChevronRight className="w-4 h-4 rotate-90" />
                                </div>
                            </div>
                         </div>
                         
                         {mode === 'generate' && (
                            <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-xl flex justify-between items-center shadow-sm">
                                <div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">SMILES String</div>
                                    <div className="font-mono text-xs text-foreground select-all font-medium break-all">{activeSmiles.substring(0, 60)}...</div>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-[10px] px-3 py-1 rounded-lg bg-green-500/10 text-green-600 border border-green-500/20 font-bold">Valid Structure</span>
                                </div>
                            </div>
                         )}
                      </div>

                      {/* Comparison View */}
                      {mode === 'generate' && results.length > 1 && (
                         <div className="h-full flex flex-col gap-4 overflow-y-auto pr-2 pb-2">
                            {results.filter(r => r.smiles !== activeSmiles).map((res, idx) => (
                               <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                    className="h-1/2 min-h-[240px] relative group cursor-pointer border-2 border-border/50 hover:border-primary bg-card rounded-2xl overflow-hidden transition-all shadow-md hover:shadow-xl hover:-translate-y-1"
                                    onClick={() => setActiveSmiles(res.smiles)}
                               >
                                   <Molecule3DViewer smiles={res.smiles} />
                                   <div className="absolute top-3 left-3 bg-background/90 backdrop-blur px-3 py-1.5 text-xs font-bold text-foreground border border-border rounded-lg shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                       {res.model_name.toUpperCase()}
                                   </div>
                               </motion.div>
                            ))}
                         </div>
                      )}
                   </motion.div>
               ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center relative">
                       <div className="w-64 h-64 bg-primary/5 rounded-full absolute blur-3xl animate-pulse" />
                       <div className="w-24 h-24 bg-card rounded-3xl border border-border shadow-xl flex items-center justify-center mb-6 relative z-10 rotate-3 transition-transform hover:rotate-0">
                           <Sparkles className="w-10 h-10 text-primary" />
                       </div>
                       <h2 className="text-3xl font-display font-bold text-foreground mb-3 relative z-10">Ready to Discover</h2>
                       <p className="max-w-md text-base text-muted-foreground relative z-10">
                           Enter a chemical description on the left or switch to the <span className="text-primary font-semibold">Editor</span> to begin your molecular design journey.
                       </p>
                   </div>
               )}
            </div>
        </div>
    </MainLayout>
  );
}
