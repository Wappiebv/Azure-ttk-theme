import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

/**
 * ⚠️ WEB SCRAPING DISCLAIMER ⚠️
 *
 * This product scraper is provided for demonstration and initial setup purposes only.
 * Before using it, please review West Coast HiFi's terms of service and robots.txt file.
 * Respect rate limits, and use the scraper responsibly.
 *
 * For commercial use, consider contacting the website owner for permission or using an official API if available.
 */

interface ScrapedProduct {
  name: string;
  brand: string;
  model: string;
  sku: string;
  category: string;
  subcategory: string;
  description: string;
  specifications: Record<string, string>;
  retailPrice: number;
  images: string[];
}

const RATE_LIMIT_MS = 2500; // 2.5 seconds between requests
const BASE_URL = 'https://www.westcoasthifi.com.au';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

// Category mapping from website to our CRM categories
const categoryMap: Record<string, { category: string; subcategory: string }> = {
  'speakers': { category: 'Speakers', subcategory: 'Bookshelf' },
  'floorstanding-speakers': { category: 'Speakers', subcategory: 'Floorstanding' },
  'bookshelf-speakers': { category: 'Speakers', subcategory: 'Bookshelf' },
  'center-channel': { category: 'Speakers', subcategory: 'Center Channel' },
  'subwoofers': { category: 'Speakers', subcategory: 'Subwoofers' },
  'surround-speakers': { category: 'Speakers', subcategory: 'Surround' },
  'amplifiers': { category: 'Amplifiers', subcategory: 'Integrated Amps' },
  'integrated-amplifiers': { category: 'Amplifiers', subcategory: 'Integrated Amps' },
  'power-amplifiers': { category: 'Amplifiers', subcategory: 'Power Amps' },
  'receivers': { category: 'Amplifiers', subcategory: 'Receivers' },
  'preamplifiers': { category: 'Amplifiers', subcategory: 'Pre-amps' },
  'turntables': { category: 'Source Components', subcategory: 'Turntables' },
  'cd-players': { category: 'Source Components', subcategory: 'CD Players' },
  'streamers': { category: 'Source Components', subcategory: 'Streamers' },
  'dacs': { category: 'Source Components', subcategory: 'DACs' },
  'projectors': { category: 'Home Theatre', subcategory: 'Projectors' },
  'screens': { category: 'Home Theatre', subcategory: 'Screens' },
  'av-receivers': { category: 'Home Theatre', subcategory: 'AV Receivers' },
  'soundbars': { category: 'Home Theatre', subcategory: 'Soundbars' },
  'cables': { category: 'Cables & Accessories', subcategory: 'Speaker Cables' },
  'speaker-cables': { category: 'Cables & Accessories', subcategory: 'Speaker Cables' },
  'interconnects': { category: 'Cables & Accessories', subcategory: 'Interconnects' },
  'power-cables': { category: 'Cables & Accessories', subcategory: 'Power' },
  'stands': { category: 'Cables & Accessories', subcategory: 'Stands' },
  'racks': { category: 'Cables & Accessories', subcategory: 'Racks' },
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPage(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching ${url}:`, error.message);
    throw error;
  }
}

function extractBrandAndModel(productName: string): { brand: string; model: string } {
  // Common audio brands
  const brands = [
    'Yamaha', 'Denon', 'Marantz', 'Onkyo', 'Pioneer', 'Sony', 'KEF', 'Bowers & Wilkins',
    'B&W', 'Klipsch', 'Polk', 'JBL', 'SVS', 'Definitive Technology', 'Martin Logan',
    'Paradigm', 'PSB', 'Monitor Audio', 'Focal', 'Dynaudio', 'Elac', 'Q Acoustics',
    'Cambridge Audio', 'NAD', 'Rotel', 'Audiolab', 'Pro-Ject', 'Rega', 'Audio-Technica',
    'Technics', 'McIntosh', 'Anthem', 'Arcam', 'Hegel', 'Luxman', 'Naim', 'Creek'
  ];

  let brand = 'Unknown';
  let model = productName;

  for (const b of brands) {
    if (productName.toLowerCase().includes(b.toLowerCase())) {
      brand = b;
      model = productName.replace(new RegExp(b, 'i'), '').trim();
      break;
    }
  }

  return { brand, model };
}

function parsePrice(priceText: string): number {
  const match = priceText.match(/[\d,]+\.?\d*/);
  if (match) {
    return parseFloat(match[0].replace(/,/g, ''));
  }
  return 0;
}

async function scrapeProductList(categoryUrl: string, categoryKey: string): Promise<ScrapedProduct[]> {
  const products: ScrapedProduct[] = [];
  console.log(`\n📦 Scraping category: ${categoryKey} from ${categoryUrl}`);

  try {
    await delay(RATE_LIMIT_MS);
    const html = await fetchPage(categoryUrl);
    const $ = cheerio.load(html);

    // Find product elements - adjust selectors based on actual website structure
    const productElements = $('.product-item, .product, .product-card, [data-product-id]');

    console.log(`   Found ${productElements.length} potential products`);

    productElements.each((index, element) => {
      try {
        const $product = $(element);

        // Extract product details - adjust selectors based on actual website
        const name = $product.find('.product-title, .product-name, h3, h2').first().text().trim();
        const priceText = $product.find('.price, .product-price, .price-current').first().text().trim();
        const imageUrl = $product.find('img').first().attr('src') || $product.find('img').first().attr('data-src') || '';
        // const productUrl = $product.find('a').first().attr('href') || '';

        if (!name) return; // Skip if no name found

        const { brand, model } = extractBrandAndModel(name);
        const retailPrice = parsePrice(priceText);
        const { category, subcategory } = categoryMap[categoryKey] || { category: 'Speakers', subcategory: 'Bookshelf' };

        // Generate SKU from name
        const sku = name.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 20).toUpperCase();

        const product: ScrapedProduct = {
          name,
          brand,
          model: model || name,
          sku,
          category,
          subcategory,
          description: `Premium ${category.toLowerCase()} from ${brand}`,
          specifications: {},
          retailPrice,
          images: imageUrl ? [imageUrl.startsWith('http') ? imageUrl : BASE_URL + imageUrl] : [],
        };

        products.push(product);
      } catch (error: any) {
        console.error(`   Error parsing product ${index}:`, error.message);
      }
    });

    console.log(`   ✅ Successfully scraped ${products.length} products`);
  } catch (error: any) {
    console.error(`   ❌ Error scraping category ${categoryKey}:`, error.message);
  }

  return products;
}

async function scrapeAllProducts(): Promise<ScrapedProduct[]> {
  console.log('🚀 Starting West Coast HiFi Product Scraper');
  console.log('⚠️  Please ensure you have permission to scrape this website');
  console.log('⚠️  Respecting rate limits: 2.5 seconds between requests\n');

  const allProducts: ScrapedProduct[] = [];

  // Categories to scrape - adjust URLs based on actual website structure
  const categoriesToScrape = [
    { key: 'speakers', url: `${BASE_URL}/collections/speakers` },
    { key: 'amplifiers', url: `${BASE_URL}/collections/amplifiers` },
    { key: 'turntables', url: `${BASE_URL}/collections/turntables` },
    { key: 'dacs', url: `${BASE_URL}/collections/dacs` },
    { key: 'cables', url: `${BASE_URL}/collections/cables` },
  ];

  for (const { key, url } of categoriesToScrape) {
    try {
      const products = await scrapeProductList(url, key);
      allProducts.push(...products);
    } catch (error: any) {
      console.error(`Failed to scrape ${key}:`, error.message);
    }
  }

  console.log(`\n✨ Scraping completed!`);
  console.log(`📊 Total products scraped: ${allProducts.length}`);

  return allProducts;
}

function convertToProductFormat(scraped: ScrapedProduct[]): any[] {
  return scraped.map((p, index) => ({
    id: `prod-${Date.now()}-${index}`,
    name: p.name,
    brand: p.brand,
    model: p.model,
    sku: p.sku,
    category: p.category,
    subcategory: p.subcategory,
    description: p.description,
    specifications: p.specifications,
    retailPrice: p.retailPrice,
    costPrice: Math.round(p.retailPrice * 0.6), // 40% markup
    margin: 40,
    stockLevel: Math.floor(Math.random() * 10) + 1,
    lowStockThreshold: 2,
    images: p.images,
    supplier: 'West Coast HiFi',
    dateAdded: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  }));
}

async function main() {
  try {
    const scrapedProducts = await scrapeAllProducts();
    const products = convertToProductFormat(scrapedProducts);

    // Save to JSON file
    const outputPath = path.join(process.cwd(), 'src', 'data', 'scraped-products.json');
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

    console.log(`\n💾 Saved ${products.length} products to ${outputPath}`);
    console.log('\n📋 Summary:');
    console.log(`   Total Products: ${products.length}`);

    // Count by category
    const categoryCounts = products.reduce((acc: any, p: any) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    console.log('   By Category:');
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      console.log(`     - ${cat}: ${count}`);
    });

    console.log('\n✅ Scraping complete!');
  } catch (error: any) {
    console.error('\n❌ Scraping failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { scrapeAllProducts, convertToProductFormat };
