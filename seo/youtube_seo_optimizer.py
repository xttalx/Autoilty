"""
YouTube SEO Optimization Tool for Autoilty.com
Maximize video discoverability and forum traffic from YouTube
"""

import json
import re

class YouTubeSEOOptimizer:
    def __init__(self):
        self.max_title_length = 70
        self.max_description_length = 5000
        self.max_tags = 500  # characters
        
    def optimize_video_title(self, topic, keyword):
        """Generate YouTube-optimized video titles"""
        templates = [
            f"{keyword} | Complete Guide for Canadian Drivers",
            f"How to {keyword} - Step by Step Tutorial",
            f"{keyword}: Everything You Need to Know (2025)",
            f"The Truth About {keyword} in Canada",
            f"Is {keyword} Worth It? Real Owner Review",
            f"{keyword} vs [Alternative] - Which is Better?",
            f"I Tested {keyword} for 6 Months - Here's What Happened"
        ]
        
        # Select based on content type
        optimized_titles = []
        for template in templates:
            if len(template) <= self.max_title_length:
                optimized_titles.append({
                    "title": template,
                    "length": len(template),
                    "hook_words": self._count_hook_words(template),
                    "score": self._score_title(template)
                })
        
        return sorted(optimized_titles, key=lambda x: x['score'], reverse=True)
    
    def _count_hook_words(self, title):
        """Count attention-grabbing words"""
        hook_words = [
            'secret', 'truth', 'exposed', 'revealed', 'shocking',
            'ultimate', 'complete', 'best', 'worst', 'avoid',
            'tested', 'real', 'honest', 'vs', 'comparison'
        ]
        count = 0
        title_lower = title.lower()
        for word in hook_words:
            if word in title_lower:
                count += 1
        return count
    
    def _score_title(self, title):
        """Score title based on YouTube best practices"""
        score = 0
        
        # Length optimization (50-70 chars ideal)
        if 50 <= len(title) <= 70:
            score += 10
        
        # Hook words
        score += self._count_hook_words(title) * 5
        
        # Number in title
        if re.search(r'\d+', title):
            score += 5
        
        # Question mark
        if '?' in title:
            score += 5
        
        # Year mentioned
        if '2025' in title or '2024' in title:
            score += 3
        
        # Brackets or parentheses
        if '(' in title or '[' in title:
            score += 3
        
        return score
    
    def generate_video_description(self, topic, keyword, forum_links):
        """Generate SEO-optimized video description"""
        description = f"""
{topic} - Complete guide for Canadian car enthusiasts!

In this video, I cover everything you need to know about {keyword}. Based on real experiences from 50,000+ members of Canada's largest auto community.

⏰ TIMESTAMPS:
0:00 - Introduction
0:45 - What is {keyword}?
2:15 - Why it matters for Canadian drivers
4:30 - Step-by-step guide
8:45 - Common mistakes to avoid
11:20 - Pro tips from experts
13:50 - Real user experiences
15:30 - Conclusion and next steps

🔗 USEFUL LINKS:
Join the Discussion: {forum_links.get('thread', 'https://autoilty.com/forum.html')}
Ask Questions: https://autoilty.com/qa.html
Read Reviews: https://autoilty.com/reviews.html
Browse Guides: https://autoilty.com/guides.html

📊 RESOURCES MENTIONED:
[Link to tool/calculator]
[Link to checklist]
[Link to comparison chart]

🌐 ABOUT AUTOILTY:
Autoilty.com is Canada's premier automotive community with 50,000+ active members. We provide honest advice, real reviews, and expert guidance for Canadian car enthusiasts.

Website: https://autoilty.com
Forum: https://autoilty.com/forum.html
Facebook: facebook.com/autoilty
Twitter: twitter.com/autoilty
Instagram: instagram.com/autoilty

📧 CONTACT:
Questions? Join our forum or email: contact@autoilty.com

#Autoilty #CanadianCars #{keyword.replace(' ', '')}

---

DISCLAIMER: This video contains information based on community experiences and should not replace professional automotive advice. Always consult with a qualified mechanic for specific vehicle issues.

🔔 Subscribe for weekly automotive content!
👍 Like if you found this helpful!
💬 Comment your experience with {keyword}!
📢 Share with fellow car enthusiasts!
"""
        
        return description[:self.max_description_length]
    
    def generate_tags(self, primary_keyword, topic_category):
        """Generate comprehensive tag list"""
        tag_categories = {
            "primary": [
                primary_keyword,
                f"{primary_keyword} canada",
                f"{primary_keyword} 2025"
            ],
            
            "related": [
                "car tips",
                "automotive advice",
                "car maintenance",
                "vehicle guide",
                "auto enthusiast"
            ],
            
            "location": [
                "canada",
                "canadian cars",
                "toronto",
                "vancouver",
                "montreal"
            ],
            
            "brand": [
                "autoilty",
                "autoilty canada",
                "car forum canada"
            ],
            
            "category_specific": {
                "maintenance": [
                    "diy car repair",
                    "car maintenance tips",
                    "auto service"
                ],
                "buying": [
                    "car buying guide",
                    "vehicle shopping",
                    "best cars"
                ],
                "winter": [
                    "winter driving",
                    "canadian winter",
                    "snow tires"
                ],
                "electric": [
                    "electric vehicles",
                    "ev canada",
                    "hybrid cars"
                ]
            }
        }
        
        # Combine tags
        all_tags = []
        all_tags.extend(tag_categories["primary"])
        all_tags.extend(tag_categories["related"][:3])
        all_tags.extend(tag_categories["location"][:3])
        all_tags.extend(tag_categories["brand"])
        
        # Add category-specific
        if topic_category in tag_categories["category_specific"]:
            all_tags.extend(tag_categories["category_specific"][topic_category][:3])
        
        # Ensure total length under 500 characters
        tag_string = ", ".join(all_tags)
        if len(tag_string) > self.max_tags:
            # Trim tags
            all_tags = all_tags[:int(len(all_tags) * self.max_tags / len(tag_string))]
        
        return all_tags
    
    def create_custom_thumbnail_guide(self):
        """Guidelines for creating click-worthy thumbnails"""
        return {
            "dimensions": "1280x720 pixels (16:9 ratio)",
            "file_size": "Under 2MB",
            "file_format": "JPG, PNG, or GIF",
            
            "design_principles": {
                "text": [
                    "3-5 words maximum",
                    "Bold, high-contrast font",
                    "Minimum 30pt font size",
                    "Readable on mobile"
                ],
                "visual": [
                    "Close-up face with emotion OR",
                    "Clear product/vehicle shot",
                    "High contrast colors",
                    "Avoid clutter"
                ],
                "colors": [
                    "Use brand colors (#E2231A red)",
                    "High saturation",
                    "Contrast with YouTube's white/dark theme"
                ],
                "elements": [
                    "Large number if applicable",
                    "Arrow or emphasis marker",
                    "Before/after split if relevant",
                    "Question mark for curiosity"
                ]
            },
            
            "examples": [
                "Close-up of surprised face + '40% LESS?'",
                "Car in snow + 'TESTED: Winter Tires'",
                "Split screen comparison + 'WHICH ONE?'",
                "Large '$5,000 SAVED' text + car image"
            ]
        }
    
    def generate_video_script_template(self, topic):
        """Template for video scripts optimized for retention"""
        return {
            "intro": {
                "duration": "0-15 seconds",
                "elements": [
                    "Hook (pose problem or surprising statement)",
                    "What viewer will learn",
                    "Why they should watch"
                ],
                "example": f"Did you know that {topic} could save you $2,000 a year? In this video, I'll show you exactly how, with real data from 50,000 Canadian drivers. Let's dive in!"
            },
            
            "main_content": {
                "duration": "1-12 minutes",
                "structure": [
                    {
                        "section": "Context",
                        "duration": "30-60s",
                        "content": "Explain the problem/situation"
                    },
                    {
                        "section": "Solution/Guide",
                        "duration": "5-8 minutes",
                        "content": "Step-by-step walkthrough with visuals"
                    },
                    {
                        "section": "Examples",
                        "duration": "2-3 minutes",
                        "content": "Real user stories and results"
                    }
                ],
                "retention_tactics": [
                    "Tease upcoming information",
                    "Add B-roll every 5-10 seconds",
                    "Use text overlays for key points",
                    "Include pattern interrupts (zoom, music change)",
                    "Ask questions to keep engagement"
                ]
            },
            
            "outro": {
                "duration": "15-30 seconds",
                "elements": [
                    "Summarize key points",
                    "Call to action (join forum)",
                    "Ask for like/subscribe",
                    "Mention next video topic"
                ],
                "example": "So there you have it - everything about {topic}. Want to discuss this with other Canadian car enthusiasts? Join 50,000+ members on Autoilty.com - link in description. Don't forget to subscribe for weekly car tips!"
            },
            
            "cta_placements": [
                "0:15 - Verbal mention of forum",
                "Mid-roll - 'Link in description for full guide'",
                "End screen - Forum link card",
                "Pinned comment - Forum thread link"
            ]
        }
    
    def create_video_series_plan(self):
        """Plan for ongoing video series"""
        return {
            "weekly_series": [
                {
                    "name": "Monday Myth Busters",
                    "format": "Debunk automotive myths with data",
                    "length": "5-7 minutes",
                    "forum_tie_in": "Post myth poll on forum, discuss results"
                },
                {
                    "name": "Wednesday How-To",
                    "format": "Step-by-step maintenance tutorials",
                    "length": "10-15 minutes",
                    "forum_tie_in": "Share your results thread"
                },
                {
                    "name": "Friday Forum Highlights",
                    "format": "Answer top forum questions",
                    "length": "8-12 minutes",
                    "forum_tie_in": "Featured questions from community"
                }
            ],
            
            "monthly_specials": [
                {
                    "name": "Community Spotlight",
                    "format": "Feature member's car/project",
                    "benefit": "Engagement + unique content"
                },
                {
                    "name": "Data Deep Dive",
                    "format": "Original research/survey results",
                    "benefit": "Authority + media coverage"
                }
            ]
        }
    
    def optimize_for_youtube_algorithm(self):
        """Algorithm optimization tactics"""
        return {
            "watch_time": {
                "target": "50%+ average view duration",
                "tactics": [
                    "Hook in first 15 seconds",
                    "Pattern interrupts every 30s",
                    "Tease content throughout",
                    "Deliver on title promise",
                    "Ideal length: 8-12 minutes"
                ]
            },
            
            "click_through_rate": {
                "target": "8%+ CTR",
                "tactics": [
                    "Compelling thumbnail",
                    "Curiosity-driven title",
                    "A/B test thumbnails",
                    "Update thumbnails if CTR <5%"
                ]
            },
            
            "engagement": {
                "metrics": "Likes, comments, shares",
                "tactics": [
                    "Ask questions in video",
                    "Pin engaging comment",
                    "Respond to comments quickly",
                    "Create controversy (tastefully)",
                    "Use community tab for polls"
                ]
            },
            
            "consistency": {
                "schedule": "Same day/time each week",
                "frequency": "Minimum 1 video/week",
                "benefit": "Algorithm favors regular uploaders"
            }
        }
    
    def export_video_metadata(self, video_data):
        """Export complete video metadata package"""
        return {
            "title": video_data['title'],
            "description": self.generate_video_description(
                video_data['topic'],
                video_data['keyword'],
                video_data.get('forum_links', {})
            ),
            "tags": self.generate_tags(
                video_data['keyword'],
                video_data.get('category', 'general')
            ),
            "thumbnail_specs": self.create_custom_thumbnail_guide(),
            "playlist": video_data.get('playlist', 'General Auto Tips'),
            "category": "Autos & Vehicles",
            "language": "English (Canada)",
            "captions": "Auto-generate + manual review",
            "end_screen": {
                "video_1": "Best performing video",
                "video_2": "Related topic",
                "subscribe": "Channel subscribe button",
                "link": "Autoilty.com/forum"
            },
            "cards": [
                {"time": "2:00", "type": "link", "text": "Join Discussion", "url": "autoilty.com"},
                {"time": "6:00", "type": "poll", "question": "Have you tried this?"}
            ]
        }


# Example usage
if __name__ == "__main__":
    optimizer = YouTubeSEOOptimizer()
    
    # Optimize title
    titles = optimizer.optimize_video_title(
        "Winter tire installation",
        "winter tires canada"
    )
    
    print("🎬 Optimized Video Titles:")
    for i, title in enumerate(titles[:5], 1):
        print(f"{i}. {title['title']} (Score: {title['score']})")
    
    # Generate tags
    tags = optimizer.generate_tags("winter tires canada", "winter")
    print(f"\n🏷️ Video Tags:")
    print(", ".join(tags))
    
    # Generate description
    forum_links = {
        "thread": "https://autoilty.com/forum/thread/106"
    }
    description = optimizer.generate_video_description(
        "Winter Tires in Canada",
        "winter tires",
        forum_links
    )
    print(f"\n📝 Video Description:")
    print(description[:500] + "...")

