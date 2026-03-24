from groq import Groq
import os
from typing import List, Dict, Any
import json
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        # Use API key from environment variable
        groq_api_key = os.getenv('GROQ_API_KEY', '')
        if not groq_api_key or groq_api_key == 'placeholder-key-not-configured':
            print("⚠️ WARNING: GROQ_API_KEY not configured. AI features will be disabled.")
            self.client = None
            self.model = None
        else:
            self.client = Groq(api_key=groq_api_key)
            # Using llama-3.1-8b-instant for fast and reliable responses
            self.model = "llama-3.1-8b-instant"
    
    def generate_blog_content(self, topic: str, keywords: List[str] = [], target_length: str = "medium") -> Dict[str, Any]:
        """Generate comprehensive blog content using AI"""
        
        if not self.client:
            raise Exception("AI service not configured. Please set GROQ_API_KEY environment variable.")
        
        length_guide = {
            "short": "800-1200 words",
            "medium": "1500-2500 words", 
            "long": "3000-5000 words"
        }
        
        keywords_str = ", ".join(keywords) if keywords else ""
        
        prompt = f"""
        Create a comprehensive, engaging blog post about: {topic}
        
        Requirements:
        - Target length: {length_guide.get(target_length, "1500-2500 words")}
        - Include these keywords naturally: {keywords_str}
        - Professional, informative tone
        - Include actionable insights
        - Structure with clear headings and subheadings
        - Add a compelling introduction and conclusion
        - Include practical examples where relevant
        
        Format the response as JSON with these fields:
        - title: Blog title (SEO optimized)
        - excerpt: Brief summary (150-200 words)
        - content: Full blog content in HTML format with proper headings
        - seo_title: SEO optimized title
        - seo_description: Meta description (150-160 chars)
        - seo_keywords: Comma separated keywords
        - tags: Array of relevant tags
        - reading_time: Estimated reading time in minutes
        """
        
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_completion_tokens=8192,
                top_p=1
            )
            
            response_content = completion.choices[0].message.content
            
            # Try to parse as JSON, fallback to structured text
            try:
                return json.loads(response_content)
            except json.JSONDecodeError:
                # If not JSON, create structured response
                return {
                    "title": f"AI Generated: {topic}",
                    "excerpt": response_content[:200] + "...",
                    "content": f"<h1>{topic}</h1>\n<div>{response_content}</div>",
                    "seo_title": f"{topic} - Complete Guide",
                    "seo_description": response_content[:150] + "...",
                    "seo_keywords": ", ".join(keywords) if keywords else topic,
                    "tags": keywords if keywords else [topic.split()[0]],
                    "reading_time": max(1, len(response_content.split()) // 200)
                }
                
        except Exception as e:
            raise Exception(f"AI blog generation failed: {str(e)}")
    
    def compare_tools(self, tool_names: List[str], comparison_criteria: List[str] = []) -> Dict[str, Any]:
        """Generate AI-powered tool comparison"""
        
        criteria = comparison_criteria if comparison_criteria else [
            "Features", "Pricing", "Ease of Use", "Customer Support", "Integration Capabilities"
        ]
        
        tools_str = ", ".join(tool_names)
        criteria_str = ", ".join(criteria)
        
        prompt = f"""
        Create a comprehensive, blog-ready comparison of these tools: {tools_str}
        
        Compare them based on: {criteria_str}
        
        For each tool, provide:
        1. Overview and key strengths
        2. Detailed pros and cons
        3. Best use cases  
        4. Pricing analysis (with specific plans if known)
        5. Ratings out of 5 for: features, pricing, ease_of_use, customer_support, integration_capabilities
        
        Also provide:
        - Overall winner recommendation
        - Summary comparing key metrics
        - Final verdict for different scenarios
        
        Format as JSON with these exact fields:
        {{
          "overall_winner": "tool name",
          "detailed_comparison": [
            {{
              "name": "tool name",
              "overview_and_key_strengths": {{
                "overview": "brief overview",
                "key_strengths": ["strength1", "strength2", ...]
              }},
              "pros_and_cons": {{
                "pros": ["pro1", "pro2", ...],
                "cons": ["con1", "con2", ...]
              }},
              "best_use_cases": ["use case 1", "use case 2", ...],
              "pricing_analysis": {{
                "plans": [
                  {{"name": "plan name", "price": "price", "features": "key features"}}
                ],
                "notes": "pricing notes"
              }},
              "ratings": {{
                "features": 4.5,
                "pricing": 3.0,
                "ease_of_use": 4.0,
                "customer_support": 4.5,
                "integration_capabilities": 3.5,
                "total_score": 19.5
              }}
            }}
          ],
          "summary": "overall comparison summary",
          "blog_content": "complete HTML blog post content with proper headings, paragraphs, and formatting"
        }}
        
        Make the blog_content field ready for publishing with proper HTML structure.
        """
        
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_completion_tokens=8192,
                top_p=1
            )
            
            response_content = completion.choices[0].message.content
            
            try:
                return json.loads(response_content)
            except json.JSONDecodeError:
                # Fallback structured response
                return {
                    "overall_winner": tool_names[0] if tool_names else "N/A",
                    "detailed_comparison": [
                        {
                            "tool_name": tool,
                            "pros": ["Feature rich", "Good value"],
                            "cons": ["Learning curve", "Limited integrations"],
                            "rating": 4.0,
                            "best_for": "General use cases"
                        } for tool in tool_names
                    ],
                    "summary": response_content,
                    "criteria_used": criteria
                }
                
        except Exception as e:
            raise Exception(f"AI tool comparison failed: {str(e)}")
    
    def generate_seo_content(self, page_type: str, main_keyword: str, additional_info: str = "") -> Dict[str, Any]:
        """Generate SEO optimized content for pages"""
        
        prompt = f"""
        Generate SEO optimized content for a {page_type} page targeting the keyword: {main_keyword}
        Additional context: {additional_info}
        
        Provide:
        - SEO optimized title (under 60 chars)
        - Meta description (150-160 chars)
        - H1 heading
        - List of related keywords
        - JSON-LD structured data appropriate for the page type
        - Content outline with key sections
        
        Format as JSON for easy parsing.
        """
        
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_completion_tokens=4096,
                top_p=1
            )
            
            response_content = completion.choices[0].message.content
            
            try:
                return json.loads(response_content)
            except json.JSONDecodeError:
                return {
                    "seo_title": f"{main_keyword} - Complete Guide",
                    "meta_description": f"Discover everything about {main_keyword}. Comprehensive guide with expert insights and practical tips.",
                    "h1_heading": f"Ultimate Guide to {main_keyword}",
                    "related_keywords": [main_keyword, f"{main_keyword} guide", f"best {main_keyword}"],
                    "json_ld": {"@type": "Article", "headline": f"{main_keyword} Guide"},
                    "content_outline": response_content
                }
                
        except Exception as e:
            raise Exception(f"SEO content generation failed: {str(e)}")
    
    def recommend_tools(self, user_needs: str, available_tools: List[Dict], features_needed: List[str] = [], limit: int = 5) -> Dict[str, Any]:
        """AI-powered tool recommendation based on user needs"""
        
        tools_summary = "\n".join([
            f"- {t['name']}: {t['description'][:150]}... | Features: {', '.join(t['features'][:3]) if t['features'] else 'N/A'} | Pricing: {t['pricing_type']} | Rating: {t['rating']} | Best for: {t.get('best_for', 'N/A')}"
            for t in available_tools[:30]
        ])
        
        features_str = ", ".join(features_needed) if features_needed else "general use"
        
        prompt = f"""
        Analyze and recommend the best tools for a user with the following needs:
        
        USER NEEDS: {user_needs}
        FEATURES WANTED: {features_str}
        
        AVAILABLE TOOLS:
        {tools_summary}
        
        Based on the user's needs, select the top {limit} most suitable tools.
        
        Return a JSON object with:
        {{
            "recommendations": [
                {{
                    "id": "tool_id_here",
                    "reason": "Why this tool is recommended",
                    "score": 0.95  // Match score between 0 and 1
                }}
            ],
            "analysis": "Brief analysis of why these tools were selected"
        }}
        
        Only include tools from the provided list. Match tool names exactly.
        """
        
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_completion_tokens=2048,
                top_p=1
            )
            
            response_content = completion.choices[0].message.content
            
            # Try to parse JSON from response
            try:
                # Clean up response if needed
                if "```json" in response_content:
                    response_content = response_content.split("```json")[1].split("```")[0]
                elif "```" in response_content:
                    response_content = response_content.split("```")[1].split("```")[0]
                
                result = json.loads(response_content.strip())
                
                # Map tool names back to IDs
                name_to_id = {t['name'].lower(): t['id'] for t in available_tools}
                
                for rec in result.get("recommendations", []):
                    # If ID is actually a name, convert it
                    if rec.get("id") and rec["id"].lower() in name_to_id:
                        rec["id"] = name_to_id[rec["id"].lower()]
                    elif not any(t['id'] == rec.get("id") for t in available_tools):
                        # Try to find by partial name match
                        for tool in available_tools:
                            if tool['name'].lower() in str(rec.get("id", "")).lower() or str(rec.get("id", "")).lower() in tool['name'].lower():
                                rec["id"] = tool['id']
                                break
                
                return result
                
            except json.JSONDecodeError:
                # Fallback: return top rated tools
                top_tools = sorted(available_tools, key=lambda x: x['rating'], reverse=True)[:limit]
                return {
                    "recommendations": [
                        {"id": t['id'], "reason": f"High rating ({t['rating']}) and matches general needs", "score": 0.7}
                        for t in top_tools
                    ],
                    "analysis": response_content[:500] if response_content else "Recommended based on ratings and relevance."
                }
                
        except Exception as e:
            raise Exception(f"AI recommendation failed: {str(e)}")

# Global AI service instance
ai_service = AIService()