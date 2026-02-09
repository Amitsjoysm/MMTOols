"""
User Interaction Routes
Handles reviews, ratings, likes, and tool comparison for regular users
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, or_
from pydantic import BaseModel
from typing import List, Optional
from database import get_db
from models import User, Tool, Blog, Review, ToolLike, BlogLike, ToolComment, BlogComment
from auth import get_current_user
import uuid
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


# ===== PYDANTIC MODELS =====

class ReviewCreate(BaseModel):
    tool_id: str
    rating: int  # 1-5
    title: str
    content: str
    pros: Optional[List[str]] = None
    cons: Optional[List[str]] = None


class ReviewResponse(BaseModel):
    id: str
    tool_id: str
    tool_name: str
    user_id: str
    user_name: str
    rating: int
    title: str
    content: str
    pros: Optional[List[str]]
    cons: Optional[List[str]]
    created_at: datetime
    updated_at: datetime


class CommentCreate(BaseModel):
    content: str


class CommentResponse(BaseModel):
    id: str
    user_id: str
    user_name: str
    content: str
    created_at: datetime


class ToolComparisonResponse(BaseModel):
    tool_id: str
    name: str
    logo_url: Optional[str]
    short_description: Optional[str]
    pricing_model: Optional[str]
    rating: float
    review_count: int
    pros: List[str]
    cons: List[str]
    key_features: Optional[dict]


# ===== TOOL REVIEWS =====

@router.post("/api/user/tools/{tool_id}/review", response_model=ReviewResponse)
async def create_tool_review(
    tool_id: str,
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a review for a tool"""
    
    # Check if tool exists
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    # Check if user already reviewed this tool
    existing = db.query(Review).filter(
        Review.tool_id == tool_id,
        Review.user_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="You have already reviewed this tool. Use update endpoint to modify."
        )
    
    # Validate rating
    if review_data.rating < 1 or review_data.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # Create review
    review = Review(
        id=str(uuid.uuid4()),
        tool_id=tool_id,
        user_id=current_user.id,
        rating=review_data.rating,
        title=review_data.title,
        content=review_data.content,
        pros=review_data.pros,
        cons=review_data.cons
    )
    
    db.add(review)
    
    # Update tool rating
    all_reviews = db.query(Review).filter(Review.tool_id == tool_id).all()
    avg_rating = (sum(r.rating for r in all_reviews) + review_data.rating) / (len(all_reviews) + 1)
    tool.rating = round(avg_rating, 2)
    
    db.commit()
    db.refresh(review)
    
    logger.info(f"User {current_user.username} created review for tool {tool.name}")
    
    return ReviewResponse(
        id=review.id,
        tool_id=review.tool_id,
        tool_name=tool.name,
        user_id=review.user_id,
        user_name=current_user.full_name or current_user.username,
        rating=review.rating,
        title=review.title,
        content=review.content,
        pros=review.pros or [],
        cons=review.cons or [],
        created_at=review.created_at,
        updated_at=review.updated_at
    )


@router.put("/api/user/tools/{tool_id}/review", response_model=ReviewResponse)
async def update_tool_review(
    tool_id: str,
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's review for a tool"""
    
    review = db.query(Review).filter(
        Review.tool_id == tool_id,
        Review.user_id == current_user.id
    ).first()
    
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Validate rating
    if review_data.rating < 1 or review_data.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # Update review
    review.rating = review_data.rating
    review.title = review_data.title
    review.comment = review_data.comment
    review.pros = review_data.pros
    review.cons = review_data.cons
    review.updated_at = datetime.utcnow()
    
    # Recalculate tool rating
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    all_reviews = db.query(Review).filter(Review.tool_id == tool_id).all()
    avg_rating = sum(r.rating for r in all_reviews) / len(all_reviews)
    tool.rating = round(avg_rating, 2)
    
    db.commit()
    db.refresh(review)
    
    return ReviewResponse(
        id=review.id,
        tool_id=review.tool_id,
        tool_name=tool.name,
        user_id=review.user_id,
        user_name=current_user.full_name or current_user.username,
        rating=review.rating,
        title=review.title,
        comment=review.comment,
        pros=review.pros,
        cons=review.cons,
        helpful_count=review.helpful_count,
        created_at=review.created_at,
        updated_at=review.updated_at
    )


@router.get("/api/user/tools/{tool_id}/my-review", response_model=Optional[ReviewResponse])
async def get_my_tool_review(
    tool_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's review for a tool"""
    
    review = db.query(Review).options(joinedload(Review.tool)).filter(
        Review.tool_id == tool_id,
        Review.user_id == current_user.id
    ).first()
    
    if not review:
        return None
    
    return ReviewResponse(
        id=review.id,
        tool_id=review.tool_id,
        tool_name=review.tool.name,
        user_id=review.user_id,
        user_name=current_user.full_name or current_user.username,
        rating=review.rating,
        title=review.title,
        comment=review.comment,
        pros=review.pros,
        cons=review.cons,
        helpful_count=review.helpful_count,
        created_at=review.created_at,
        updated_at=review.updated_at
    )


@router.delete("/api/user/tools/{tool_id}/review")
async def delete_tool_review(
    tool_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user's review for a tool"""
    
    review = db.query(Review).filter(
        Review.tool_id == tool_id,
        Review.user_id == current_user.id
    ).first()
    
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    db.delete(review)
    
    # Recalculate tool rating
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    all_reviews = db.query(Review).filter(Review.tool_id == tool_id).all()
    if all_reviews:
        avg_rating = sum(r.rating for r in all_reviews) / len(all_reviews)
        tool.rating = round(avg_rating, 2)
    else:
        tool.rating = 0.0
    
    db.commit()
    
    return {"message": "Review deleted successfully"}


# ===== TOOL LIKES =====

@router.post("/api/user/tools/{tool_id}/like")
async def like_tool(
    tool_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Like a tool"""
    
    # Check if tool exists
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    # Check if already liked
    existing = db.query(ToolLike).filter(
        ToolLike.tool_id == tool_id,
        ToolLike.user_id == current_user.id
    ).first()
    
    if existing:
        return {"message": "Already liked", "liked": True}
    
    # Create like
    like = ToolLike(
        id=str(uuid.uuid4()),
        tool_id=tool_id,
        user_id=current_user.id
    )
    
    db.add(like)
    db.commit()
    
    return {"message": "Tool liked successfully", "liked": True}


@router.delete("/api/user/tools/{tool_id}/like")
async def unlike_tool(
    tool_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Unlike a tool"""
    
    like = db.query(ToolLike).filter(
        ToolLike.tool_id == tool_id,
        ToolLike.user_id == current_user.id
    ).first()
    
    if not like:
        raise HTTPException(status_code=404, detail="Like not found")
    
    db.delete(like)
    db.commit()
    
    return {"message": "Tool unliked successfully", "liked": False}


@router.get("/api/user/tools/{tool_id}/liked")
async def check_tool_liked(
    tool_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if user has liked a tool"""
    
    like = db.query(ToolLike).filter(
        ToolLike.tool_id == tool_id,
        ToolLike.user_id == current_user.id
    ).first()
    
    return {"liked": like is not None}


# ===== BLOG LIKES =====

@router.post("/api/user/blogs/{blog_id}/like")
async def like_blog(
    blog_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Like a blog"""
    
    # Check if blog exists
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    # Check if already liked
    existing = db.query(BlogLike).filter(
        BlogLike.blog_id == blog_id,
        BlogLike.user_id == current_user.id
    ).first()
    
    if existing:
        return {"message": "Already liked", "liked": True}
    
    # Create like
    like = BlogLike(
        id=str(uuid.uuid4()),
        blog_id=blog_id,
        user_id=current_user.id
    )
    
    db.add(like)
    blog.like_count = (blog.like_count or 0) + 1
    db.commit()
    
    return {"message": "Blog liked successfully", "liked": True}


@router.delete("/api/user/blogs/{blog_id}/like")
async def unlike_blog(
    blog_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Unlike a blog"""
    
    like = db.query(BlogLike).filter(
        BlogLike.blog_id == blog_id,
        BlogLike.user_id == current_user.id
    ).first()
    
    if not like:
        raise HTTPException(status_code=404, detail="Like not found")
    
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    
    db.delete(like)
    if blog:
        blog.like_count = max(0, (blog.like_count or 0) - 1)
    db.commit()
    
    return {"message": "Blog unliked successfully", "liked": False}


@router.get("/api/user/blogs/{blog_id}/liked")
async def check_blog_liked(
    blog_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if user has liked a blog"""
    
    like = db.query(BlogLike).filter(
        BlogLike.blog_id == blog_id,
        BlogLike.user_id == current_user.id
    ).first()
    
    return {"liked": like is not None}


# ===== TOOL COMPARISON =====

@router.post("/api/user/tools/compare")
async def compare_tools(
    tool_ids: List[str],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Compare multiple tools (up to 5)"""
    
    if len(tool_ids) < 2:
        raise HTTPException(status_code=400, detail="At least 2 tools required for comparison")
    
    if len(tool_ids) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 tools can be compared")
    
    tools = db.query(Tool).filter(Tool.id.in_(tool_ids)).all()
    
    if len(tools) != len(tool_ids):
        raise HTTPException(status_code=404, detail="One or more tools not found")
    
    comparison_data = []
    
    for tool in tools:
        # Get reviews for pros/cons
        reviews = db.query(Review).filter(Review.tool_id == tool.id).all()
        
        pros = []
        cons = []
        
        for review in reviews:
            if review.pros:
                pros.extend([p.strip() for p in review.pros.split('\n') if p.strip()])
            if review.cons:
                cons.extend([c.strip() for c in review.cons.split('\n') if c.strip()])
        
        # Get top 5 most mentioned
        from collections import Counter
        pros = [p for p, count in Counter(pros).most_common(5)]
        cons = [c for c, count in Counter(cons).most_common(5)]
        
        comparison_data.append(
            ToolComparisonResponse(
                tool_id=tool.id,
                name=tool.name,
                logo_url=tool.logo_url,
                short_description=tool.short_description,
                pricing_model=tool.pricing_model,
                rating=tool.rating or 0.0,
                review_count=len(reviews),
                pros=pros,
                cons=cons,
                key_features=tool.key_features
            )
        )
    
    return {
        "tools": comparison_data,
        "compared_at": datetime.utcnow(),
        "compared_by": current_user.id
    }


# ===== TOOL COMMENTS =====

@router.post("/api/user/tools/{tool_id}/comment", response_model=CommentResponse)
async def create_tool_comment(
    tool_id: str,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a comment on a tool"""
    
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    comment = ToolComment(
        id=str(uuid.uuid4()),
        tool_id=tool_id,
        user_id=current_user.id,
        content=comment_data.content
    )
    
    db.add(comment)
    db.commit()
    db.refresh(comment)
    
    return CommentResponse(
        id=comment.id,
        user_id=comment.user_id,
        user_name=current_user.full_name or current_user.username,
        content=comment.content,
        created_at=comment.created_at
    )


@router.get("/api/user/tools/{tool_id}/comments", response_model=List[CommentResponse])
async def get_tool_comments(
    tool_id: str,
    db: Session = Depends(get_db)
):
    """Get all comments for a tool"""
    
    comments = db.query(ToolComment).options(joinedload(ToolComment.user)).filter(
        ToolComment.tool_id == tool_id
    ).order_by(desc(ToolComment.created_at)).all()
    
    return [
        CommentResponse(
            id=comment.id,
            user_id=comment.user_id,
            user_name=comment.user.full_name or comment.user.username,
            content=comment.content,
            created_at=comment.created_at
        )
        for comment in comments
    ]


# ===== BLOG COMMENTS =====

@router.post("/api/user/blogs/{blog_id}/comment", response_model=CommentResponse)
async def create_blog_comment(
    blog_id: str,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a comment on a blog"""
    
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    comment = BlogComment(
        id=str(uuid.uuid4()),
        blog_id=blog_id,
        user_id=current_user.id,
        content=comment_data.content
    )
    
    db.add(comment)
    db.commit()
    db.refresh(comment)
    
    return CommentResponse(
        id=comment.id,
        user_id=comment.user_id,
        user_name=current_user.full_name or current_user.username,
        content=comment.content,
        created_at=comment.created_at
    )


@router.get("/api/user/blogs/{blog_id}/comments", response_model=List[CommentResponse])
async def get_blog_comments(
    blog_id: str,
    db: Session = Depends(get_db)
):
    """Get all comments for a blog"""
    
    comments = db.query(BlogComment).options(joinedload(BlogComment.user)).filter(
        BlogComment.blog_id == blog_id
    ).order_by(desc(BlogComment.created_at)).all()
    
    return [
        CommentResponse(
            id=comment.id,
            user_id=comment.user_id,
            user_name=comment.user.full_name or comment.user.username,
            content=comment.content,
            created_at=comment.created_at
        )
        for comment in comments
    ]
