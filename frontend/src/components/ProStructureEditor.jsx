import React, { useRef } from 'react';
import JSMEEditor from './JSMEEditor';
import { Button } from "@/components/ui/button";
import { 
  Undo2, Redo2, RotateCcw, Copy, Trash2, 
  Maximize2, Beaker, Command 
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
        <div className={cn("flex flex-col h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden", className)}>
            {/* Toolbar */}
            <div className="h-12 border-b border-border bg-muted/30 flex justify-between items-center px-3">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                        <Beaker className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-foreground tracking-wide">DESIGNER</span>
                </div>

                <div className="flex items-center gap-1 bg-background/50 p-1 rounded-lg border border-border/50">
                    <ToolbarButton icon={<Undo2 className="w-3.5 h-3.5" />} label="Undo" onClick={handleUndo} />
                    <ToolbarButton icon={<Redo2 className="w-3.5 h-3.5" />} label="Redo" onClick={handleRedo} />
                    <div className="w-px h-3 bg-border mx-1" />
                    <ToolbarButton icon={<Trash2 className="w-3.5 h-3.5" />} label="Reset" onClick={handleClear} hoverColor="hover:text-destructive hover:bg-destructive/10" />
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 text-muted-foreground hover:text-foreground">
                        <Copy className="w-3.5 h-3.5 mr-1.5" /> <span className="text-[10px] font-bold">COPY</span>
                    </Button>
                </div>
            </div>
            
            {/* Editor Canvas */}
            <div className="flex-1 relative bg-white overflow-hidden group">
                 {/* Grid Pattern Background */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10 pointer-events-none" />
                 
                 <div className="absolute inset-0">
                    <JSMEEditor 
                        ref={editorRef}
                        onChange={(s) => setActiveSmiles(s)} 
                        initialSmiles={activeSmiles} 
                    />
                 </div>

                 {/* Floating Label */}
                 <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/90 backdrop-blur border border-border rounded text-[10px] font-mono text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none">
                    JSME ENGINE
                 </div>
            </div>

            {/* Status Footer */}
            <div className="h-8 bg-card border-t border-border flex items-center px-4 justify-between text-[10px] font-mono text-muted-foreground">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>READY</span>
                 </div>
                 <div className="flex items-center gap-2 max-w-[300px]">
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
            className={cn("w-7 h-7 text-muted-foreground transition-all", hoverColor || "hover:text-foreground hover:bg-muted")}
            title={label}
        >
            {icon}
        </Button>
    )
}
