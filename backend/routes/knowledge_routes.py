"""
Knowledge Routes - RAG Chatbot and Molecule-to-Text Generation

Integrates with OpenAI GPT-4o for:
1. Chemistry knowledge Q&A (RAG-style chatbot)
2. Molecule-to-Text generation (describe molecules in natural language)
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone
import uuid

from services.llm_service import get_chat_session, get_mol2text_generator

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

def get_db():
    from server import db
    return db


# ============ Request/Response Models ============

class ChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = None
    context: Optional[str] = None  # Optional context for RAG

class ChatResponse(BaseModel):
    answer: str
    session_id: str
    sources: List[str] = []

class Mol2TextRequest(BaseModel):
    smiles: str
    additional_info: Optional[str] = None

class Mol2TextResponse(BaseModel):
    smiles: str
    description: str
    success: bool
    error: Optional[str] = None

class ChatMessage(BaseModel):
    id: str
    session_id: str
    role: str  # 'user' or 'assistant'
    content: str
    created_at: datetime


# ============ Chat Endpoints ============

@router.post("/chat", response_model=ChatResponse)
async def chat_with_knowledge_base(request: ChatRequest, db=Depends(get_db)):
    """
    Chat with the AI chemistry assistant.
    Uses OpenAI GPT-4o with chemistry expertise.
    """
    # Generate or use existing session ID
    session_id = request.session_id or str(uuid.uuid4())
    
    try:
        # Get chat session
        chat = get_chat_session(session_id)
        
        # Send message and get response
        result = await chat.ask(request.query, context=request.context)
        
        if result['success']:
            # Save chat history to database
            user_msg = ChatMessage(
                id=str(uuid.uuid4()),
                session_id=session_id,
                role='user',
                content=request.query,
                created_at=datetime.now(timezone.utc)
            )
            assistant_msg = ChatMessage(
                id=str(uuid.uuid4()),
                session_id=session_id,
                role='assistant',
                content=result['answer'],
                created_at=datetime.now(timezone.utc)
            )
            
            # Store in DB
            await db.chat_history.insert_many([
                {**user_msg.model_dump(), 'created_at': user_msg.created_at.isoformat()},
                {**assistant_msg.model_dump(), 'created_at': assistant_msg.created_at.isoformat()}
            ])
            
            return ChatResponse(
                answer=result['answer'],
                session_id=session_id,
                sources=["OpenAI GPT-4o", "Chemistry Knowledge Base"]
            )
        else:
            raise HTTPException(status_code=500, detail=result.get('error', 'Chat failed'))
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chat/history/{session_id}", response_model=List[ChatMessage])
async def get_chat_history(session_id: str, db=Depends(get_db)):
    """Get chat history for a session"""
    cursor = db.chat_history.find(
        {"session_id": session_id}, 
        {"_id": 0}
    ).sort("created_at", 1)
    
    messages = await cursor.to_list(length=100)
    return messages


@router.get("/chat/sessions")
async def list_chat_sessions(db=Depends(get_db)):
    """List all chat sessions"""
    pipeline = [
        {"$group": {
            "_id": "$session_id",
            "message_count": {"$sum": 1},
            "last_message": {"$max": "$created_at"},
            "first_message": {"$first": "$content"}
        }},
        {"$sort": {"last_message": -1}},
        {"$limit": 50}
    ]
    
    sessions = await db.chat_history.aggregate(pipeline).to_list(length=50)
    return sessions


# ============ Molecule-to-Text Endpoints ============

@router.post("/mol2text", response_model=Mol2TextResponse)
async def molecule_to_text(request: Mol2TextRequest):
    """
    Generate natural language description from SMILES.
    Uses OpenAI GPT-4o to analyze and describe the molecule.
    """
    try:
        generator = get_mol2text_generator()
        result = await generator.generate_description(
            request.smiles, 
            request.additional_info
        )
        
        if result['success']:
            return Mol2TextResponse(
                smiles=request.smiles,
                description=result['description'],
                success=True
            )
        else:
            return Mol2TextResponse(
                smiles=request.smiles,
                description="",
                success=False,
                error=result.get('error', 'Generation failed')
            )
            
    except Exception as e:
        return Mol2TextResponse(
            smiles=request.smiles,
            description="",
            success=False,
            error=str(e)
        )


# ============ Model Info Endpoints ============

@router.get("/models/available")
async def get_available_models():
    """Get list of available Text-to-Molecule models"""
    from services.molecule_service import get_available_models
    return await get_available_models()
