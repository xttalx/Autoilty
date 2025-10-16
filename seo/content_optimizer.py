"""
Content Quality Optimizer for E-E-A-T (Experience, Expertise, Authoritativeness, Trust)
Ethical white-hat content enhancement
"""

import re
import json
from datetime import datetime

class ContentOptimizer:
    def __init__(self):
        self.min_word_count = 300
        self.ideal_word_count = 1500
        self.max_keyword_density = 0.03  # 3%
        self.reading_level_target = (8, 12)  # Grade 8-12
        
    def analyze_content(self, text):
        """Comprehensive content analysis"""
        words = text.split()
        sentences = re.split(r'[.!?]+', text)
        
        analysis = {
            'word_count': len(words),
            'sentence_count': len([s for s in sentences if s.strip()]),
            'avg_sentence_length': len(words) / max(len(sentences), 1),
            'paragraphs': len(text.split('\n\n')),
            'readability_score': self._calculate_readability(text),
            'keyword_density': {},
            'internal_links': len(re.findall(r'href=["\']/', text)),
            'external_links': len(re.findall(r'href=["\']http', text)) - len(re.findall(r'href=["\']/', text)),
            'images': len(re.findall(r'<img', text)),
            'headings': {
                'h1': len(re.findall(r'<h1', text)),
                'h2': len(re.findall(r'<h2', text)),
                'h3': len(re.findall(r'<h3', text))
            }
        }
        
        return analysis
    
    def _calculate_readability(self, text):
        """Flesch Reading Ease score"""
        words = len(text.split())
        sentences = len(re.split(r'[.!?]+', text))
        syllables = self._count_syllables(text)
        
        if words == 0 or sentences == 0:
            return 0
        
        # Flesch Reading Ease formula
        score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
        return round(score, 1)
    
    def _count_syllables(self, text):
        """Simple syllable counter"""
        vowels = 'aeiouAEIOU'
        count = 0
        for word in text.split():
            word = word.lower().strip('.,!?;:')
            syllable_count = 0
            previous_was_vowel = False
            for char in word:
                is_vowel = char in vowels
                if is_vowel and not previous_was_vowel:
                    syllable_count += 1
                previous_was_vowel = is_vowel
            if syllable_count == 0:
                syllable_count = 1
            count += syllable_count
        return count
    
    def generate_content_structure(self, topic, keyword):
        """Generate SEO-optimized content structure"""
        return {
            "title": f"{keyword.title()} - Complete Guide for Canadian Car Enthusiasts",
            "meta_description": f"Expert guide to {keyword} from Canada's largest auto community. Real experiences, proven tips, and honest advice from 50,000+ members.",
            "outline": [
                {
                    "heading": "Introduction",
                    "content_points": [
                        f"What is {keyword} and why it matters",
                        "Who should read this guide",
                        "What you'll learn"
                    ]
                },
                {
                    "heading": f"Understanding {keyword}",
                    "content_points": [
                        "Core concepts explained",
                        "Common misconceptions",
                        "Real-world applications"
                    ]
                },
                {
                    "heading": f"{keyword} for Canadian Drivers",
                    "content_points": [
                        "Canada-specific considerations",
                        "Climate and weather factors",
                        "Regional variations (BC, ON, QC, etc.)"
                    ]
                },
                {
                    "heading": "Expert Tips and Best Practices",
                    "content_points": [
                        "Professional recommendations",
                        "Community insights from 50k+ members",
                        "Proven strategies that work"
                    ]
                },
                {
                    "heading": "Common Questions and Answers",
                    "content_points": [
                        "FAQ from real users",
                        "Troubleshooting common issues",
                        "When to seek professional help"
                    ]
                },
                {
                    "heading": "Community Discussions",
                    "content_points": [
                        "Top forum threads on this topic",
                        "Real user experiences",
                        "Join the conversation"
                    ]
                },
                {
                    "heading": "Conclusion and Next Steps",
                    "content_points": [
                        "Key takeaways",
                        "Action items",
                        "Related resources"
                    ]
                }
            ],
            "internal_links": [
                {"text": "Join our forum", "url": "/forum.html"},
                {"text": "Ask a question", "url": "/qa.html"},
                {"text": "Read reviews", "url": "/reviews.html"},
                {"text": "Browse guides", "url": "/guides.html"},
                {"text": "Use our tools", "url": "/tools.html"}
            ],
            "e_e_a_t_elements": {
                "experience": "Include real user testimonials and case studies",
                "expertise": "Cite automotive experts and mechanics",
                "authoritativeness": "Reference industry standards and certifications",
                "trust": "Include verified user reviews and ratings"
            },
            "call_to_action": f"Join 50,000+ Canadian auto enthusiasts discussing {keyword}. Share your experience or ask questions in our active community forum."
        }
    
    def generate_faq_schema(self, faqs):
        """Generate FAQ schema markup"""
        faq_items = []
        for faq in faqs:
            faq_items.append({
                "@type": "Question",
                "name": faq['question'],
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq['answer']
                }
            })
        
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faq_items
        }
    
    def optimize_for_featured_snippet(self, topic):
        """Generate content optimized for featured snippets"""
        templates = {
            "definition": {
                "format": "paragraph",
                "structure": f"{topic.title()} is [concise 40-60 word definition with key benefits or characteristics]. This is important because [relevance to user].",
                "word_count": "40-60 words"
            },
            "list": {
                "format": "ordered_list",
                "structure": [
                    "Start with action verb",
                    "Keep each step to 1-2 sentences",
                    "Include 3-8 steps total",
                    "Use simple, clear language"
                ],
                "word_count": "40-50 words per item"
            },
            "table": {
                "format": "html_table",
                "structure": "2-3 columns, 3-9 rows, comparison data",
                "word_count": "Short, scannable cells"
            },
            "video": {
                "format": "youtube_embed",
                "requirements": ["Timestamp key moments", "Accurate transcript", "Descriptive title"]
            }
        }
        
        return templates
    
    def generate_internal_linking_strategy(self, current_page, related_topics):
        """Generate intelligent internal linking suggestions"""
        link_suggestions = []
        
        for topic in related_topics:
            link_suggestions.append({
                "anchor_text": topic['title'],
                "url": topic['url'],
                "relevance_score": topic.get('relevance', 0),
                "placement": "contextual" if topic.get('highly_related') else "sidebar",
                "rationale": f"Provides additional context on {topic['category']}"
            })
        
        return sorted(link_suggestions, key=lambda x: x['relevance_score'], reverse=True)
    
    def create_author_bio_schema(self, author):
        """Generate author schema for E-E-A-T"""
        return {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": author['name'],
            "url": f"https://autoilty.com/users/{author['id']}",
            "image": author.get('avatar', ''),
            "description": author.get('bio', ''),
            "sameAs": author.get('social_profiles', []),
            "affiliation": {
                "@type": "Organization",
                "name": "Autoilty",
                "url": "https://autoilty.com"
            },
            "jobTitle": author.get('role', 'Community Member'),
            "knowsAbout": author.get('expertise', []),
            "memberOf": {
                "@type": "Organization",
                "name": "Autoilty Community",
                "url": "https://autoilty.com/forum.html"
            }
        }
    
    def generate_content_freshness_plan(self, content_type):
        """Generate content update schedule for freshness"""
        schedules = {
            "guide": {
                "frequency": "quarterly",
                "update_triggers": [
                    "New model year releases",
                    "Regulatory changes",
                    "Technology updates",
                    "Significant community feedback"
                ],
                "update_elements": [
                    "Statistics and data",
                    "Product recommendations",
                    "Pricing information",
                    "Community testimonials"
                ]
            },
            "review": {
                "frequency": "bi-annually",
                "update_triggers": [
                    "New versions/models",
                    "Major recalls or issues",
                    "Long-term reliability data",
                    "User-reported experiences"
                ]
            },
            "forum_post": {
                "frequency": "as_needed",
                "signals": [
                    "New replies (weekly check)",
                    "Upvotes/engagement (daily)",
                    "Solved status (real-time)",
                    "Moderator updates"
                ]
            }
        }
        
        return schedules.get(content_type, schedules["guide"])
    
    def export_content_checklist(self, content_piece):
        """Generate pre-publish SEO checklist"""
        checklist = {
            "basic_seo": [
                {"item": "Target keyword in title", "status": False},
                {"item": "Meta description (150-155 chars)", "status": False},
                {"item": "URL slug optimized", "status": False},
                {"item": "Alt text for all images", "status": False},
                {"item": "Header hierarchy (H1 > H2 > H3)", "status": False}
            ],
            "content_quality": [
                {"item": "Word count 1500+ words", "status": False},
                {"item": "Reading level Grade 8-12", "status": False},
                {"item": "Original, unique content", "status": False},
                {"item": "Proper grammar and spelling", "status": False},
                {"item": "Includes expert insights", "status": False}
            ],
            "e_e_a_t": [
                {"item": "Author bio/credentials", "status": False},
                {"item": "Sources cited", "status": False},
                {"item": "Last updated date", "status": False},
                {"item": "User testimonials/reviews", "status": False},
                {"item": "Contact/support info", "status": False}
            ],
            "technical": [
                {"item": "Schema markup added", "status": False},
                {"item": "Internal links (5+)", "status": False},
                {"item": "External authoritative links (2-3)", "status": False},
                {"item": "Mobile-responsive", "status": False},
                {"item": "Page speed <3s", "status": False}
            ],
            "engagement": [
                {"item": "Clear call-to-action", "status": False},
                {"item": "Comment section enabled", "status": False},
                {"item": "Social sharing buttons", "status": False},
                {"item": "Related content suggestions", "status": False},
                {"item": "Email capture option", "status": False}
            ]
        }
        
        return checklist


# Example usage
if __name__ == "__main__":
    optimizer = ContentOptimizer()
    
    # Generate content structure
    structure = optimizer.generate_content_structure(
        "winter tires",
        "best winter tires canada 2025"
    )
    
    print("📝 Content Structure Generated:")
    print(json.dumps(structure, indent=2))
    
    # Generate FAQ schema
    faqs = [
        {
            "question": "When should I install winter tires in Canada?",
            "answer": "Winter tires should be installed when temperatures consistently drop below 7°C, typically in October or November depending on your region. In Quebec, winter tires are mandatory from December 1 to March 15."
        },
        {
            "question": "What's the difference between all-season and winter tires?",
            "answer": "Winter tires use a softer rubber compound that remains flexible in cold temperatures, providing better traction on snow and ice. They also feature deeper tread patterns and more sipes (small slits) for improved grip in winter conditions."
        }
    ]
    
    faq_schema = optimizer.generate_faq_schema(faqs)
    print("\n📋 FAQ Schema:")
    print(json.dumps(faq_schema, indent=2))
    
    # Generate checklist
    checklist = optimizer.export_content_checklist({})
    print("\n✅ Pre-Publish Checklist:")
    for category, items in checklist.items():
        print(f"\n{category.upper().replace('_', ' ')}:")
        for item in items:
            print(f"  ☐ {item['item']}")

