import React, { useRef } from 'react';
import JSMEEditor from './JSMEEditor';
import { Button } from "@/components/ui/button";
import { 
  Undo2, Redo2, Copy, Trash2, 
  Beaker, Command 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProStructureEditor({ activeSmiles, setActiveSmiles, className }) {
    const editorRef = useRef(null);

    const handleCopy = () => {
        if(activeSmiles) {
            navigator.clipboard.writeText(activeSmiles);
            toast.success("Structure copied to clipboard");
        }
    };

    const handleClear = () => {
        if(editorRef.current) {
            editorRef.current.reset();
            setActiveSmiles("");
            toast.info("Canvas cleared");
        }
    };

    const handleUndo = () => editorRef.current?.undo();
    const handleRedo = () => editorRef.current?.redo();

    return (
        <div className={cn("flex flex-col h-full bg-card rounded-xl shadow-inner overflow-hidden", className)}>
            {/* Toolbar */}
            <div className="h-14 border-b border-border bg-background/50 flex justify-between items-center px-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                        <Beaker className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-foreground tracking-wide block">DESIGNER</span>
                        <span className="text-[10px] text-muted-foreground">Molecular Blueprint</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-xl border border-border/50 shadow-inner">
                    <ToolbarButton icon={<Undo2 className="w-4 h-4" />} label="Undo" onClick={handleUndo} />
                    <ToolbarButton icon={<Redo2 className="w-4 h-4" />} label="Redo" onClick={handleRedo} />
                    <div className="w-px h-4 bg-border mx-1" />
                    <ToolbarButton icon={<Trash2 className="w-4 h-4" />} label="Reset" onClick={handleClear} hoverColor="hover:text-destructive hover:bg-destructive/10" />
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 px-3 text-xs font-bold shadow-sm hover:border-primary/50">
                        <Copy className="w-3.5 h-3.5 mr-2" /> COPY
                    </Button>
                </div>
            </div>
            
            {/* Editor Canvas */}
            <div className="flex-1 relative bg-white overflow-hidden group">
                 {/* Dot Pattern Background */}
                 <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                 
                 <div className="absolute inset-0">
                    <JSMEEditor 
                        ref={editorRef}
                        onChange={(s) => setActiveSmiles(s)} 
                        initialSmiles={activeSmiles} 
                    />
                 </div>
            </div>

            {/* Status Footer */}
            <div className="h-10 bg-muted/30 border-t border-border flex items-center px-4 justify-between text-xs font-mono text-muted-foreground">
                 <div className="flex items-center gap-2 px-2 py-1 rounded bg-background border border-border/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-semibold text-foreground">READY</span>
                 </div>
                 <div className="flex items-center gap-2 max-w-[300px] opacity-70">
                    <Command className="w-3 h-3" />
                    <span className="truncate">{activeSmiles || "NO STRUCTURE"}</span>
                 </div>
            </div>
        </div>
    );
}

function ToolbarButton({ icon, label, onClick, hoverColor }) {
    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClick} 
            className={cn("w-8 h-8 rounded-lg text-muted-foreground transition-all", hoverColor || "hover:text-foreground hover:bg-background hover:shadow-sm")}
            title={label}
        >
            {icon}
        </Button>
    )
}
