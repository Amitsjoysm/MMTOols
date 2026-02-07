"""
Tool Claiming Routes
Allows users to claim tools for content management and promotion
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from pydantic import BaseModel
from typing import List, Optional
from database import get_db
from models import User, Tool
from auth import get_current_user, get_current_admin
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


class ToolClaimRequest(BaseModel):
    reason: Optional[str] = None
    intended_use: Optional[str] = None


class ToolClaimResponse(BaseModel):
    claim_id: Optional[str] = None
    tool_id: str
    tool_name: str
    claim_status: str
    rejection_reason: Optional[str] = None


class ClaimApprovalRequest(BaseModel):
    approved: bool
    rejection_reason: Optional[str] = None


@router.post("/api/tools/{tool_id}/claim", status_code=status.HTTP_201_CREATED)
async def claim_tool(
    tool_id: str,
    claim_request: ToolClaimRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    User requests to claim a tool
    """
    # Get the tool
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tool not found"
        )
    
    # Check if tool is already claimed
    if tool.claim_status == "approved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This tool has already been claimed by another user"
        )
    
    # Check if user already has a pending claim for this tool
    if tool.claim_status == "pending" and tool.claimed_by_user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a pending claim request for this tool"
        )
    
    # Create claim request
    tool.claimed_by_user_id = current_user.id
    tool.claim_status = "pending"
    tool.claim_request_date = datetime.utcnow()
    tool.claim_rejection_reason = None
    
    try:
        db.commit()
        db.refresh(tool)
        
        logger.info(f"User {current_user.username} requested to claim tool {tool.name} (ID: {tool.id})")
        
        return {
            "message": "Claim request submitted successfully",
            "tool_id": tool.id,
            "tool_name": tool.name,
            "claim_status": tool.claim_status,
            "claim_request_date": tool.claim_request_date
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating claim request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit claim request"
        )


@router.get("/api/user/claimed-tools")
async def get_user_claimed_tools(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all tools claimed by the current user
    """
    tools = db.query(Tool).filter(
        Tool.claimed_by_user_id == current_user.id
    ).order_by(desc(Tool.claim_request_date)).all()
    
    return [{
        "id": tool.id,
        "name": tool.name,
        "slug": tool.slug,
        "logo_url": tool.logo_url,
        "claim_status": tool.claim_status,
        "claim_request_date": tool.claim_request_date,
        "claim_approved_date": tool.claim_approved_date,
        "claim_rejection_reason": tool.claim_rejection_reason,
        "short_description": tool.short_description
    } for tool in tools]


@router.get("/api/user/can-claim/{tool_id}")
async def check_can_claim_tool(
    tool_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Check if current user can claim a tool
    """
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tool not found"
        )
    
    can_claim = tool.claim_status in ["unclaimed", "rejected"]
    already_claimed_by_user = tool.claimed_by_user_id == current_user.id
    
    return {
        "can_claim": can_claim and not (tool.claim_status == "pending" and already_claimed_by_user),
        "claim_status": tool.claim_status,
        "claimed_by_current_user": already_claimed_by_user,
        "message": _get_claim_status_message(tool, current_user.id)
    }


def _get_claim_status_message(tool: Tool, user_id: str) -> str:
    """Helper function to get appropriate message based on claim status"""
    if tool.claim_status == "unclaimed":
        return "This tool is available to claim"
    elif tool.claim_status == "pending":
        if tool.claimed_by_user_id == user_id:
            return "Your claim request is pending admin approval"
        else:
            return "This tool has a pending claim request from another user"
    elif tool.claim_status == "approved":
        if tool.claimed_by_user_id == user_id:
            return "You have successfully claimed this tool"
        else:
            return "This tool has been claimed by another user"
    elif tool.claim_status == "rejected":
        if tool.claimed_by_user_id == user_id:
            return f"Your claim request was rejected: {tool.claim_rejection_reason or 'No reason provided'}"
        else:
            return "This tool is available to claim"
    return "Unknown status"


@router.get("/api/admin/tool-claims")
async def get_pending_claims(
    status_filter: Optional[str] = "pending",
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Admin: Get all tool claim requests (pending by default)
    """
    query = db.query(Tool).options(joinedload(Tool.claimed_by))
    
    if status_filter and status_filter != "all":
        query = query.filter(Tool.claim_status == status_filter)
    
    tools = query.filter(Tool.claimed_by_user_id.isnot(None)).order_by(
        desc(Tool.claim_request_date)
    ).all()
    
    return [{
        "id": tool.id,
        "name": tool.name,
        "slug": tool.slug,
        "logo_url": tool.logo_url,
        "claim_status": tool.claim_status,
        "claim_request_date": tool.claim_request_date,
        "claim_approved_date": tool.claim_approved_date,
        "claim_rejection_reason": tool.claim_rejection_reason,
        "claimed_by": {
            "id": tool.claimed_by.id,
            "username": tool.claimed_by.username,
            "email": tool.claimed_by.email,
            "full_name": tool.claimed_by.full_name
        } if tool.claimed_by else None,
        "short_description": tool.short_description
    } for tool in tools]


@router.put("/api/admin/tool-claims/{tool_id}/approve")
async def approve_claim(
    tool_id: str,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Admin: Approve a tool claim request
    """
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tool not found"
        )
    
    if tool.claim_status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending claims can be approved"
        )
    
    tool.claim_status = "approved"
    tool.claim_approved_date = datetime.utcnow()
    tool.claim_rejection_reason = None
    
    try:
        db.commit()
        db.refresh(tool)
        
        logger.info(f"Admin {current_admin.username} approved claim for tool {tool.name} by user {tool.claimed_by_user_id}")
        
        return {
            "message": "Claim approved successfully",
            "tool_id": tool.id,
            "tool_name": tool.name,
            "claim_status": tool.claim_status,
            "claim_approved_date": tool.claim_approved_date
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Error approving claim: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to approve claim"
        )


@router.put("/api/admin/tool-claims/{tool_id}/reject")
async def reject_claim(
    tool_id: str,
    rejection: ClaimApprovalRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Admin: Reject a tool claim request
    """
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tool not found"
        )
    
    if tool.claim_status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending claims can be rejected"
        )
    
    tool.claim_status = "rejected"
    tool.claim_rejection_reason = rejection.rejection_reason or "No reason provided"
    tool.claim_approved_date = None
    
    try:
        db.commit()
        db.refresh(tool)
        
        logger.info(f"Admin {current_admin.username} rejected claim for tool {tool.name}")
        
        return {
            "message": "Claim rejected successfully",
            "tool_id": tool.id,
            "tool_name": tool.name,
            "claim_status": tool.claim_status,
            "rejection_reason": tool.claim_rejection_reason
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Error rejecting claim: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reject claim"
        )


@router.delete("/api/user/tool-claims/{tool_id}")
async def cancel_claim(
    tool_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    User: Cancel their own claim request
    """
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tool not found"
        )
    
    # Verify it's their claim
    if tool.claimed_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only cancel your own claim requests"
        )
    
    # Only allow canceling pending or rejected claims
    if tool.claim_status not in ["pending", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel an approved claim"
        )
    
    tool.claimed_by_user_id = None
    tool.claim_status = "unclaimed"
    tool.claim_request_date = None
    tool.claim_approved_date = None
    tool.claim_rejection_reason = None
    
    try:
        db.commit()
        
        logger.info(f"User {current_user.username} cancelled claim for tool {tool.name}")
        
        return {
            "message": "Claim cancelled successfully",
            "tool_id": tool.id,
            "tool_name": tool.name
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Error cancelling claim: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cancel claim"
        )
