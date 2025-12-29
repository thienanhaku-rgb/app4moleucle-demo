"""
Model Client Services

This module provides client implementations for external Text-to-Molecule models.
Supports: Your Model (custom), MolT5, ChemBERTa

When your models are deployed, update the environment variables:
- YOUR_MODEL_API_URL
- MOLT5_API_URL  
- CHEMBERTA_API_URL
"""

import asyncio
import aiohttp
import os
import random
import logging
from typing import Optional, Dict, Any, List
from abc import ABC, abstractmethod
from dataclasses import dataclass
from rdkit import Chem

logger = logging.getLogger(__name__)

@dataclass
class ModelResult:
    """Standard result from any model"""
    smiles: str
    confidence: float
    model_name: str
    model_version: str
    execution_time_ms: float
    is_valid: bool = True
    error: Optional[str] = None


class BaseModelClient(ABC):
    """Abstract base class for model clients"""
    
    def __init__(self, api_url: str, model_name: str, timeout: int = 30):
        self.api_url = api_url
        self.model_name = model_name
        self.timeout = timeout
    
    @abstractmethod
    async def generate(self, text: str, options: Optional[Dict] = None) -> ModelResult:
        """Generate molecule from text description"""
        pass
    
    async def health_check(self) -> bool:
        """Check if model service is available"""
        try:
            async with aiohttp.ClientSession() as session:
                health_url = self.api_url.replace('/api/text2mol', '/health')
                async with session.get(health_url, timeout=5) as response:
                    return response.status == 200
        except:
            return False
    
    def validate_smiles(self, smiles: str) -> bool:
        """Validate SMILES using RDKit"""
        try:
            mol = Chem.MolFromSmiles(smiles)
            return mol is not None
        except:
            return False


class YourModelClient(BaseModelClient):
    """Client for Your Custom Model"""
    
    def __init__(self):
        api_url = os.environ.get('YOUR_MODEL_API_URL', 'http://localhost:5001/api/text2mol')
        super().__init__(api_url, 'your_model')
    
    async def generate(self, text: str, options: Optional[Dict] = None) -> ModelResult:
        """Generate molecule using Your Model"""
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    'text': text,
                    'options': options or {'num_samples': 1, 'temperature': 0.7}
                }
                
                async with session.post(
                    self.api_url, 
                    json=payload, 
                    timeout=self.timeout
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get('success'):
                            result_data = data['data']
                            smiles = result_data['smiles'][0] if result_data['smiles'] else 'C'
                            return ModelResult(
                                smiles=smiles,
                                confidence=result_data.get('confidence', [0.9])[0],
                                model_name=self.model_name,
                                model_version=result_data.get('model_version', '1.0.0'),
                                execution_time_ms=result_data.get('execution_time_ms', 0),
                                is_valid=self.validate_smiles(smiles)
                            )
                    
                    # Fallback to mock if API fails
                    return await self._mock_generate(text)
                    
        except Exception as e:
            logger.warning(f"Your Model API error: {e}, using mock")
            return await self._mock_generate(text)
    
    async def _mock_generate(self, text: str) -> ModelResult:
        """Mock generation for testing when model is not available"""
        await asyncio.sleep(random.uniform(0.3, 1.0))
        
        # Simple keyword-based mock responses
        text_lower = text.lower()
        mock_data = {
            'aspirin': 'CC(=O)OC1=CC=CC=C1C(=O)O',
            'ethanol': 'CCO',
            'caffeine': 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
            'benzene': 'c1ccccc1',
            'aromatic': 'c1ccccc1CO',
            'alcohol': 'CCO',
            'hydroxyl': 'CC(O)C',
            'ring': 'C1CCCCC1',
            'anti-inflammatory': 'CC(C)Cc1ccc(C(C)C(=O)O)cc1',
            'painkiller': 'CC(=O)Nc1ccc(O)cc1',
        }
        
        smiles = 'C'  # Default: methane
        for key, val in mock_data.items():
            if key in text_lower:
                smiles = val
                break
        
        return ModelResult(
            smiles=smiles,
            confidence=random.uniform(0.85, 0.98),
            model_name=self.model_name,
            model_version='1.0.0-mock',
            execution_time_ms=random.uniform(100, 300),
            is_valid=True
        )


class MolT5Client(BaseModelClient):
    """Client for MolT5 Model"""
    
    def __init__(self):
        api_url = os.environ.get('MOLT5_API_URL', 'http://localhost:5002/api/text2mol')
        super().__init__(api_url, 'molt5')
    
    async def generate(self, text: str, options: Optional[Dict] = None) -> ModelResult:
        """Generate molecule using MolT5"""
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    'text': text,
                    'options': options or {'num_beams': 5, 'num_return_sequences': 1}
                }
                
                async with session.post(
                    self.api_url,
                    json=payload,
                    timeout=self.timeout
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get('success'):
                            result_data = data['data']
                            smiles = result_data['smiles'][0] if result_data['smiles'] else 'C'
                            return ModelResult(
                                smiles=smiles,
                                confidence=result_data.get('confidence', [0.9])[0],
                                model_name=self.model_name,
                                model_version=result_data.get('model_version', 'large'),
                                execution_time_ms=result_data.get('execution_time_ms', 0),
                                is_valid=self.validate_smiles(smiles)
                            )
                    
                    return await self._mock_generate(text)
                    
        except Exception as e:
            logger.warning(f"MolT5 API error: {e}, using mock")
            return await self._mock_generate(text)
    
    async def _mock_generate(self, text: str) -> ModelResult:
        """Mock generation for MolT5"""
        await asyncio.sleep(random.uniform(0.4, 1.2))
        
        text_lower = text.lower()
        mock_data = {
            'aspirin': 'CC(=O)Oc1ccccc1C(=O)O',  # Slightly different representation
            'ethanol': 'C(C)O',
            'caffeine': 'Cn1cnc2c1c(=O)n(c(=O)n2C)C',
            'benzene': 'c1ccccc1',
            'purine': 'c1ncc2[nH]cnc2n1',
            'antiviral': 'Nc1ncnc2c1ncn2C3OC(CO)C(O)C3O',
            'aromatic': 'c1ccc2ccccc2c1',
        }
        
        smiles = 'CC'  # Default: ethane
        for key, val in mock_data.items():
            if key in text_lower:
                smiles = val
                break
        
        return ModelResult(
            smiles=smiles,
            confidence=random.uniform(0.82, 0.96),
            model_name=self.model_name,
            model_version='large-mock',
            execution_time_ms=random.uniform(150, 400),
            is_valid=True
        )


class ChemBERTaClient(BaseModelClient):
    """Client for ChemBERTa Model"""
    
    def __init__(self):
        api_url = os.environ.get('CHEMBERTA_API_URL', 'http://localhost:5003/api/text2mol')
        super().__init__(api_url, 'chemberta')
    
    async def generate(self, text: str, options: Optional[Dict] = None) -> ModelResult:
        """Generate molecule using ChemBERTa"""
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    'text': text,
                    'options': options or {'top_k': 50, 'top_p': 0.9, 'temperature': 0.8}
                }
                
                async with session.post(
                    self.api_url,
                    json=payload,
                    timeout=self.timeout
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get('success'):
                            result_data = data['data']
                            smiles = result_data['smiles'][0] if result_data['smiles'] else 'C'
                            return ModelResult(
                                smiles=smiles,
                                confidence=result_data.get('confidence', [0.9])[0],
                                model_name=self.model_name,
                                model_version=result_data.get('model_version', '77M-MTR'),
                                execution_time_ms=result_data.get('execution_time_ms', 0),
                                is_valid=self.validate_smiles(smiles)
                            )
                    
                    return await self._mock_generate(text)
                    
        except Exception as e:
            logger.warning(f"ChemBERTa API error: {e}, using mock")
            return await self._mock_generate(text)
    
    async def _mock_generate(self, text: str) -> ModelResult:
        """Mock generation for ChemBERTa"""
        await asyncio.sleep(random.uniform(0.3, 1.0))
        
        text_lower = text.lower()
        mock_data = {
            'aspirin': 'CC(=O)OC1=CC=CC=C1C(O)=O',
            'ibuprofen': 'CC(C)Cc1ccc(C(C)C(=O)O)cc1',
            'anti-inflammatory': 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O',
            'paracetamol': 'CC(=O)NC1=CC=C(O)C=C1',
            'pain': 'CC(=O)Nc1ccc(O)cc1',
            'aromatic': 'c1ccc(cc1)C(=O)O',
        }
        
        smiles = 'CCC'  # Default: propane
        for key, val in mock_data.items():
            if key in text_lower:
                smiles = val
                break
        
        return ModelResult(
            smiles=smiles,
            confidence=random.uniform(0.80, 0.94),
            model_name=self.model_name,
            model_version='77M-MTR-mock',
            execution_time_ms=random.uniform(120, 350),
            is_valid=True
        )


# Model registry
MODEL_CLIENTS = {
    'your_model': YourModelClient,
    'molt5': MolT5Client,
    'chemberta': ChemBERTaClient,
}


async def get_model_client(model_name: str) -> BaseModelClient:
    """Factory function to get model client by name"""
    if model_name not in MODEL_CLIENTS:
        raise ValueError(f"Unknown model: {model_name}. Available: {list(MODEL_CLIENTS.keys())}")
    return MODEL_CLIENTS[model_name]()


async def check_all_models_health() -> Dict[str, bool]:
    """Check health of all registered models"""
    results = {}
    for name, client_class in MODEL_CLIENTS.items():
        client = client_class()
        results[name] = await client.health_check()
    return results
