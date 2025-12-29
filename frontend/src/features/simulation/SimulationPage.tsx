'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Microscope, Play, Loader2, Target, Atom, Activity,
  ChevronDown, Info, Zap, BarChart3,
} from 'lucide-react';

import { MainLayout } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { Molecule3DViewer } from '@/components/molecules';
import { cn } from '@/lib/utils';

// Target proteins for docking
const TARGETS = [
  { id: 'covid_protease', name: 'SARS-CoV-2 Main Protease', pdbId: '6LU7', description: 'COVID-19 drug target' },
  { id: 'hiv_protease', name: 'HIV-1 Protease', pdbId: '1HSG', description: 'HIV drug target' },
  { id: 'breast_cancer', name: 'Estrogen Receptor Alpha', pdbId: '3ERT', description: 'Breast cancer target' },
];

interface DockingResult {
  affinity: number;
  ligand_pdb: string;
  target_pdb: string;
  score_breakdown: {
    van_der_waals: number;
    electrostatic: number;
    desolvation: number;
  };
}

export function SimulationPage() {
  const [ligandSmiles, setLigandSmiles] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DockingResult | null>(null);
  const [showTargetSelector, setShowTargetSelector] = useState(false);

  const handleRunSimulation = async () => {
    if (!ligandSmiles.trim()) {
      toast.error('Please enter a ligand SMILES');
      return;
    }
    if (!selectedTarget) {
      toast.error('Please select a target protein');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || '';
      const response = await fetch(`${baseUrl}/api/simulation/docking/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ligand_smiles: ligandSmiles,
          target_id: selectedTarget,
        }),
      });

      if (!response.ok) {
        throw new Error('Simulation failed');
      }

      const data = await response.json();
      setResult(data);
      toast.success('Docking simulation complete!');
    } catch (e) {
      toast.error('Simulation failed. Please check your SMILES input.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getAffinityColor = (affinity: number) => {
    if (affinity <= -8) return 'text-green-500';
    if (affinity <= -6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getAffinityLabel = (affinity: number) => {
    if (affinity <= -8) return 'Strong binding';
    if (affinity <= -6) return 'Moderate binding';
    return 'Weak binding';
  };

  const selectedTargetInfo = TARGETS.find((t) => t.id === selectedTarget);

  return (
    <MainLayout>
      <div className="flex h-full overflow-hidden">
        {/* Left Panel - Configuration */}
        <div className="w-[400px] border-r border-border bg-card/30 flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Microscope className="w-6 h-6 text-primary" />
              Molecular Docking
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Simulate protein-ligand interactions
            </p>
          </div>

          <div className="p-6 space-y-6 flex-1">
            {/* Ligand Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Atom className="w-3.5 h-3.5" />
                Ligand SMILES
              </label>
              <Input
                className="font-mono text-sm"
                placeholder="e.g. CC(=O)OC1=CC=CC=C1C(=O)O"
                value={ligandSmiles}
                onChange={(e) => setLigandSmiles(e.target.value)}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { name: 'Aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
                  { name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C' },
                  { name: 'Ibuprofen', smiles: 'CC(C)Cc1ccc(C(C)C(=O)O)cc1' },
                ].map((ex) => (
                  <Button
                    key={ex.name}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setLigandSmiles(ex.smiles)}
                  >
                    {ex.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Target Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Target className="w-3.5 h-3.5" />
                Target Protein
              </label>
              <div className="relative">
                <div
                  onClick={() => setShowTargetSelector(!showTargetSelector)}
                  className={cn(
                    'w-full p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between',
                    selectedTarget ? 'bg-primary/5 border-primary' : 'bg-background border-border hover:border-primary/50'
                  )}
                >
                  {selectedTargetInfo ? (
                    <div>
                      <p className="font-medium text-sm">{selectedTargetInfo.name}</p>
                      <p className="text-xs text-muted-foreground">PDB: {selectedTargetInfo.pdbId}</p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Select a target protein...</span>
                  )}
                  <ChevronDown className={cn('w-4 h-4 transition-transform', showTargetSelector && 'rotate-180')} />
                </div>

                {showTargetSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden"
                  >
                    {TARGETS.map((target) => (
                      <div
                        key={target.id}
                        onClick={() => {
                          setSelectedTarget(target.id);
                          setShowTargetSelector(false);
                        }}
                        className={cn(
                          'p-3 cursor-pointer transition-all hover:bg-muted/50',
                          selectedTarget === target.id && 'bg-primary/10'
                        )}
                      >
                        <p className="font-medium text-sm">{target.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {target.description} • PDB: {target.pdbId}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">About Molecular Docking</p>
                  <p>
                    This simulation predicts how a small molecule (ligand) binds to a protein target.
                    Lower binding affinity (more negative) indicates stronger binding.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Run Button */}
          <div className="p-6 border-t border-border/50">
            <Button
              onClick={handleRunSimulation}
              disabled={loading || !ligandSmiles.trim() || !selectedTarget}
              className="w-full h-12"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Play className="w-5 h-5 mr-2" />
              )}
              Run Docking Simulation
            </Button>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="flex-1 bg-muted/10 p-6 overflow-y-auto">
          {result ? (
            <div className="space-y-6">
              {/* Affinity Score */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Binding Affinity
                </h3>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className={cn('text-5xl font-bold', getAffinityColor(result.affinity))}>
                      {result.affinity}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">kcal/mol</p>
                  </div>
                  <div className="flex-1">
                    <p className={cn('font-semibold', getAffinityColor(result.affinity))}>
                      {getAffinityLabel(result.affinity)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.affinity <= -8
                        ? 'This compound shows promising binding potential.'
                        : result.affinity <= -6
                        ? 'Moderate interaction detected.'
                        : 'Consider structural modifications.'}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Score Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Energy Breakdown
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Van der Waals', value: result.score_breakdown.van_der_waals, color: 'bg-blue-500' },
                    { label: 'Electrostatic', value: result.score_breakdown.electrostatic, color: 'bg-purple-500' },
                    { label: 'Desolvation', value: result.score_breakdown.desolvation, color: 'bg-orange-500' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-mono">{item.value} kcal/mol</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', item.color)}
                          style={{ width: `${Math.min(Math.abs(item.value) * 10, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 3D Visualization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Ligand Structure
                </h3>
                <div className="h-[400px] rounded-xl overflow-hidden border border-border">
                  <Molecule3DViewer smiles={ligandSmiles} className="w-full h-full" />
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Microscope className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-bold mb-2">Run a Simulation</h2>
                <p className="text-sm max-w-md">
                  Enter a ligand SMILES and select a target protein to simulate molecular docking.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
