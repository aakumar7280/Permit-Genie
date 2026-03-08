# Toronto Permit Scraper Prototype

This is a standalone web scraping prototype to test extracting permit information from the City of Toronto website.

## Purpose
- Test different scraping approaches for government websites
- Understand the data structure and format
- Prototype before integrating into main Permit Genie app

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Scraper

**Quick Test:**
```bash
npm test
```

**Full Scrape:**
```bash
npm start
```

**Development Mode:**
```bash
npm run dev
```

## What It Does

1. **Launches Browser**: Opens a Chrome browser (visible by default for debugging)
2. **Navigates to Toronto Permits**: Goes to toronto.ca permits pages
3. **Finds Expandable Content**: Looks for dialog boxes, accordions, expandable sections
4. **Clicks to Expand**: Automatically clicks to reveal hidden content  
5. **Extracts Data**: Pulls out permit names, descriptions, requirements, fees, timelines
6. **Saves Results**: Creates JSON and human-readable summary files

## Output Files

All scraped data is saved to `./scraped-data/` folder:

- **JSON File**: `toronto-permits-[timestamp].json` - Raw structured data
- **Summary File**: `toronto-permits-summary-[timestamp].txt` - Human readable format

## Data Structure

Each permit contains:
```json
{
  "title": "Building Permit",
  "description": "Required for construction work...",
  "requirements": ["Plans", "Engineering report", "Fees"],
  "fee": "$200-$2000 depending on project size",
  "timeline": "2-6 weeks processing time", 
  "links": [{"text": "Apply Online", "url": "..."}],
  "type": "expandable|static|link",
  "scrapedAt": "2025-01-11T..."
}
```

## Configuration

Edit `.env` file to adjust:
- Browser visibility (headless mode)
- Timeouts and delays
- Output directory
- Scraping limits

## Troubleshooting

### Common Issues:

**"No permits found"**
- Website structure may have changed
- Selectors need updating
- Check if site is loading properly

**Browser crashes**
- Reduce MAX_PERMITS_PER_PAGE in .env
- Increase delays between actions
- Check available memory

**Slow performance**
- Set HEADLESS=true in .env
- Reduce timeouts
- Limit scraping scope

## Next Steps

Once this prototype works well:
1. Analyze the scraped data structure
2. Identify the most useful permit information  
3. Refine the extraction logic
4. Integrate into main Permit Genie backend
5. Add data cleaning and categorization
6. Set up automated daily scraping

## Technical Notes

- Uses Puppeteer for browser automation
- Handles dynamic content and JavaScript
- Robust error handling and retries
- Respects rate limits with delays
- Saves both raw and processed data formats
