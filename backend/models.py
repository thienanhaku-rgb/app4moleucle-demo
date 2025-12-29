from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import uuid

class MoleculeGenerationRequest(BaseModel):
    prompt: str
    models: List[str] = ["model_a"]
    experiment_id: Optional[str] = None # Link to experiment

class SingleModelResult(BaseModel):
    model_name: str
    smiles: str
    confidence: float
    execution_time: float
    model_version: Optional[str] = None
    is_valid: bool = True

class GenerationRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    prompt: str
    results: List[SingleModelResult]
    experiment_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None

class GenerationHistoryResponse(BaseModel):
    history: List[GenerationRecord]

# New Experiment Models
class ExperimentCreate(BaseModel):
    name: str
    description: Optional[str] = None

class Experiment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    run_count: int = 0 # Computed field
