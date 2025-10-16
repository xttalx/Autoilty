"""
XML Sitemap Generator for Autoilty.com
Generates dynamic sitemaps with priority and change frequency optimization
"""

from datetime import datetime, timedelta
import xml.etree.ElementTree as ET
from xml.dom import minidom

class SitemapGenerator:
    def __init__(self, base_url="https://autoilty.com"):
        self.base_url = base_url
        self.urlset = ET.Element('urlset')
        self.urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
        self.urlset.set('xmlns:news', 'http://www.google.com/schemas/sitemap-news/0.9')
        self.urlset.set('xmlns:image', 'http://www.google.com/schemas/sitemap-image/1.1')
        
    def add_url(self, loc, lastmod=None, changefreq='weekly', priority=0.5, images=None):
        """Add URL to sitemap"""
        url = ET.SubElement(self.urlset, 'url')
        
        loc_elem = ET.SubElement(url, 'loc')
        loc_elem.text = f"{self.base_url}{loc}"
        
        if lastmod:
            lastmod_elem = ET.SubElement(url, 'lastmod')
            if isinstance(lastmod, datetime):
                lastmod_elem.text = lastmod.strftime('%Y-%m-%d')
            else:
                lastmod_elem.text = lastmod
        
        changefreq_elem = ET.SubElement(url, 'changefreq')
        changefreq_elem.text = changefreq
        
        priority_elem = ET.SubElement(url, 'priority')
        priority_elem.text = str(priority)
        
        # Add images if provided
        if images:
            for img in images:
                image_elem = ET.SubElement(url, 'image:image')
                image_loc = ET.SubElement(image_elem, 'image:loc')
                image_loc.text = img['url']
                if 'title' in img:
                    image_title = ET.SubElement(image_elem, 'image:title')
                    image_title.text = img['title']
        
        return url
    
    def generate_homepage_sitemap(self):
        """Generate sitemap entries for static pages"""
        pages = [
            {'loc': '/', 'priority': 1.0, 'changefreq': 'daily'},
            {'loc': '/forum.html', 'priority': 0.9, 'changefreq': 'hourly'},
            {'loc': '/qa.html', 'priority': 0.9, 'changefreq': 'hourly'},
            {'loc': '/reviews.html', 'priority': 0.8, 'changefreq': 'daily'},
            {'loc': '/guides.html', 'priority': 0.8, 'changefreq': 'weekly'},
            {'loc': '/tools.html', 'priority': 0.7, 'changefreq': 'weekly'},
            {'loc': '/about.html', 'priority': 0.5, 'changefreq': 'monthly'},
            {'loc': '/contact.html', 'priority': 0.5, 'changefreq': 'monthly'},
        ]
        
        for page in pages:
            self.add_url(
                page['loc'],
                lastmod=datetime.now(),
                changefreq=page['changefreq'],
                priority=page['priority']
            )
    
    def generate_forum_sitemap(self, threads):
        """Generate sitemap entries for forum threads"""
        for thread in threads:
            # Calculate priority based on engagement
            priority = min(0.9, 0.5 + (thread.get('replies', 0) / 1000))
            
            # Calculate change frequency based on activity
            days_since_update = (datetime.now() - thread.get('lastUpdate', datetime.now())).days
            if days_since_update < 1:
                changefreq = 'hourly'
            elif days_since_update < 7:
                changefreq = 'daily'
            elif days_since_update < 30:
                changefreq = 'weekly'
            else:
                changefreq = 'monthly'
            
            self.add_url(
                f"/forum/thread/{thread['id']}",
                lastmod=thread.get('lastUpdate'),
                changefreq=changefreq,
                priority=priority,
                images=thread.get('images', [])
            )
    
    def generate_category_sitemap(self, categories):
        """Generate sitemap entries for forum categories"""
        for category in categories:
            self.add_url(
                f"/forum/category/{category['id']}",
                lastmod=datetime.now(),
                changefreq='daily',
                priority=0.8
            )
    
    def generate_guide_sitemap(self, guides):
        """Generate sitemap entries for guides"""
        for guide in guides:
            self.add_url(
                f"/guides/{guide['slug']}",
                lastmod=guide.get('publishedDate'),
                changefreq='monthly',
                priority=0.7,
                images=guide.get('images', [])
            )
    
    def prettify(self, elem):
        """Return a pretty-printed XML string"""
        rough_string = ET.tostring(elem, encoding='utf-8')
        reparsed = minidom.parseString(rough_string)
        return reparsed.toprettyxml(indent="  ")
    
    def save(self, filename='sitemap.xml'):
        """Save sitemap to file"""
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(self.prettify(self.urlset))
        return filename
    
    def generate_sitemap_index(self, sitemaps):
        """Generate sitemap index for large sites"""
        sitemapindex = ET.Element('sitemapindex')
        sitemapindex.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
        
        for sitemap_url in sitemaps:
            sitemap = ET.SubElement(sitemapindex, 'sitemap')
            loc = ET.SubElement(sitemap, 'loc')
            loc.text = f"{self.base_url}/{sitemap_url}"
            lastmod = ET.SubElement(sitemap, 'lastmod')
            lastmod.text = datetime.now().strftime('%Y-%m-%d')
        
        with open('sitemap-index.xml', 'w', encoding='utf-8') as f:
            f.write(self.prettify(sitemapindex))
        
        return 'sitemap-index.xml'


# Example usage
if __name__ == "__main__":
    generator = SitemapGenerator()
    
    # Add static pages
    generator.generate_homepage_sitemap()
    
    # Simulate forum threads
    sample_threads = [
        {
            'id': 101,
            'replies': 234,
            'lastUpdate': datetime.now() - timedelta(hours=2),
            'images': [
                {'url': 'https://autoilty.com/images/thread-101.jpg', 'title': 'EV Winter Range'}
            ]
        },
        {
            'id': 102,
            'replies': 456,
            'lastUpdate': datetime.now() - timedelta(days=1),
        }
    ]
    
    generator.generate_forum_sitemap(sample_threads)
    
    # Save
    filename = generator.save('seo/sitemap.xml')
    print(f"✅ Sitemap generated: {filename}")

