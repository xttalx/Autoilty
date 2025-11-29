/**
 * AUTOILTY MARKETPLACE - DATABASE SEED SCRIPT
 * 
 * Populates the database with sample data for testing
 */

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Helper functions
const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Create sample users
    console.log('Creating sample users...');
    
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const users = [
      { username: 'demo_user', email: 'demo@autoilty.com', password_hash: passwordHash },
      { username: 'johndoe', email: 'john@example.com', password_hash: passwordHash },
      { username: 'janedoe', email: 'jane@example.com', password_hash: passwordHash }
    ];

    for (const user of users) {
      // Check if user exists
      const existing = await dbGet('SELECT id FROM users WHERE username = ? OR email = ?', [user.username, user.email]);
      
      if (!existing) {
        await dbRun(
          'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
          [user.username, user.email, user.password_hash]
        );
        console.log(`  ✓ Created user: ${user.username}`);
      } else {
        console.log(`  - User already exists: ${user.username}`);
      }
    }

    // Get user IDs
    const demoUser = await dbGet('SELECT id FROM users WHERE username = ?', ['demo_user']);
    const johnDoe = await dbGet('SELECT id FROM users WHERE username = ?', ['johndoe']);
    const janeDoe = await dbGet('SELECT id FROM users WHERE username = ?', ['janedoe']);

    // Create sample postings
    console.log('\nCreating sample postings...');

    const postings = [
      {
        user_id: demoUser.id,
        title: '2020 Honda Civic - Excellent Condition',
        description: 'Well-maintained Honda Civic with only 45,000 km. Single owner, no accidents. Perfect for daily commuting.',
        price: 25000.00,
        category: 'Cars',
        location: 'Toronto, ON',
        image_url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800'
      },
      {
        user_id: demoUser.id,
        title: '2018 BMW 3 Series',
        description: 'Luxury sedan with premium features. Leather seats, sunroof, navigation system. Service records available.',
        price: 32000.00,
        category: 'Cars',
        location: 'Vancouver, BC',
        image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'
      },
      {
        user_id: johnDoe.id,
        title: 'OEM Toyota Camry Headlights (Pair)',
        description: 'Brand new OEM headlights for 2015-2020 Toyota Camry. Still in original packaging. Perfect replacement.',
        price: 450.00,
        category: 'Parts',
        location: 'Calgary, AB',
        image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800'
      },
      {
        user_id: johnDoe.id,
        title: 'Professional Car Detailing Service',
        description: 'Full interior and exterior detailing service. Includes wash, wax, interior vacuum, and leather conditioning.',
        price: 150.00,
        category: 'Services',
        location: 'Montreal, QC',
        image_url: null
      },
      {
        user_id: janeDoe.id,
        title: 'Alloy Wheels Set - 18 inch',
        description: 'Set of 4 aftermarket alloy wheels in excellent condition. Fits most mid-size sedans. Minor scuffs only.',
        price: 800.00,
        category: 'Parts',
        location: 'Ottawa, ON',
        image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
      },
      {
        user_id: janeDoe.id,
        title: '2015 Ford F-150 Pickup Truck',
        description: 'Powerful pickup truck with towing package. Great for work or recreation. Regular maintenance done.',
        price: 28000.00,
        category: 'Cars',
        location: 'Edmonton, AB',
        image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
      },
      {
        user_id: demoUser.id,
        title: 'Engine Oil Change Service',
        description: 'Professional engine oil change with premium synthetic oil. Includes oil filter replacement and fluid top-up.',
        price: 75.00,
        category: 'Services',
        location: 'Toronto, ON',
        image_url: null
      },
      {
        user_id: johnDoe.id,
        title: 'Car Audio System - Premium Setup',
        description: 'Complete car audio system including head unit, speakers, subwoofer, and amplifier. Ready to install.',
        price: 1200.00,
        category: 'Parts',
        location: 'Vancouver, BC',
        image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800'
      }
    ];

    for (const posting of postings) {
      // Check if posting exists (by title)
      const existing = await dbGet('SELECT id FROM postings WHERE title = ?', [posting.title]);
      
      if (!existing) {
        await dbRun(
          `INSERT INTO postings (user_id, title, description, price, category, location, image_url)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            posting.user_id,
            posting.title,
            posting.description,
            posting.price,
            posting.category,
            posting.location,
            posting.image_url
          ]
        );
        console.log(`  ✓ Created posting: ${posting.title}`);
      } else {
        console.log(`  - Posting already exists: ${posting.title}`);
      }
    }

    console.log('\n✅ Database seed completed successfully!');
    console.log('\n📝 Sample Login Credentials:');
    console.log('   Username: demo_user');
    console.log('   Password: password123');
    console.log('\n   Username: johndoe');
    console.log('   Password: password123');
    console.log('\n   Username: janedoe');
    console.log('   Password: password123\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

// Run seed
seedDatabase();

