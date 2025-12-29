# Model API Specification

## Overview

Tài liệu này mô tả API contracts cho các AI models dùng trong Text-to-Molecule Translation Platform.

---

## 1. Your Model API (Custom Model)

### Endpoint
```
POST /api/text2mol
```

### Request
```json
{
  "text": "A small organic molecule with an aromatic ring and an alcohol functional group",
  "options": {
    "num_samples": 1,
    "temperature": 0.7,
    "max_length": 512
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| text | string | Yes | Natural language description of the molecule |
| options.num_samples | int | No | Number of SMILES to generate (default: 1) |
| options.temperature | float | No | Sampling temperature (default: 0.7) |
| options.max_length | int | No | Maximum output length (default: 512) |

### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "smiles": ["c1ccccc1CO"],
    "confidence": [0.95],
    "model_name": "your_model",
    "model_version": "1.0.0",
    "execution_time_ms": 150
  },
  "metadata": {
    "input_tokens": 15,
    "output_tokens": 10
  }
}
```

### Response (Error - 400/500)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Input text is too short or invalid"
  }
}
```

---

## 2. MolT5 API

### Endpoint
```
POST /api/text2mol
```

### Request
```json
{
  "text": "A molecule with antiviral properties containing a purine ring",
  "options": {
    "num_beams": 5,
    "num_return_sequences": 1,
    "max_length": 512
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| text | string | Yes | Natural language description |
| options.num_beams | int | No | Beam search width (default: 5) |
| options.num_return_sequences | int | No | Number of sequences to return (default: 1) |
| options.max_length | int | No | Maximum output length (default: 512) |

### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "smiles": ["Nc1ncnc2c1ncn2C3OC(CO)C(O)C3O"],
    "confidence": [0.92],
    "model_name": "molt5",
    "model_version": "large",
    "execution_time_ms": 200
  }
}
```

---

## 3. ChemBERTa API

### Endpoint
```
POST /api/text2mol
```

### Request
```json
{
  "text": "An anti-inflammatory compound similar to ibuprofen",
  "options": {
    "top_k": 50,
    "top_p": 0.9,
    "temperature": 0.8
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| text | string | Yes | Natural language description |
| options.top_k | int | No | Top-k sampling (default: 50) |
| options.top_p | float | No | Nucleus sampling (default: 0.9) |
| options.temperature | float | No | Sampling temperature (default: 0.8) |

### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "smiles": ["CC(C)Cc1ccc(C(C)C(=O)O)cc1"],
    "confidence": [0.88],
    "model_name": "chemberta",
    "model_version": "77M-MTR",
    "execution_time_ms": 180
  }
}
```

---

## 4. Health Check Endpoint (All Models)

### Endpoint
```
GET /health
```

### Response
```json
{
  "status": "healthy",
  "model_name": "your_model",
  "model_version": "1.0.0",
  "gpu_available": true,
  "uptime_seconds": 3600
}
```

---

## 5. Model Info Endpoint (All Models)

### Endpoint
```
GET /api/info
```

### Response
```json
{
  "model_name": "your_model",
  "model_version": "1.0.0",
  "description": "Custom Text-to-Molecule model trained on ChEMBL dataset",
  "supported_features": ["text2mol", "mol2text"],
  "max_input_length": 512,
  "supported_output_formats": ["SMILES", "SELFIES"]
}
```

---

## Example Python Server Implementation

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import time

app = FastAPI(title="Your Model API")

class TextToMolRequest(BaseModel):
    text: str
    options: Optional[dict] = None

class TextToMolResponse(BaseModel):
    success: bool
    data: dict = None
    error: dict = None

@app.post("/api/text2mol")
async def text_to_molecule(request: TextToMolRequest):
    start_time = time.time()
    
    try:
        # YOUR MODEL INFERENCE CODE HERE
        # smiles = model.generate(request.text)
        smiles = ["c1ccccc1"]  # Placeholder
        confidence = [0.95]
        
        execution_time = (time.time() - start_time) * 1000
        
        return TextToMolResponse(
            success=True,
            data={
                "smiles": smiles,
                "confidence": confidence,
                "model_name": "your_model",
                "model_version": "1.0.0",
                "execution_time_ms": execution_time
            }
        )
    except Exception as e:
        return TextToMolResponse(
            success=False,
            error={
                "code": "INFERENCE_ERROR",
                "message": str(e)
            }
        )

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_name": "your_model",
        "model_version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
```

---

## Integration Notes

### Environment Variables
```bash
# Backend .env configuration
YOUR_MODEL_API_URL="http://localhost:5001/api/text2mol"
MOLT5_API_URL="http://localhost:5002/api/text2mol"
CHEMBERTA_API_URL="http://localhost:5003/api/text2mol"
```

### Timeout Configuration
- Default timeout: 30 seconds
- For complex molecules: 60 seconds

### Error Handling
The platform will gracefully handle:
- Model unavailability (timeout/connection error)
- Invalid SMILES output (validation via RDKit)
- Rate limiting

### SMILES Validation
All generated SMILES are validated using RDKit before display:
```python
from rdkit import Chem
def validate_smiles(smiles: str) -> bool:
    mol = Chem.MolFromSmiles(smiles)
    return mol is not None
```
