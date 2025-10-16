"""
Autoilty.com Keyword Research & Clustering Tool
Generates 500+ automotive keywords with clustering and opportunity scoring
"""

import json
import re
from collections import defaultdict
from datetime import datetime

# Core keyword categories for Canadian automotive forum
KEYWORD_CATEGORIES = {
    "forum_core": [
        "car forum canada", "automotive forum canada", "auto enthusiast forum",
        "vehicle discussion forum", "car community canada", "canadian car forum",
        "car enthusiasts canada", "auto forum online", "car talk forum",
        "automotive discussion board"
    ],
    
    "maintenance_repair": [
        "car repair forum", "diy car maintenance", "auto repair advice",
        "car troubleshooting forum", "vehicle maintenance tips", 
        "how to fix car problems", "car repair help canada",
        "automotive repair discussion", "car maintenance forum",
        "auto repair community"
    ],
    
    "buying_selling": [
        "best car to buy canada", "car buying advice forum",
        "used car buying guide", "new car recommendations",
        "car buying tips canada", "should i buy this car",
        "car purchase advice", "vehicle buying forum",
        "car shopping help", "auto buying guide"
    ],
    
    "modifications": [
        "car mods canada", "vehicle modification forum",
        "auto tuning community", "car customization ideas",
        "performance upgrades forum", "car modding tips",
        "aftermarket parts discussion", "car modification advice",
        "auto tuning forum", "vehicle performance mods"
    ],
    
    "reviews": [
        "car reviews canada", "vehicle reviews forum",
        "honest car reviews", "user car reviews",
        "automotive reviews community", "car owner reviews",
        "real world car reviews", "vehicle reliability reviews",
        "car comparison forum", "auto reviews canada"
    ],
    
    "winter_specific": [
        "winter tires canada", "winter car maintenance",
        "best winter tires forum", "winter driving tips canada",
        "snow tire recommendations", "winter vehicle prep",
        "cold weather car care", "canadian winter driving",
        "winter tire reviews", "car winter preparation"
    ],
    
    "electric_vehicles": [
        "electric car forum canada", "ev discussion canada",
        "electric vehicle reviews", "ev range winter canada",
        "tesla forum canada", "ev charging canada",
        "electric car community", "ev buying guide canada",
        "hybrid car forum", "electric vehicle advice"
    ],
    
    "locations": [
        "toronto car forum", "vancouver auto community",
        "montreal car enthusiasts", "calgary vehicle forum",
        "ottawa auto discussion", "edmonton car forum",
        "winnipeg automotive forum", "quebec car community",
        "british columbia car forum", "ontario auto forum"
    ]
}

# Long-tail modifiers
MODIFIERS = {
    "questions": ["how to", "what is", "where to", "when to", "why", "which"],
    "year": ["2024", "2025"],
    "intent": ["best", "top", "guide", "tips", "advice", "help", "reviews"],
    "comparison": ["vs", "versus", "compared to", "or"],
    "problem": ["not working", "problem", "issue", "broken", "failed"]
}

class KeywordResearchTool:
    def __init__(self):
        self.keywords = []
        self.keyword_data = {}
        
    def generate_base_keywords(self):
        """Generate base keyword list from categories"""
        keywords = []
        for category, kw_list in KEYWORD_CATEGORIES.items():
            for kw in kw_list:
                keywords.append({
                    "keyword": kw,
                    "category": category,
                    "volume": self._estimate_volume(kw),
                    "competition": self._estimate_competition(kw),
                    "opportunity_score": 0
                })
        return keywords
    
    def generate_long_tail_variants(self, base_keywords):
        """Generate long-tail keyword variants"""
        variants = []
        
        for base_kw in base_keywords[:50]:  # Top 50 base keywords
            kw = base_kw["keyword"]
            
            # Question modifiers
            for q in MODIFIERS["questions"]:
                variants.append({
                    "keyword": f"{q} {kw}",
                    "category": base_kw["category"],
                    "type": "question",
                    "volume": base_kw["volume"] * 0.3,
                    "competition": base_kw["competition"] * 0.5,
                    "opportunity_score": 0
                })
            
            # Year modifiers
            for year in MODIFIERS["year"]:
                variants.append({
                    "keyword": f"{kw} {year}",
                    "category": base_kw["category"],
                    "type": "temporal",
                    "volume": base_kw["volume"] * 0.6,
                    "competition": base_kw["competition"] * 0.7,
                    "opportunity_score": 0
                })
            
            # Intent modifiers
            for intent in MODIFIERS["intent"][:3]:
                variants.append({
                    "keyword": f"{intent} {kw}",
                    "category": base_kw["category"],
                    "type": "intent",
                    "volume": base_kw["volume"] * 0.5,
                    "competition": base_kw["competition"] * 0.8,
                    "opportunity_score": 0
                })
        
        return variants
    
    def _estimate_volume(self, keyword):
        """Estimate search volume based on keyword characteristics"""
        # Simplified volume estimation
        base = 1000
        
        if "canada" in keyword.lower():
            base *= 0.15  # Canadian market is ~10-15% of US
        if "forum" in keyword.lower():
            base *= 0.8
        if "best" in keyword.lower() or "top" in keyword.lower():
            base *= 1.5
        if len(keyword.split()) > 4:
            base *= 0.5  # Long-tail typically lower volume
        
        return int(base)
    
    def _estimate_competition(self, keyword):
        """Estimate competition level (0-100)"""
        score = 50  # Base competition
        
        if "best" in keyword.lower() or "top" in keyword.lower():
            score += 20
        if "buy" in keyword.lower() or "purchase" in keyword.lower():
            score += 15
        if "canada" in keyword.lower():
            score -= 10
        if len(keyword.split()) > 4:
            score -= 15
        
        return max(0, min(100, score))
    
    def calculate_opportunity_score(self, keyword_obj):
        """Calculate keyword opportunity score (0-100)"""
        volume = keyword_obj["volume"]
        competition = keyword_obj["competition"]
        
        # Higher volume, lower competition = better opportunity
        if volume > 0:
            opportunity = (volume / 100) * (100 - competition) / 100
        else:
            opportunity = 0
        
        return min(100, int(opportunity))
    
    def cluster_keywords(self, keywords):
        """Cluster keywords by semantic similarity"""
        clusters = defaultdict(list)
        
        for kw_obj in keywords:
            kw = kw_obj["keyword"].lower()
            
            # Simple clustering by key terms
            if "winter" in kw or "snow" in kw:
                clusters["winter"].append(kw_obj)
            elif "electric" in kw or "ev" in kw or "hybrid" in kw:
                clusters["electric"].append(kw_obj)
            elif "buy" in kw or "purchase" in kw or "shopping" in kw:
                clusters["buying"].append(kw_obj)
            elif "repair" in kw or "fix" in kw or "maintenance" in kw:
                clusters["maintenance"].append(kw_obj)
            elif "mod" in kw or "custom" in kw or "tuning" in kw:
                clusters["modification"].append(kw_obj)
            else:
                clusters["general"].append(kw_obj)
        
        return clusters
    
    def generate_full_keyword_list(self):
        """Generate complete keyword list with all variants"""
        # Base keywords
        base = self.generate_base_keywords()
        
        # Long-tail variants
        variants = self.generate_long_tail_variants(base)
        
        # Combine
        all_keywords = base + variants
        
        # Calculate opportunity scores
        for kw in all_keywords:
            kw["opportunity_score"] = self.calculate_opportunity_score(kw)
        
        # Sort by opportunity score
        all_keywords.sort(key=lambda x: x["opportunity_score"], reverse=True)
        
        self.keywords = all_keywords
        return all_keywords
    
    def export_to_json(self, filename="keywords.json"):
        """Export keywords to JSON file"""
        data = {
            "generated_at": datetime.now().isoformat(),
            "total_keywords": len(self.keywords),
            "keywords": self.keywords,
            "clusters": {k: len(v) for k, v in self.cluster_keywords(self.keywords).items()}
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return filename
    
    def generate_meta_tags(self, keyword, page_type="forum"):
        """Generate optimized title and meta description"""
        templates = {
            "forum": {
                "title": f"{keyword.title()} | Autoilty Canada Auto Forum",
                "description": f"Join 50,000+ Canadian auto enthusiasts discussing {keyword}. Get expert advice, real reviews, and community support on Autoilty.com - Canada's premier automotive forum."
            },
            "guide": {
                "title": f"{keyword.title()} - Complete Guide | Autoilty",
                "description": f"Comprehensive guide to {keyword}. Expert tips, step-by-step instructions, and community insights from Canada's largest auto enthusiast forum."
            },
            "review": {
                "title": f"{keyword.title()} Reviews | Real User Experiences",
                "description": f"Honest {keyword} reviews from real Canadian car owners. Compare experiences, ratings, and recommendations on Autoilty.com."
            }
        }
        
        return templates.get(page_type, templates["forum"])
    
    def generate_content_brief(self, keyword):
        """Generate SEO content brief for a keyword"""
        return {
            "keyword": keyword,
            "word_count_target": "1500-2500 words",
            "headings": [
                f"What is {keyword}?",
                f"Why {keyword} Matters for Canadian Drivers",
                f"Expert Tips for {keyword}",
                f"Community Insights on {keyword}",
                f"Common Questions About {keyword}",
                f"Related Discussions"
            ],
            "internal_links": 5,
            "external_links": 3,
            "images": "3-5 with alt text",
            "schema": "ForumPosting, FAQPage",
            "readability": "Grade 8-10 level"
        }


# Generate keyword report
if __name__ == "__main__":
    tool = KeywordResearchTool()
    keywords = tool.generate_full_keyword_list()
    
    print(f"✅ Generated {len(keywords)} keywords")
    print(f"\n📊 Top 20 Opportunities:\n")
    
    for i, kw in enumerate(keywords[:20], 1):
        print(f"{i}. {kw['keyword']}")
        print(f"   Volume: {kw['volume']} | Competition: {kw['competition']} | Score: {kw['opportunity_score']}")
    
    # Export
    filename = tool.export_to_json("seo/autoilty_keywords.json")
    print(f"\n✅ Exported to {filename}")
    
    # Sample meta tags
    print(f"\n📝 Sample Meta Tags:")
    sample = tool.generate_meta_tags("car forum canada")
    print(f"Title: {sample['title']}")
    print(f"Description: {sample['description']}")

