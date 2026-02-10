"""
Rich Text Utilities for Blog Content Processing
Handles sanitization, optimization, and SEO enhancement
"""
import re
import bleach
from typing import Dict, Optional, List
from PIL import Image
import io
import os
from urllib.parse import urlparse

# Allowed HTML tags for rich text content
ALLOWED_TAGS = [
    'p', 'br', 'strong', 'em', 'u', 's', 'strike', 'del',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img', 'iframe',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span',
    'hr'
]

ALLOWED_ATTRIBUTES = {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height', 'loading', 'class'],
    'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'loading'],
    'code': ['class'],
    'pre': ['class'],
    'div': ['class', 'data-language'],
    'span': ['class'],
    'p': ['class'],
    'h1': ['id'],
    'h2': ['id'],
    'h3': ['id'],
    'h4': ['id'],
    'h5': ['id'],
    'h6': ['id'],
}

ALLOWED_PROTOCOLS = ['http', 'https', 'mailto']


def sanitize_html(html_content: str) -> str:
    """
    Sanitize HTML content to prevent XSS attacks while preserving formatting
    """
    return bleach.clean(
        html_content,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        protocols=ALLOWED_PROTOCOLS,
        strip=True
    )


def extract_text_from_html(html_content: str) -> str:
    """
    Extract plain text from HTML for SEO purposes
    """
    # Remove script and style elements
    html_content = re.sub(r'<script[^>]*>.*?</script>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
    html_content = re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', ' ', html_content)
    
    # Decode HTML entities
    text = bleach.clean(text, tags=[], strip=True)
    
    # Clean up whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text


def calculate_reading_time(content: str) -> int:
    """
    Calculate estimated reading time in minutes based on word count
    """
    # Extract text from HTML
    text = extract_text_from_html(content)
    
    # Count words
    word_count = len(text.split())
    
    # Average reading speed: 200-250 words per minute
    reading_time = max(1, round(word_count / 225))
    
    return reading_time


def generate_seo_metadata(title: str, content: str, excerpt: Optional[str] = None) -> Dict:
    """
    Generate SEO metadata from blog content
    """
    # Extract plain text from content
    plain_text = extract_text_from_html(content)
    
    # Generate SEO title (max 60 characters for optimal display)
    seo_title = title[:60] if len(title) <= 60 else title[:57] + '...'
    
    # Generate SEO description (max 155-160 characters)
    if excerpt:
        seo_description = excerpt[:155] if len(excerpt) <= 155 else excerpt[:152] + '...'
    else:
        seo_description = plain_text[:155] if len(plain_text) <= 155 else plain_text[:152] + '...'
    
    # Extract keywords from content (simple approach)
    keywords = extract_keywords(plain_text)
    
    return {
        'seo_title': seo_title,
        'seo_description': seo_description,
        'seo_keywords': ', '.join(keywords[:10])
    }


def extract_keywords(text: str, max_keywords: int = 15) -> List[str]:
    """
    Extract keywords from text (simplified version)
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove punctuation and split into words
    words = re.findall(r'\b[a-z]{3,}\b', text)
    
    # Common stop words to filter out
    stop_words = {
        'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
        'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
        'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy',
        'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'with', 'this',
        'that', 'from', 'they', 'have', 'been', 'more', 'will', 'about', 'than'
    }
    
    # Filter and count words
    word_freq = {}
    for word in words:
        if word not in stop_words and len(word) > 3:
            word_freq[word] = word_freq.get(word, 0) + 1
    
    # Sort by frequency and return top keywords
    sorted_keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
    return [word for word, _ in sorted_keywords[:max_keywords]]


def generate_json_ld(blog_data: Dict) -> Dict:
    """
    Generate JSON-LD structured data for SEO
    """
    json_ld = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog_data.get('title', ''),
        "description": blog_data.get('seo_description', ''),
        "author": {
            "@type": "Person",
            "name": blog_data.get('author_name', 'Anonymous')
        },
        "datePublished": blog_data.get('published_at', blog_data.get('created_at', '')),
        "dateModified": blog_data.get('updated_at', ''),
    }
    
    # Add image if available
    if blog_data.get('featured_image'):
        json_ld['image'] = blog_data['featured_image']
    
    # Add keywords
    if blog_data.get('seo_keywords'):
        json_ld['keywords'] = blog_data['seo_keywords']
    
    return json_ld


def optimize_image(image_path: str, max_width: int = 1200, quality: int = 85) -> bool:
    """
    Optimize image for web performance
    Returns True if optimization was successful
    """
    try:
        with Image.open(image_path) as img:
            # Convert RGBA to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Resize if image is too large
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save optimized image
            img.save(image_path, 'JPEG', quality=quality, optimize=True)
            
        return True
    except Exception as e:
        print(f"Error optimizing image {image_path}: {e}")
        return False


def extract_first_image(html_content: str) -> Optional[str]:
    """
    Extract the first image URL from HTML content
    """
    img_match = re.search(r'<img[^>]+src=["\'](.*?)["\']', html_content, re.IGNORECASE)
    if img_match:
        return img_match.group(1)
    return None


def add_lazy_loading_to_images(html_content: str) -> str:
    """
    Add lazy loading attribute to images for better performance
    """
    # Add loading="lazy" to all img tags that don't already have it
    html_content = re.sub(
        r'<img(?![^>]*loading=)([^>]*)>',
        r'<img loading="lazy"\1>',
        html_content,
        flags=re.IGNORECASE
    )
    
    return html_content


def ensure_external_links_security(html_content: str) -> str:
    """
    Add rel="noopener noreferrer" to external links for security
    """
    # Add rel attributes to external links
    def add_rel(match):
        link = match.group(0)
        if 'target="_blank"' in link and 'rel=' not in link:
            return link.replace('>', ' rel="noopener noreferrer">', 1)
        return link
    
    html_content = re.sub(r'<a[^>]+>', add_rel, html_content, flags=re.IGNORECASE)
    
    return html_content


def process_blog_content(content: str, optimize: bool = True) -> str:
    """
    Process blog content: sanitize, optimize for performance and SEO
    """
    # Sanitize HTML
    content = sanitize_html(content)
    
    if optimize:
        # Add lazy loading to images
        content = add_lazy_loading_to_images(content)
        
        # Ensure external links are secure
        content = ensure_external_links_security(content)
    
    return content
