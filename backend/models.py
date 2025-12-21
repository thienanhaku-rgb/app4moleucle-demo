from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import uuid

class MoleculeGenerationRequest(BaseModel):
    prompt: str
    models: List[str] = ["model_a"]

class SingleModelResult(BaseModel):
    model_name: str
    smiles: str
    confidence: float
    execution_time: float

class GenerationRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    prompt: str
    results: List[SingleModelResult]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GenerationHistoryResponse(BaseModel):
    history: List[GenerationRecord]
