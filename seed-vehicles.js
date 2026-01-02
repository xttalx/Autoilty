/**
 * Vehicle Seeding Script for Autoilty
 * 
 * Seeds the vehicles table with popular Indian vehicle models
 * Supports: Maruti Suzuki, Tata, Hyundai, Mahindra
 * 
 * Note: In production, integrate with real APIs like:
 * - CarAPI.app (requires API key)
 * - MarketCheck API (requires API key)
 * - Autorox API (requires API key)
 * 
 * This script uses sample data for demonstration.
 * Replace with actual API calls in production.
 */

// Load environment variables from .env file if available
require('dotenv').config();

const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is required!');
  process.exit(1);
}

function getDbConfig(connectionString) {
  try {
    const url = new URL(connectionString);
    return {
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1) || 'postgres',
      user: url.username || 'postgres',
      password: decodeURIComponent(url.password || ''),
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 20
    };
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error);
    return {
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false }
    };
  }
}

const pool = new Pool(getDbConfig(DATABASE_URL));

/**
 * Popular Indian vehicle data
 * Focus on Maruti Suzuki, Tata, Hyundai, Mahindra
 */
const popularVehicles = [
  // Maruti Suzuki
  { make: 'Maruti Suzuki', model: 'Swift', variant: 'VXI', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 589000, price_range_max: 890000, body_type: 'Hatchback', specs: { engine: '1.2L K12M', power: '82.9 bhp', mileage: '23.2 kmpl' }, image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800' },
  { make: 'Maruti Suzuki', model: 'Swift', variant: 'ZXI', year: 2024, fuel_type: 'Petrol', transmission: 'AMT', price_range_min: 720000, price_range_max: 950000, body_type: 'Hatchback', specs: { engine: '1.2L K12M', power: '82.9 bhp', mileage: '23.2 kmpl' } },
  { make: 'Maruti Suzuki', model: 'Baleno', variant: 'Alpha', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 650000, price_range_max: 970000, body_type: 'Hatchback', specs: { engine: '1.2L K12N', power: '88.5 bhp', mileage: '22.35 kmpl' } },
  { make: 'Maruti Suzuki', model: 'Wagon R', variant: 'ZXI', year: 2024, fuel_type: 'CNG', transmission: 'Manual', price_range_min: 580000, price_range_max: 790000, body_type: 'Hatchback', specs: { engine: '1.0L K10C', power: '67.04 bhp', mileage: '32.52 km/kg (CNG)' } },
  { make: 'Maruti Suzuki', model: 'Dzire', variant: 'VXI', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 650000, price_range_max: 940000, body_type: 'Sedan', specs: { engine: '1.2L K12M', power: '82.9 bhp', mileage: '23.26 kmpl' } },
  { make: 'Maruti Suzuki', model: 'Vitara Brezza', variant: 'ZXI', year: 2024, fuel_type: 'Petrol', transmission: 'Automatic', price_range_min: 990000, price_range_max: 1350000, body_type: 'SUV', specs: { engine: '1.5L K15C', power: '103.26 bhp', mileage: '17.38 kmpl' } },
  { make: 'Maruti Suzuki', model: 'Ertiga', variant: 'ZXI', year: 2024, fuel_type: 'CNG', transmission: 'Manual', price_range_min: 1100000, price_range_max: 1350000, body_type: 'MUV', specs: { engine: '1.5L K15C', power: '88.5 bhp', mileage: '26.11 km/kg (CNG)' } },
  { make: 'Maruti Suzuki', model: 'S-Presso', variant: 'VXI', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 420000, price_range_max: 570000, body_type: 'Hatchback', specs: { engine: '1.0L K10C', power: '66.73 bhp', mileage: '21.79 kmpl' } },
  { make: 'Maruti Suzuki', model: 'Celerio', variant: 'ZXI', year: 2024, fuel_type: 'Petrol', transmission: 'AMT', price_range_min: 600000, price_range_max: 790000, body_type: 'Hatchback', specs: { engine: '1.0L K10C', power: '65.71 bhp', mileage: '26.68 kmpl' } },
  { make: 'Maruti Suzuki', model: 'Alto K10', variant: 'VXI', year: 2024, fuel_type: 'CNG', transmission: 'Manual', price_range_min: 490000, price_range_max: 610000, body_type: 'Hatchback', specs: { engine: '1.0L K10C', power: '65.71 bhp', mileage: '32.12 km/kg (CNG)' } },
  
  // Hyundai
  { make: 'Hyundai', model: 'i20', variant: 'Sportz', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 750000, price_range_max: 1150000, body_type: 'Hatchback', specs: { engine: '1.2L Kappa', power: '83 bhp', mileage: '20.35 kmpl' } },
  { make: 'Hyundai', model: 'i20', variant: 'Asta', year: 2024, fuel_type: 'Petrol', transmission: 'CVT', price_range_min: 950000, price_range_max: 1200000, body_type: 'Hatchback', specs: { engine: '1.2L Kappa', power: '83 bhp', mileage: '20.35 kmpl' } },
  { make: 'Hyundai', model: 'Verna', variant: 'SX', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 1100000, price_range_max: 1750000, body_type: 'Sedan', specs: { engine: '1.5L MPi', power: '115 bhp', mileage: '18.6 kmpl' } },
  { make: 'Hyundai', model: 'Creta', variant: 'SX', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 1200000, price_range_max: 2100000, body_type: 'SUV', specs: { engine: '1.5L MPi', power: '115 bhp', mileage: '17.4 kmpl' } },
  { make: 'Hyundai', model: 'Creta', variant: 'SX', year: 2024, fuel_type: 'Diesel', transmission: 'Manual', price_range_min: 1400000, price_range_max: 2200000, body_type: 'SUV', specs: { engine: '1.5L CRDi', power: '115 bhp', mileage: '21.8 kmpl' } },
  { make: 'Hyundai', model: 'Venue', variant: 'S', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 800000, price_range_max: 1350000, body_type: 'SUV', specs: { engine: '1.2L Kappa', power: '83 bhp', mileage: '18.2 kmpl' } },
  { make: 'Hyundai', model: 'Aura', variant: 'S', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 620000, price_range_max: 990000, body_type: 'Sedan', specs: { engine: '1.2L Kappa', power: '83 bhp', mileage: '20.5 kmpl' } },
  { make: 'Hyundai', model: 'Grand i10 Nios', variant: 'Sportz', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 550000, price_range_max: 850000, body_type: 'Hatchback', specs: { engine: '1.2L Kappa', power: '83 bhp', mileage: '20.35 kmpl' } },
  { make: 'Hyundai', model: 'Alcazar', variant: 'Prestige', year: 2024, fuel_type: 'Diesel', transmission: 'Manual', price_range_min: 1700000, price_range_max: 2300000, body_type: 'SUV', specs: { engine: '1.5L CRDi', power: '115 bhp', mileage: '20.4 kmpl' } },
  { make: 'Hyundai', model: 'Tucson', variant: 'Premium', year: 2024, fuel_type: 'Petrol', transmission: 'Automatic', price_range_min: 2800000, price_range_max: 3600000, body_type: 'SUV', specs: { engine: '2.0L Theta', power: '152 bhp', mileage: '12.95 kmpl' } },
  
  // Tata
  { make: 'Tata', model: 'Nexon', variant: 'XM', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 750000, price_range_max: 1550000, body_type: 'SUV', specs: { engine: '1.2L Revotron', power: '120 bhp', mileage: '17.44 kmpl' } },
  { make: 'Tata', model: 'Nexon', variant: 'XZ+', year: 2024, fuel_type: 'Electric', transmission: 'Automatic', price_range_min: 1450000, price_range_max: 1950000, body_type: 'SUV', specs: { engine: 'Electric Motor', power: '129 bhp', mileage: '325 km range', battery: '40.5 kWh' } },
  { make: 'Tata', model: 'Punch', variant: 'Adventure', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 620000, price_range_max: 990000, body_type: 'SUV', specs: { engine: '1.2L Revotron', power: '86 bhp', mileage: '18.97 kmpl' } },
  { make: 'Tata', model: 'Tiago', variant: 'XT', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 550000, price_range_max: 800000, body_type: 'Hatchback', specs: { engine: '1.2L Revotron', power: '86 bhp', mileage: '19.85 kmpl' } },
  { make: 'Tata', model: 'Altroz', variant: 'XZ', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 700000, price_range_max: 1050000, body_type: 'Hatchback', specs: { engine: '1.2L Revotron', power: '86 bhp', mileage: '19.05 kmpl' } },
  { make: 'Tata', model: 'Harrier', variant: 'XS', year: 2024, fuel_type: 'Diesel', transmission: 'Manual', price_range_min: 1550000, price_range_max: 2500000, body_type: 'SUV', specs: { engine: '2.0L Kryotec', power: '170 bhp', mileage: '16.35 kmpl' } },
  { make: 'Tata', model: 'Safari', variant: 'XE', year: 2024, fuel_type: 'Diesel', transmission: 'Manual', price_range_min: 1650000, price_range_max: 2700000, body_type: 'SUV', specs: { engine: '2.0L Kryotec', power: '170 bhp', mileage: '16.14 kmpl' } },
  { make: 'Tata', model: 'Tigor', variant: 'XZ', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 650000, price_range_max: 950000, body_type: 'Sedan', specs: { engine: '1.2L Revotron', power: '86 bhp', mileage: '19.26 kmpl' } },
  { make: 'Tata', model: 'Nexon EV Max', variant: 'XZ+', year: 2024, fuel_type: 'Electric', transmission: 'Automatic', price_range_min: 1650000, price_range_max: 2050000, body_type: 'SUV', specs: { engine: 'Electric Motor', power: '143 bhp', mileage: '453 km range', battery: '40.5 kWh' } },
  { make: 'Tata', model: 'Tiago EV', variant: 'XZ+', year: 2024, fuel_type: 'Electric', transmission: 'Automatic', price_range_min: 950000, price_range_max: 1250000, body_type: 'Hatchback', specs: { engine: 'Electric Motor', power: '61 bhp', mileage: '250 km range', battery: '24 kWh' } },
  
  // Mahindra
  { make: 'Mahindra', model: 'XUV700', variant: 'MX', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 1390000, price_range_max: 2700000, body_type: 'SUV', specs: { engine: '2.0L mStallion', power: '200 bhp', mileage: '15.1 kmpl' } },
  { make: 'Mahindra', model: 'XUV700', variant: 'AX7', year: 2024, fuel_type: 'Diesel', transmission: 'Automatic', price_range_min: 2000000, price_range_max: 2700000, body_type: 'SUV', specs: { engine: '2.2L mHawk', power: '185 bhp', mileage: '17.3 kmpl' } },
  { make: 'Mahindra', model: 'Scorpio-N', variant: 'Z2', year: 2024, fuel_type: 'Diesel', transmission: 'Manual', price_range_min: 1250000, price_range_max: 2400000, body_type: 'SUV', specs: { engine: '2.2L mHawk', power: '175 bhp', mileage: '16.4 kmpl' } },
  { make: 'Mahindra', model: 'Thar', variant: 'AX', year: 2024, fuel_type: 'Petrol', transmission: 'Manual', price_range_min: 1300000, price_range_max: 1650000, body_type: 'SUV', specs: { engine: '2.0L mStallion', power: '150 bhp', mileage: '15.2 kmpl' } },
  { make: 'Mahindra', model: 'Bolero', variant: 'B4', year: 2024, fuel_type: 'Diesel', transmission: 'Manual', price_range_min: 950000, price_range_max: 1200000, body_type: 'SUV', specs: { engine: '1.5L mHawk', power: '75 bhp', mileage: '17.3 kmpl' } },
  { make: 'Mahindra', model: 'XUV300', variant: 'W8', year: 2024, fuel_type: 'Diesel', transmission: 'Manual', price_range_min: 1000000, price_range_max: 1550000, body_type: 'SUV', specs: { engine: '1.5L mHawk', power: '117 bhp', mileage: '20.1 kmpl' } },
  { make: 'Mahindra', model: 'Bolero Neo', variant: 'N4', year: 2024, fuel_type: 'Diesel', transmission: 'Manual', price_range_min: 950000, price_range_max: 1250000, body_type: 'SUV', specs: { engine: '1.5L mHawk', power: '100 bhp', mileage: '17.9 kmpl' } },
  { make: 'Mahindra', model: 'Marazzo', variant: 'M2', year: 2024, fuel_type: 'Diesel', transmission: 'Manual', price_range_min: 1400000, price_range_max: 1750000, body_type: 'MUV', specs: { engine: '1.5L mHawk', power: '123 bhp', mileage: '17.3 kmpl' } },
  { make: 'Mahindra', model: 'XUV400', variant: 'ELITE', year: 2024, fuel_type: 'Electric', transmission: 'Automatic', price_range_min: 1650000, price_range_max: 2050000, body_type: 'SUV', specs: { engine: 'Electric Motor', power: '150 bhp', mileage: '456 km range', battery: '39.4 kWh' } },
  { make: 'Mahindra', model: 'Scorpio Classic', variant: 'S5', year: 2024, fuel_type: 'Diesel', transmission: 'Manual', price_range_min: 1300000, price_range_max: 1800000, body_type: 'SUV', specs: { engine: '2.2L mHawk', power: '130 bhp', mileage: '15.37 kmpl' } },
];

/**
 * Seed vehicles into database
 */
async function seedVehicles() {
  try {
    console.log('🌱 Starting vehicle seeding...');
    
    let inserted = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const vehicle of popularVehicles) {
      try {
        // Check if vehicle already exists (by make, model, variant, year)
        const existing = await pool.query(
          'SELECT id FROM vehicles WHERE make = $1 AND model = $2 AND variant = $3 AND year = $4',
          [vehicle.make, vehicle.model, vehicle.variant, vehicle.year]
        );
        
        if (existing.rows.length > 0) {
          console.log(`⏭️  Skipping ${vehicle.make} ${vehicle.model} ${vehicle.variant} ${vehicle.year} (already exists)`);
          skipped++;
          continue;
        }
        
        // Insert vehicle
        await pool.query(
          `INSERT INTO vehicles (
            make, model, variant, year, fuel_type, transmission,
            price_range_min, price_range_max, body_type, specs, image_url, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)`,
          [
            vehicle.make,
            vehicle.model,
            vehicle.variant,
            vehicle.year,
            vehicle.fuel_type,
            vehicle.transmission,
            vehicle.price_range_min,
            vehicle.price_range_max,
            vehicle.body_type,
            JSON.stringify(vehicle.specs),
            vehicle.image_url || null
          ]
        );
        
        inserted++;
        console.log(`✅ Inserted: ${vehicle.make} ${vehicle.model} ${vehicle.variant} ${vehicle.year}`);
      } catch (error) {
        console.error(`❌ Error inserting ${vehicle.make} ${vehicle.model}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n📊 Seeding Summary:');
    console.log(`   ✅ Inserted: ${inserted}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📦 Total: ${popularVehicles.length}`);
    
    return {
      inserted,
      skipped,
      errors,
      total: popularVehicles.length
    };
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
}

// If run directly (node seed-vehicles.js)
if (require.main === module) {
  seedVehicles()
    .then((result) => {
      console.log('\n✅ Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Seeding failed:', error);
      process.exit(1);
    })
    .finally(() => {
      pool.end();
    });
}

// Export for use in server.js
module.exports = { seedVehicles };
