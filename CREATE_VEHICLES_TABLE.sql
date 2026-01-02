-- Vehicles table for Autoilty inventory system
-- Stores vehicle specifications and data from external APIs

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  year INTEGER NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG')),
  transmission TEXT NOT NULL CHECK (transmission IN ('Manual', 'Automatic', 'AMT', 'CVT', 'DCT')),
  price_range_min DECIMAL(10, 2),
  price_range_max DECIMAL(10, 2),
  body_type TEXT CHECK (body_type IN ('Hatchback', 'Sedan', 'SUV', 'MUV', 'Coupe', 'Convertible', 'Wagon', 'Pickup', 'Motorcycle', 'Scooter', 'Commercial')),
  specs JSONB DEFAULT '{}'::jsonb,
  image_url TEXT,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vehicles_make ON vehicles(make);
CREATE INDEX IF NOT EXISTS idx_vehicles_model ON vehicles(model);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON vehicles(year);
CREATE INDEX IF NOT EXISTS idx_vehicles_fuel_type ON vehicles(fuel_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_body_type ON vehicles(body_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_price_range ON vehicles(price_range_min, price_range_max);

-- Composite index for common search combinations
CREATE INDEX IF NOT EXISTS idx_vehicles_make_model_year ON vehicles(make, model, year);

-- Add comment to table
COMMENT ON TABLE vehicles IS 'Vehicle inventory data from external APIs';
