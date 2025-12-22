from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random
import asyncio

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[str] = []

# Mock Knowledge Base
KNOWLEDGE_BASE = {
    "aspirin": {
        "text": "Aspirin (acetylsalicylic acid) is a nonsteroidal anti-inflammatory drug (NSAID) used to reduce pain, fever, and inflammation. Formula: C9H8O4.",
        "source": "PubChem CID 2244"
    },
    "ethanol": {
        "text": "Ethanol (alcohol) is a chemical compound with the formula C2H5OH. It is a volatile, flammable, colorless liquid with a wine-like odor and pungent taste.",
        "source": "PubChem CID 702"
    },
    "caffeine": {
        "text": "Caffeine is a central nervous system stimulant of the methylxanthine class. It is the world's most widely consumed psychoactive drug. Formula: C8H10N4O2.",
        "source": "PubChem CID 2519"
    }
}

@router.post("/chat", response_model=ChatResponse)
async def chat_with_knowledge_base(request: ChatRequest):
    # Simulate processing time
    await asyncio.sleep(1.0)
    
    query_lower = request.query.lower()
    
    # Simple Keyword Search (Simulated RAG)
    found_key = None
    for key in KNOWLEDGE_BASE:
        if key in query_lower:
            found_key = key
            break
            
    if found_key:
        data = KNOWLEDGE_BASE[found_key]
        return ChatResponse(
            answer=data["text"],
            sources=[data["source"]]
        )
        
    # Default AI response
    return ChatResponse(
        answer=f"I don't have specific data on that yet in my local database. However, based on general chemical knowledge, '{request.query}' seems to be a valid query. Try asking about 'aspirin', 'ethanol', or 'caffeine'.",
        sources=["General AI Knowledge"]
    )
