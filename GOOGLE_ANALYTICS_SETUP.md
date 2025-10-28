# 🔍 Google Analytics & Search Console Setup Guide

## Step 1: Google Analytics 4 Setup

### Create Account
1. Go to https://analytics.google.com/
2. Click "Start measuring"
3. Account name: "Autoilty"
4. Property name: "Autoilty.com"
5. Reporting time zone: "Canada (Toronto)"
6. Currency: "Canadian Dollar (CAD)"

### Get Tracking Code
After setup, you'll receive code like this:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Installation
Add this code to `<head>` section of ALL pages:
- index.html
- forum.html
- guides.html
- tools.html
- All category pages
- All tool pages

---

## Step 2: Google Search Console Setup

### Add Property
1. Go to https://search.google.com/search-console/
2. Click "Add Property"
3. Choose "URL prefix"
4. Enter: https://autoilty.com
5. Verify ownership (use HTML tag method)

### Verification Tag
You'll receive a meta tag like:
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

Add this to `<head>` of index.html

### Submit Sitemap
1. In Search Console, go to "Sitemaps"
2. Enter: https://autoilty.com/sitemap.xml
3. Click "Submit"

---

## Step 3: Setup Key Reports

### Google Analytics - Custom Reports
1. **Acquisition Report**
   - Track where traffic comes from
   - Monitor organic search growth

2. **Engagement Report**
   - Pages per session
   - Average engagement time
   - Bounce rate

3. **Conversions**
   - Track sign-ups (custom event)
   - Track thread creation
   - Track mechanic finder usage

### Custom Events to Track
```javascript
// Sign up conversion
gtag('event', 'sign_up', {
  'method': 'Email'
});

// Thread creation
gtag('event', 'create_thread', {
  'category': category,
  'title': threadTitle
});

// Mechanic finder use
gtag('event', 'use_mechanic_finder', {
  'location': userLocation
});
```

---

## Step 4: Goals & KPIs

### Primary Goals (Week 1)
- [ ] Get first 100 organic visitors
- [ ] Achieve 10+ page indexation
- [ ] Get 5+ keyword rankings (any position)

### Month 1 Goals
- [ ] 500-1,000 organic visitors
- [ ] 20+ pages indexed
- [ ] 50+ keywords ranking
- [ ] 5+ keywords in top 100

### Month 3 Goals
- [ ] 3,000-5,000 organic visitors
- [ ] 60+ pages indexed
- [ ] 300+ keywords ranking
- [ ] 20+ keywords in top 50
- [ ] 5+ keywords in top 10

---

## Step 5: Monitor These Metrics Daily

### Search Console
- Total clicks (organic traffic)
- Total impressions
- Average CTR
- Average position
- New indexed pages

### Analytics
- Users (daily active)
- New users
- Sessions
- Bounce rate
- Pages per session
- Top landing pages

---

## Step 6: Keyword Tracking

### Use These Free Tools
1. **Google Search Console** (built-in)
   - See what keywords you rank for
   - See impressions & clicks

2. **Google Analytics**
   - Organic search traffic
   - Landing pages

3. **Google Trends**
   - Find trending automotive topics
   - Canadian search data

### Track These Keywords Weekly
Priority Keywords:
- "car forum Canada"
- "mechanic near me" + [city]
- "winter tire guide Canada"
- "used car buying guide"
- "[brand] forum Canada" (Toyota, Honda, etc.)

---

## Step 7: Weekly SEO Tasks

### Monday - Content
- Publish 1-2 new articles/guides
- Update existing content

### Tuesday - Technical
- Check for crawl errors
- Fix broken links
- Optimize page speed

### Wednesday - Link Building
- Reach out to 5 websites
- Comment on relevant blogs
- Engage on Reddit/social

### Thursday - Analysis
- Review GA4 data
- Check Search Console
- Monitor keyword rankings

### Friday - Community
- Engage with forum users
- Moderate content
- Encourage discussions

---

## Expected Timeline & Metrics

### Week 1
- Pages indexed: 5-10
- Organic visitors: 0-50
- Keywords ranking: 10-20

### Month 1
- Pages indexed: 20-30
- Organic visitors: 500-1,000
- Keywords ranking: 50-100
- Top 100 keywords: 5-10

### Month 3
- Pages indexed: 60-80
- Organic visitors: 3,000-5,000
- Keywords ranking: 300-500
- Top 50 keywords: 20-30
- Top 10 keywords: 3-5

### Month 6
- Pages indexed: 100+
- Organic visitors: 10,000-15,000
- Keywords ranking: 800-1,000
- Top 50 keywords: 50-80
- Top 10 keywords: 10-15

### Month 12
- Pages indexed: 150+
- Organic visitors: 30,000-60,000
- Keywords ranking: 2,000+
- Top 10 keywords: 30-50
- Domain Authority: 30-40

---

## Troubleshooting

### Pages Not Indexing?
1. Check robots.txt (make sure not blocking)
2. Submit URL in Search Console
3. Check for duplicate content
4. Ensure sitemap is submitted

### No Organic Traffic?
1. Give it time (2-3 months minimum)
2. Check if pages are indexed
3. Verify keywords have search volume
4. Ensure content quality is high

### High Bounce Rate?
1. Improve page load speed
2. Make content more engaging
3. Add internal links
4. Improve mobile experience

---

## Resources

### Free Tools
- Google Analytics: https://analytics.google.com
- Google Search Console: https://search.google.com/search-console
- Google Trends: https://trends.google.com
- PageSpeed Insights: https://pagespeed.web.dev

### Paid Tools (Optional)
- Ahrefs: $99/month - Best for backlink analysis
- SEMrush: $119/month - All-in-one SEO tool
- Moz Pro: $99/month - Keyword research & tracking

### Learning Resources
- Google SEO Starter Guide: https://developers.google.com/search/docs/beginner/seo-starter-guide
- Moz Beginner's Guide: https://moz.com/beginners-guide-to-seo
- Ahrefs Blog: https://ahrefs.com/blog

---

## Next Steps

1. ✅ sitemap.xml created
2. ✅ robots.txt created
3. ✅ Schema markup added
4. ✅ Open Graph tags added
5. ⚡ Setup Google Analytics (YOU)
6. ⚡ Setup Google Search Console (YOU)
7. ⚡ Submit sitemap (YOU)
8. ⚡ Start creating content

**Time investment:** 1-2 hours for initial setup, then 10-20 hours/week for ongoing optimization

**Expected ROI:** 30,000-60,000 monthly visitors within 12 months

