require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('./config/db')

// Uncomment to use in-memory MongoDB for seeding (requires mongodb-memory-server):
// async function startMemoryMongo() {
//   const { MongoMemoryServer } = require('mongodb-memory-server')
//   const mongoServer = await MongoMemoryServer.create()
//   const uri = mongoServer.getUri()
//   console.log('🗄️  Starting in-memory MongoDB for seeding...')
//   await mongoose.connect(uri)
//   return mongoServer
// }

const Car         = require('./models/Car')
const BlogPost    = require('./models/BlogPost')
const Testimonial = require('./models/Testimonial')
const Inquiry     = require('./models/Inquiry')
const SiteSettings= require('./models/SiteSettings')

const demoCars = [
  {
    name: 'Mahindra Thar',
    slug: 'mahindra-thar',
    category: 'SUV',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    ],
    pricePerDay: 5500, pricePerWeek: 35000, pricePerMonth: 120000,
    seats: 4, fuelType: 'Diesel', transmission: 'Manual',
    mileage: '15 kmpl', modelYear: 2023,
    lastServiceDate: new Date('2024-11-15'),
    features: ['4x4 Drive','AC','Bluetooth','USB Charging','Music System','Roof Top'],
    description: 'The iconic Mahindra Thar is perfect for Kashmir\'s rugged mountain terrain. With powerful 4x4 capability, this beast handles Zoji La and Khardung La with ease. Ideal for adventure seekers wanting to explore offbeat Kashmir.',
    isAvailable: true, isFeatured: true, order: 1, totalBookings: 48,
  },
  {
    name: 'Maruti Suzuki Swift',
    slug: 'maruti-suzuki-swift',
    category: 'Hatchback',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800',
    ],
    pricePerDay: 2500, pricePerWeek: 16000, pricePerMonth: 55000,
    seats: 5, fuelType: 'Petrol', transmission: 'Manual',
    mileage: '22 kmpl', modelYear: 2022,
    lastServiceDate: new Date('2024-12-01'),
    features: ['AC','Bluetooth','USB Charging','Music System','Power Windows','Central Locking'],
    description: 'The Maruti Swift is our most popular budget pick. Fuel-efficient and easy to drive, it\'s perfect for city tours around Srinagar and day trips to Gulmarg or Pahalgam. Great for couples and small families.',
    isAvailable: true, isFeatured: true, order: 2, totalBookings: 72,
  },
  {
    name: 'Toyota Innova Crysta',
    slug: 'toyota-innova-crysta',
    category: 'SUV',
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    ],
    pricePerDay: 6500, pricePerWeek: 42000, pricePerMonth: 150000,
    seats: 7, fuelType: 'Diesel', transmission: 'Manual',
    mileage: '13 kmpl', modelYear: 2023,
    lastServiceDate: new Date('2024-10-20'),
    features: ['AC','Bluetooth','USB Charging','Music System','7 Seats','Sunroof','Reverse Camera'],
    description: 'The Toyota Innova Crysta is the family king. Spacious, comfortable, and powerful — perfect for family trips to Sonamarg, Pahalgam, and beyond. Handles mountain roads with confidence and seats 7 comfortably.',
    isAvailable: true, isFeatured: true, order: 3, totalBookings: 55,
  },
  {
    name: 'Hyundai Creta',
    slug: 'hyundai-creta',
    category: 'SUV',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
    ],
    pricePerDay: 4500, pricePerWeek: 29000, pricePerMonth: 100000,
    seats: 5, fuelType: 'Diesel', transmission: 'Automatic',
    mileage: '17 kmpl', modelYear: 2023,
    lastServiceDate: new Date('2024-11-30'),
    features: ['AC','Bluetooth','Android Auto','Apple CarPlay','Sunroof','Reverse Camera','Cruise Control'],
    description: 'The Hyundai Creta automatic is our premium mid-range SUV. With Apple CarPlay, sunroof, and a smooth automatic gearbox, it\'s perfect for tourists who want comfort without the rough edges. A crowd favourite.',
    isAvailable: true, isFeatured: true, order: 4, totalBookings: 61,
  },
  {
    name: 'Maruti Dzire',
    slug: 'maruti-dzire',
    category: 'Sedan',
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
      'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=800',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800',
      'https://images.unsplash.com/photo-1449130568869-10e5a2c8a17c?w=800',
    ],
    pricePerDay: 2800, pricePerWeek: 18000, pricePerMonth: 60000,
    seats: 5, fuelType: 'Petrol', transmission: 'Automatic',
    mileage: '20 kmpl', modelYear: 2022,
    lastServiceDate: new Date('2024-12-10'),
    features: ['AC','Bluetooth','USB Charging','Music System','Power Windows','Airbags'],
    description: 'The Maruti Dzire automatic is smooth, comfortable and economical. Great for couples and small families exploring Srinagar city and nearby spots. Easy to park and fuel-efficient on long drives.',
    isAvailable: true, isFeatured: false, order: 5, totalBookings: 38,
  },
  {
    name: 'Mahindra Scorpio',
    slug: 'mahindra-scorpio',
    category: 'SUV',
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    ],
    pricePerDay: 5000, pricePerWeek: 32000, pricePerMonth: 110000,
    seats: 7, fuelType: 'Diesel', transmission: 'Manual',
    mileage: '14 kmpl', modelYear: 2022,
    lastServiceDate: new Date('2024-09-15'),
    features: ['AC','Bluetooth','Music System','7 Seats','4x4 Option','High Ground Clearance'],
    description: 'The Mahindra Scorpio is built for the rugged roads of Kashmir. High ground clearance, powerful diesel engine and 7 seats make it ideal for group trips to Gurez Valley, Lolab Valley and other remote areas.',
    isAvailable: true, isFeatured: false, order: 6, totalBookings: 43,
  },
  {
    name: 'Honda Amaze',
    slug: 'honda-amaze',
    category: 'Sedan',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
      'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=800',
    ],
    pricePerDay: 3000, pricePerWeek: 19000, pricePerMonth: 65000,
    seats: 5, fuelType: 'Diesel', transmission: 'Manual',
    mileage: '24 kmpl', modelYear: 2023,
    lastServiceDate: new Date('2024-11-05'),
    features: ['AC','Bluetooth','USB Charging','Music System','Power Windows','Reverse Sensor'],
    description: 'The Honda Amaze diesel is the most fuel-efficient sedan in our fleet. Great boot space, comfortable ride and excellent mileage make it ideal for longer Kashmir road trips without breaking the bank.',
    isAvailable: true, isFeatured: false, order: 7, totalBookings: 29,
  },
  {
    name: 'Royal Enfield Himalayan',
    slug: 'royal-enfield-himalayan',
    category: 'Motorbike',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1449130568869-10e5a2c8a17c?w=800',
      'https://images.unsplash.com/photo-1471479917193-f00955256257?w=800',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
    ],
    pricePerDay: 1800, pricePerWeek: 11000, pricePerMonth: 38000,
    seats: 2, fuelType: 'Petrol', transmission: 'Manual',
    mileage: '30 kmpl', modelYear: 2023,
    lastServiceDate: new Date('2024-12-05'),
    features: ['GPS Mount','Crash Guards','Luggage Carrier','Windscreen','USB Charging','Helmet Included'],
    description: 'The Royal Enfield Himalayan is THE bike for Kashmir. Built specifically for adventure touring, it handles mountain passes effortlessly. Includes crash guards, luggage carrier and helmet. Perfect for solo adventurers.',
    isAvailable: true, isFeatured: true, order: 8, totalBookings: 34,
  },
  {
    name: 'Toyota Fortuner',
    slug: 'toyota-fortuner',
    category: 'SUV',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800',
    ],
    pricePerDay: 8500, pricePerWeek: 55000, pricePerMonth: 190000,
    seats: 7, fuelType: 'Diesel', transmission: 'Automatic',
    mileage: '12 kmpl', modelYear: 2023,
    lastServiceDate: new Date('2024-10-10'),
    features: ['AC','Leather Seats','Sunroof','4x4','Reverse Camera','Android Auto','Apple CarPlay','7 Seats'],
    description: 'The Toyota Fortuner is our flagship premium SUV. Leather seats, sunroof, automatic 4x4 — this is the ultimate Kashmir road trip vehicle. Handles Zoji La and high altitude passes with complete confidence. Pure luxury.',
    isAvailable: true, isFeatured: false, order: 9, totalBookings: 22,
  },
  {
    name: 'Maruti Alto',
    slug: 'maruti-alto',
    category: 'Hatchback',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800',
    ],
    pricePerDay: 1800, pricePerWeek: 11000, pricePerMonth: 38000,
    seats: 5, fuelType: 'Petrol', transmission: 'Manual',
    mileage: '28 kmpl', modelYear: 2022,
    lastServiceDate: new Date('2024-12-15'),
    features: ['AC','Music System','Power Windows','Central Locking'],
    description: 'The Maruti Alto is our most affordable option — perfect for budget travellers and solo tourists exploring Srinagar city. Excellent fuel economy at 28 kmpl. Easy to park in narrow Srinagar lanes.',
    isAvailable: true, isFeatured: false, order: 10, totalBookings: 65,
  },
  {
    name: 'Kia Seltos',
    slug: 'kia-seltos',
    category: 'SUV',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
    ],
    pricePerDay: 4200, pricePerWeek: 27000, pricePerMonth: 95000,
    seats: 5, fuelType: 'Petrol', transmission: 'Automatic',
    mileage: '16 kmpl', modelYear: 2024,
    lastServiceDate: new Date('2025-01-10'),
    features: ['AC','Bluetooth','Android Auto','Apple CarPlay','Sunroof','Reverse Camera','Cruise Control','Wireless Charging'],
    description: 'The Kia Seltos is a feature-loaded modern SUV with a premium feel. The 2024 model comes loaded with a sunroof, wireless charging, and Bose sound system. Automatic gearbox makes it effortless for city and highway driving in Kashmir.',
    isAvailable: true, isFeatured: false, order: 11, totalBookings: 18,
  },
  {
    name: 'Tata Nexon',
    slug: 'tat-nexon',
    category: 'SUV',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    ],
    pricePerDay: 3200, pricePerWeek: 20500, pricePerMonth: 72000,
    seats: 5, fuelType: 'Petrol', transmission: 'Automatic',
    mileage: '17 kmpl', modelYear: 2023,
    lastServiceDate: new Date('2024-11-20'),
    features: ['AC','Bluetooth','Android Auto','Apple CarPlay','Reverse Camera','Turbo Engine','Electronic Stability Program'],
    description: 'The Tata Nexon is India\'s safest SUV with a 5-star Global NCAP rating. The turbo petrol engine delivers punchy performance on Kashmir highways while the automatic gearbox makes long drives relaxing. Great value for money.',
    isAvailable: true, isFeatured: false, order: 12, totalBookings: 31,
  },
]

const demoBlogs = [
  {
    title: 'Top 7 Self-Drive Road Trips in Kashmir You Must Do',
    slug: 'top-7-self-drive-road-trips-kashmir',
    featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    content: `<h2>Kashmir is a Road Tripper's Paradise</h2>
<p>Kashmir offers some of the most breathtaking road trips in all of Asia. From the lush valleys of Pahalgam to the high-altitude desert of Leh, every road in Kashmir tells a story. Here are the 7 best self-drive road trips you must do.</p>

<h3>1. Srinagar to Gulmarg (56 km)</h3>
<p>The drive to Gulmarg is one of the most scenic in Kashmir. The road winds through apple orchards, dense pine forests and small Kashmiri villages. In winter, you'll pass through snow-covered roads — absolutely magical. Best done in a Swift or Creta.</p>
<p><strong>Best time:</strong> May–October | <strong>Duration:</strong> 2 hours | <strong>Recommended car:</strong> Any</p>

<h3>2. Srinagar to Pahalgam (95 km)</h3>
<p>The Lidder Valley road to Pahalgam is stunning — the river runs alongside the highway for much of the journey. Stop at Awantipora ruins and Bijbehara on the way. Pahalgam itself is worth 2–3 days of exploration.</p>
<p><strong>Best time:</strong> April–October | <strong>Duration:</strong> 3 hours | <strong>Recommended car:</strong> Swift, Dzire, Creta</p>

<h3>3. Srinagar to Sonamarg (87 km)</h3>
<p>The drive to Sonamarg (Meadow of Gold) is dramatic — the Sindh River accompanies you all the way. The meadows at Sonamarg are jaw-dropping, and the road to Thajiwas Glacier is best done on the Royal Enfield Himalayan.</p>
<p><strong>Best time:</strong> May–September | <strong>Duration:</strong> 2.5 hours | <strong>Recommended car:</strong> Thar, Scorpio, Innova</p>

<h3>4. Srinagar to Gurez Valley (128 km)</h3>
<p>The hidden gem of Kashmir. Gurez Valley is virtually untouched by tourism. The road crosses the mighty Razdan Pass (3,800m) and the scenery is otherworldly. Only accessible May–October. You NEED a 4x4 for this one.</p>
<p><strong>Best time:</strong> June–September | <strong>Duration:</strong> 5 hours | <strong>Recommended car:</strong> Thar, Scorpio, Fortuner</p>

<h3>5. Srinagar to Yusmarg (47 km)</h3>
<p>An underrated drive through the Pir Panjal forests. Yusmarg (Meadow of Jesus) is quiet, unspoiled and beautiful. Perfect for a half-day trip with family.</p>
<p><strong>Best time:</strong> April–November | <strong>Duration:</strong> 1.5 hours | <strong>Recommended car:</strong> Any</p>

<h3>6. Srinagar to Doodhpathri (42 km)</h3>
<p>Doodhpathri means "Valley of Milk" — named for the milky streams that flow through it. This hidden meadow sees very few tourists and the drive through Budgam is charming.</p>
<p><strong>Best time:</strong> May–October | <strong>Duration:</strong> 1.5 hours | <strong>Recommended car:</strong> Any</p>

<h3>7. Srinagar to Leh via Sonamarg (434 km)</h3>
<p>The ultimate Kashmir road trip. Drive through Zoji La pass, cross into Ladakh and arrive in Leh. This 2-day drive is bucket-list material. You must have a 4x4 vehicle and an experienced mountain driver (or very confident self-driver).</p>
<p><strong>Best time:</strong> June–September | <strong>Duration:</strong> 2 days | <strong>Recommended car:</strong> Thar, Fortuner (4x4 mandatory)</p>

<h2>Tips for Self-Driving in Kashmir</h2>
<ul>
<li>Always carry your driving license, Aadhaar/passport and car documents</li>
<li>Keep a full tank — petrol pumps are rare beyond Sonamarg</li>
<li>Download offline maps (Google Maps offline area download)</li>
<li>Save our number: we provide 24/7 roadside assistance</li>
<li>Start early — mountain roads are best driven before noon</li>
</ul>

<p><strong>Ready to hit the road?</strong> Browse our fleet and book your perfect Kashmir road trip car today!</p>`,
    excerpt: 'From Gulmarg to Gurez Valley — discover the 7 best self-drive road trips in Kashmir with route details, recommended cars and insider tips.',
    category: 'Road Trips',
    tags: ['Kashmir road trip','self drive','Gulmarg','Pahalgam','Sonamarg'],
    metaTitle: 'Top 7 Self-Drive Road Trips in Kashmir | Miras Car Rental',
    metaDescription: 'Discover the best self-drive road trips in Kashmir. Routes from Srinagar to Gulmarg, Pahalgam, Sonamarg, Gurez Valley and Leh with car recommendations.',
    status: 'published',
    readTime: '6 min read',
  },
  {
    title: 'Complete Guide to Self-Driving in Kashmir – What You Need to Know',
    slug: 'complete-guide-self-driving-kashmir',
    featuredImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    content: `<h2>Everything You Need to Know Before Self-Driving in Kashmir</h2>
<p>Planning a self-drive trip to Kashmir? You've made an excellent choice. Self-driving gives you total freedom — stop wherever you want, linger at that beautiful vista, discover roads not on any tourist map. This complete guide covers everything.</p>

<h2>Documents Required</h2>
<ul>
<li><strong>Valid Driving License</strong> — Indian or International</li>
<li><strong>ID Proof</strong> — Aadhaar Card, Passport or Voter ID</li>
<li><strong>Vehicle RC</strong> — provided by us</li>
<li><strong>Insurance Certificate</strong> — provided by us</li>
<li><strong>PUC Certificate</strong> — provided by us</li>
</ul>

<h2>Road Conditions in Kashmir</h2>
<p>Kashmir roads range from smooth national highways to narrow, unpaved mountain tracks. Here's what to expect by area:</p>
<ul>
<li><strong>Srinagar city:</strong> Well-paved roads, light to moderate traffic</li>
<li><strong>Gulmarg/Pahalgam:</strong> Good roads with some winding sections</li>
<li><strong>Sonamarg/Gurez:</strong> Mountain roads, narrow sections, landslide zones</li>
<li><strong>Zoji La / High passes:</strong> 4x4 required, extreme caution needed</li>
</ul>

<h2>Best Seasons to Drive</h2>
<p><strong>Spring (March–May):</strong> Beautiful, blooming, pleasant weather. Some passes still closed early in the season.</p>
<p><strong>Summer (June–August):</strong> Peak tourist season. All roads open, warm weather, perfect for Ladakh drives.</p>
<p><strong>Autumn (September–October):</strong> Our favourite season. Chinar trees turn gold, less traffic, stunning colours.</p>
<p><strong>Winter (November–February):</strong> Snow-covered roads. Gulmarg road is the highlight. 4x4 strongly recommended. Passes to Leh are closed.</p>

<h2>Fuel & Petrol Stations</h2>
<p>Petrol stations are available throughout Srinagar and along major highways. However, beyond Sonamarg towards Leh, stations become extremely scarce. Rule of thumb: always fill up before leaving Srinagar for any remote destination.</p>

<h2>Speed Limits & Traffic Rules</h2>
<ul>
<li>City limits: 40 kmph</li>
<li>Highway: 60–80 kmph</li>
<li>Mountain roads: 30–40 kmph</li>
<li>Army convoy areas: follow the convoy — overtaking is prohibited</li>
</ul>

<h2>Emergency Contacts</h2>
<ul>
<li>Miras Car Rental 24/7: +91 98765 43210</li>
<li>Kashmir Traffic Police: 0194-2452222</li>
<li>Highway Helpline: 1033</li>
<li>Tourist Helpline: 1363</li>
</ul>`,
    excerpt: 'Complete guide to self-driving in Kashmir — documents required, road conditions, best seasons, fuel stations and emergency contacts.',
    category: 'Travel Guide',
    tags: ['self drive guide','Kashmir driving','road conditions','travel tips'],
    metaTitle: 'Complete Guide to Self-Driving in Kashmir 2024 | Miras Car Rental',
    metaDescription: 'Everything you need to know about self-driving in Kashmir. Documents, road conditions, best seasons, and tips from local experts.',
    status: 'published',
    readTime: '5 min read',
  },
  {
    title: 'Thar vs Scorpio vs Fortuner – Which SUV Should You Rent in Kashmir?',
    slug: 'thar-vs-scorpio-vs-fortuner-kashmir',
    featuredImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    content: `<h2>Choosing the Right SUV for Your Kashmir Adventure</h2>
<p>Kashmir demands capable vehicles. The mountain passes, unpaved valley roads and occasional snow make SUVs the preferred choice for serious Kashmir road trips. Here's our honest comparison of the three most popular SUVs in our fleet.</p>

<h2>Mahindra Thar – The Adventure King</h2>
<p><strong>Price:</strong> ₹5,500/day | <strong>Seats:</strong> 4 | <strong>Transmission:</strong> Manual 4x4</p>
<p>The Thar is purpose-built for adventure. Its part-time 4x4 system, high ground clearance (226mm) and short wheelbase make it incredibly capable on rough terrain. If you're planning to go to Gurez Valley, off-road near Sonamarg or cross Zoji La — the Thar is your weapon of choice.</p>
<p><strong>Best for:</strong> Adventure travelers, off-road exploration, solo/couple trips</p>
<p><strong>Limitations:</strong> Only 4 seats, no boot space, ride can be rough on highways</p>

<h2>Mahindra Scorpio – The Group Workhorse</h2>
<p><strong>Price:</strong> ₹5,000/day | <strong>Seats:</strong> 7 | <strong>Transmission:</strong> Manual</p>
<p>The Scorpio is the all-rounder. Seven seats, solid diesel engine, high ground clearance and a proven track record on Kashmir's roads. It's not as capable off-road as the Thar, but it handles mountain highways confidently and can seat the whole group.</p>
<p><strong>Best for:</strong> Groups of 5–7, families, longer highway drives</p>
<p><strong>Limitations:</strong> Older platform, no modern tech features, third row tight</p>

<h2>Toyota Fortuner – The Premium Choice</h2>
<p><strong>Price:</strong> ₹8,500/day | <strong>Seats:</strong> 7 | <strong>Transmission:</strong> Automatic</p>
<p>The Fortuner is in a different league. Leather seats, sunroof, automatic 4x4, Apple CarPlay — it's the most comfortable and refined SUV in our fleet. If budget isn't a constraint and you want to combine luxury with capability, the Fortuner delivers.</p>
<p><strong>Best for:</strong> Luxury travelers, families, those who want comfort + capability</p>
<p><strong>Limitations:</strong> Most expensive option, auto gearbox less intuitive on steep descents</p>

<h2>Our Verdict</h2>
<ul>
<li><strong>Budget adventure:</strong> Thar</li>
<li><strong>Family/group trip:</strong> Scorpio or Innova Crysta</li>
<li><strong>Premium experience:</strong> Fortuner</li>
<li><strong>Best overall value:</strong> Hyundai Creta (automatic, great features, good price)</li>
</ul>

<p>Still not sure? WhatsApp us and we'll help you pick the right car for your specific itinerary.</p>`,
    excerpt: 'Thar, Scorpio or Fortuner — which SUV is best for your Kashmir trip? We break down the pros, cons and ideal use case for each.',
    category: 'Car Reviews',
    tags: ['Thar','Scorpio','Fortuner','SUV Kashmir','car comparison'],
    metaTitle: 'Thar vs Scorpio vs Fortuner for Kashmir Road Trip | Miras Car Rental',
    metaDescription: 'Which SUV to rent in Kashmir? Detailed comparison of Mahindra Thar, Scorpio and Toyota Fortuner for Kashmir road trips.',
    status: 'published',
    readTime: '4 min read',
  },
  {
    title: 'Srinagar to Leh Self-Drive Guide – Everything You Need',
    slug: 'srinagar-to-leh-self-drive-guide',
    featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    content: `<h2>The Ultimate Road Trip: Srinagar to Leh</h2>
<p>The Srinagar–Leh highway (NH-1) is one of the most spectacular roads on earth. Crossing five major passes, running alongside glaciers and rivers, and climbing to over 5,000 metres, this drive is a bucket-list item for any road trip enthusiast.</p>

<h2>Route Overview</h2>
<p><strong>Total Distance:</strong> 434 km | <strong>Recommended Duration:</strong> 2 days (with overnight in Kargil or Drass)</p>

<h3>Day 1: Srinagar → Kargil (204 km, 7–8 hours)</h3>
<ul>
<li>Leave Srinagar by 6:00 AM</li>
<li>Sonamarg (87 km) — breakfast stop, beautiful meadows</li>
<li>Zoji La Pass (3,528m) — the first major pass, often snowy</li>
<li>Drass (176 km) — world's second coldest inhabited place</li>
<li>Kargil (204 km) — overnight halt</li>
</ul>

<h3>Day 2: Kargil → Leh (230 km, 6–7 hours)</h3>
<ul>
<li>Mulbekh Monastery — worth a 30-minute stop</li>
<li>Namika La (3,720m) and Fotu La (4,108m) passes</li>
<li>Lamayuru Monastery — moonland landscape</li>
<li>Magnetic Hill (near Leh) — the optical illusion road</li>
<li>Arrive Leh by evening</li>
</ul>

<h2>Vehicle Requirements</h2>
<p>A 4x4 vehicle is strongly recommended. The road is paved throughout (as of 2024) but Zoji La can be challenging with loose gravel and sharp turns. Our recommended vehicles for this route: Mahindra Thar, Toyota Fortuner.</p>

<h2>Road Opens & Closes</h2>
<ul>
<li><strong>Opens:</strong> Late May / Early June (weather-dependent)</li>
<li><strong>Closes:</strong> October / November (after first heavy snowfall)</li>
<li>Check: bro.org.in for real-time road status</li>
</ul>

<h2>Important Tips</h2>
<ul>
<li>Carry extra fuel — petrol station at Kargil only between Sonamarg and Leh</li>
<li>Acclimatize in Srinagar for 1 day before the drive if coming from sea level</li>
<li>Carry warm clothing — temperatures drop sharply at altitude</li>
<li>Download offline maps before leaving Sonamarg</li>
<li>Inner Line Permit (ILP) required for some areas near the border — check latest requirements</li>
</ul>`,
    excerpt: 'Complete guide to the Srinagar–Leh self-drive: day-by-day route, vehicle requirements, best time to go, and everything else you need.',
    category: 'Road Trips',
    tags: ['Srinagar Leh highway','Leh road trip','Zoji La','self drive Leh'],
    metaTitle: 'Srinagar to Leh Self-Drive Guide 2024 | Miras Car Rental',
    metaDescription: 'Complete Srinagar to Leh road trip guide. Route details, vehicle requirements, best time, permits and tips for the ultimate Kashmir road trip.',
    status: 'published',
    readTime: '5 min read',
  },
  {
    title: 'Why Self-Drive is Better Than Hiring a Taxi in Kashmir',
    slug: 'self-drive-vs-taxi-kashmir',
    featuredImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    content: `<h2>Self-Drive vs Taxi — What's Better for Kashmir?</h2>
<p>When planning a Kashmir trip, most people automatically think "hire a taxi." But in 2024, self-drive is the smarter, more rewarding and often cheaper option. Here's why.</p>

<h2>Total Freedom</h2>
<p>With a self-drive car, you go where you want, when you want. Stop for that perfect photo. Linger at Dal Lake until sunset. Take that unmarked road to a hidden village. No driver to rush you, no fixed itinerary. Your trip, your rules.</p>

<h2>Privacy</h2>
<p>Whether you're a couple on a romantic trip or a family with kids, privacy matters. No stranger in the front seat. Play your own music. Have candid conversations. Experience Kashmir your way.</p>

<h2>Cost Comparison</h2>
<p>For a 5-day trip to Gulmarg and Pahalgam:</p>
<ul>
<li><strong>Taxi:</strong> ₹2,500–₹3,500/day + driver food + tips = ~₹15,000–₹18,000</li>
<li><strong>Self-drive Swift:</strong> ₹2,500/day + fuel = ~₹12,500–₹14,000</li>
</ul>
<p>Self-drive is often <strong>20–30% cheaper</strong> for multi-day trips.</p>

<h2>The Self-Drive Advantage for Photographers</h2>
<p>If you're into photography, self-drive is non-negotiable. Chase the light. Be at Pangong Lake at 5 AM for the golden hour. Stop on a whim when you spot that perfect mountain reflection. No taxi driver will wait while you set up a 30-minute shot.</p>

<h2>When Taxi Makes Sense</h2>
<p>We're honest — taxis make sense for first-timers unfamiliar with Kashmir roads, elderly passengers who need local navigation help, or very short 1-day local sightseeing around Srinagar.</p>

<p>For everyone else — self-drive is the answer. And we're here to make it easy.</p>`,
    excerpt: 'Self-drive vs taxi in Kashmir — honest comparison of cost, freedom, privacy and when each option makes sense.',
    category: 'Travel Tips',
    tags: ['self drive benefits','Kashmir taxi','travel tips','Kashmir tourism'],
    metaTitle: 'Self-Drive vs Taxi in Kashmir – Which is Better? | Miras Car Rental',
    metaDescription: 'Self-drive vs taxi in Kashmir: cost comparison, freedom, privacy and more. Find out why self-drive is the better choice for most Kashmir tourists.',
    status: 'published',
    readTime: '4 min read',
  },
  {
    title: 'Best Time to Visit Kashmir – Month by Month Guide',
    slug: 'best-time-to-visit-kashmir-month-by-month',
    featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    content: `<h2>Kashmir by Season — What's Best for You?</h2>
<p>Kashmir transforms completely with every season. From the snow-draped wonderland of winter to the flower-filled meadows of spring, each time of year offers a completely different experience. Here's your month-by-month guide to planning the perfect Kashmir trip.</p>

<h2>January – February: Winter Snow Wonderland</h2>
<p>Deep winter blankets Kashmir in snow. Gulmarg turns into a world-class ski destination and the snow-covered Dal Lake is surreal. Srinagar temperatures drop to -8°C. Roads to Sonamarg and beyond are often closed.</p>
<p><strong>Best for:</strong> Snow lovers, skiers, honeymooners chasing the snowy romance</p>
<p><strong>Cars:</strong> Thar, Scorpio, Fortuner (4x4 essential for any travel)</p>

<h2>March – April: Spring Awakening</h2>
<p>March brings the first blooms. Almond blossoms line the roads in Srinagar — an incredible sight. April is tulip season at the Indira Gandhi Tulip Garden (Asia's largest). Pleasant temperatures, perfect for sightseeing.</p>
<p><strong>Best for:</strong> Nature lovers, flower chasers, comfortable weather seekers</p>
<p><strong>Cars:</strong> Any car works — Swift, Dzire, Creta</p>

<h2>May – June: Peak Summer Season</h2>
<p>The most popular time to visit. All mountain passes are open, meadows are lush green, temperatures are perfect (15–25°C). This is when the Srinagar–Leh road opens and Ladakh becomes accessible. Expect higher prices and more tourists.</p>
<p><strong>Best for:</strong> First-time visitors, Ladakh trips, maximum accessibility</p>
<p><strong>Cars:</strong> Any — but book well in advance for the peak season</p>

<h2>July – August: Monsoon (Green Season)</h2>
<p>The monsoon hits Kashmir lightly compared to the rest of India. The valleys are impossibly green, waterfalls are at full flow, and there's a magical mist over the mountains. Fewer tourists mean better deals on cars and hotels.</p>
<p><strong>Best for:</strong> Budget travelers, photographers, those who love misty landscapes</p>
<p><strong>Cars:</strong> Innova, Scorpio for comfort on long drives</p>

<h2>September – October: Autumn Gold</h2>
<p>Our personal favourite season. The chinar trees turn fiery orange and gold, creating one of the most spectacular natural displays anywhere. Fewer tourists, crisp air, and amazing photography conditions. Temperature starts to drop in October.</p>
<p><strong>Best for:</strong> Photographers, romantic trips, serene exploration</p>
<p><strong>Cars:</strong> Any — the scenery is the star</p>

<h2>November – December: Pre-Winter Transition</h2>
<p>The transition from autumn to winter is magical. Early snow may appear on the mountains. Gulmarg starts receiving snow. Tourist numbers drop significantly, meaning lower prices and peaceful exploration.</p>
<p><strong>Best for:</strong> Budget travellers, snow-seekers before peak season, peaceful trips</p>
<p><strong>Cars:</strong> Scorpio, Fortuner — slightly colder roads need reliable vehicles</p>

<h2>Quick Comparison Table</h2>
<table style="width:100%;border-collapse:collapse;">
<tr style="border-bottom:1px solid #333;"><td style="padding:8px;"><strong>Month</strong></td><td style="padding:8px;"><strong>Weather</strong></td><td style="padding:8px;"><strong>Tourists</strong></td><td style="padding:8px;"><strong>Highlights</strong></td></tr>
<tr style="border-bottom:1px solid #333;"><td style="padding:8px;">Jan–Feb</td><td style="padding:8px;">Snow, -8°C</td><td style="padding:8px;">Medium</td><td style="padding:8px;">Snow Gulmarg</td></tr>
<tr style="border-bottom:1px solid #333;"><td style="padding:8px;">Mar–Apr</td><td style="padding:8px;">Mild, 10–22°C</td><td style="padding:8px;">Growing</td><td style="padding:8px;">Tulip Festival</td></tr>
<tr style="border-bottom:1px solid #333;"><td style="padding:8px;">May–Jun</td><td style="padding:8px;">Warm, 15–25°C</td><td style="padding:8px;">Peak</td><td style="padding:8px;">Leh open</td></tr>
<tr style="border-bottom:1px solid #333;"><td style="padding:8px;">Jul–Aug</td><td style="padding:8px;">Rainy, 18–28°C</td><td style="padding:8px;">Low</td><td style="padding:8px;">Green valleys</td></tr>
<tr style="border-bottom:1px solid #333;"><td style="padding:8px;">Sep–Oct</td><td style="padding:8px;">Crisp, 10–20°C</td><td style="padding:8px;">Medium</td><td style="padding:8px;">Autumn gold</td></tr>
<tr><td style="padding:8px;">Nov–Dec</td><td style="padding:8px;">Cold, 0–12°C</td><td style="padding:8px;">Low</td><td style="padding:8px;">Early snow</td></tr>
</table>

<p>Still not sure when to go? WhatsApp us with your preferences and we'll recommend the perfect time and car for your trip.</p>`,
    excerpt: 'Complete month-by-month guide to visiting Kashmir — from snowy winters to autumn gold. Find the perfect time for your Kashmir trip.',
    category: 'Travel Guide',
    tags: ['best time Kashmir','Kashmir seasons','when to visit Kashmir','Kashmir weather'],
    metaTitle: 'Best Time to Visit Kashmir – Month by Month Guide | Miras Car Rental',
    metaDescription: 'Complete month-by-month guide to visiting Kashmir. Weather, tourist crowd levels, and best activities for each season in Kashmir.',
    status: 'published',
    readTime: '6 min read',
  },
]

const demoTestimonials = [
  { customerName: 'Rahul Sharma', city: 'Delhi', rating: 5, reviewText: 'Booked the Mahindra Thar for 5 days. Absolute beast on mountain roads! Drove to Gurez Valley without any issues. Miras team was incredibly helpful with the route planning too. Highly recommended!', isVisible: true },
  { customerName: 'Priya & Arjun Mehta', city: 'Mumbai', rating: 5, reviewText: 'Rented the Hyundai Creta automatic for our honeymoon trip. The car was in perfect condition, super clean and well-maintained. The team picked us up from the airport. Will definitely rent again on our next Kashmir visit!', isVisible: true },
  { customerName: 'Vikram Nair', city: 'Bangalore', rating: 5, reviewText: 'Third time renting from Miras. Always reliable, cars are well-serviced, and the WhatsApp support is outstanding. Took the Fortuner this time for a Srinagar-Leh road trip. Dream come true!', isVisible: true },
  { customerName: 'Sunita Agarwal', city: 'Jaipur', rating: 4, reviewText: 'Booked the Innova Crysta for our family of 6. Comfortable, spacious and the AC worked great even in peak summer. Good value for money. Minor issue with navigation but team resolved it over call instantly.', isVisible: true },
  { customerName: 'Ankit Joshi', city: 'Pune', rating: 5, reviewText: 'Got the Royal Enfield Himalayan for a solo trip. What an experience! Rode to Sonamarg and Gurez. Miras kept checking in via WhatsApp throughout the trip. The bike was in mint condition. 10/10!', isVisible: true },
  { customerName: 'Deepa & Ravi Krishnan', city: 'Chennai', rating: 5, reviewText: 'We were nervous about self-driving in Kashmir for the first time. The Miras team spent 30 minutes briefing us on the roads and what to expect. That support made all the difference. Went to Pahalgam and Gulmarg. Magical!', isVisible: true },
]

const demoInquiries = [
  { name: 'Aarav Patel', phone: '9876543210', email: 'aarav@gmail.com', carName: 'Mahindra Thar', pickupDate: new Date(Date.now() + 5*86400000), dropoffDate: new Date(Date.now() + 9*86400000), message: 'Interested in Thar for Gurez Valley trip. Need 4x4. Is it available?', status: 'New', source: 'car-page', isRead: false },
  { name: 'Simran Kaur', phone: '9123456789', email: 'simran.k@outlook.com', carName: 'Hyundai Creta', pickupDate: new Date(Date.now() + 2*86400000), dropoffDate: new Date(Date.now() + 6*86400000), message: 'Honeymoon trip, need a comfortable automatic. Please confirm availability.', status: 'Confirmed', source: 'car-page', isRead: true },
  { name: 'Rohan Gupta', phone: '9988776655', email: 'rohan.gupta@yahoo.com', carName: 'Toyota Innova Crysta', pickupDate: new Date(Date.now() + 10*86400000), dropoffDate: new Date(Date.now() + 15*86400000), message: 'Family trip, 6 people. Need spacious car with good AC.', status: 'Contacted', source: 'booking', isRead: true },
  { name: 'Meera Iyer', phone: '9012345678', carName: 'Maruti Swift', pickupDate: new Date(Date.now() + 1*86400000), dropoffDate: new Date(Date.now() + 3*86400000), message: 'Budget trip to Pahalgam. Is Swift available?', status: 'Completed', source: 'car-page', isRead: true },
  { name: 'Karthik Reddy', phone: '8765432109', email: 'karthik.r@gmail.com', carName: 'Royal Enfield Himalayan', pickupDate: new Date(Date.now() + 7*86400000), dropoffDate: new Date(Date.now() + 12*86400000), message: 'Solo bike trip Srinagar to Leh. Is helmet included? Any permits needed?', status: 'New', source: 'car-page', isRead: false },
  { name: 'Neha Sharma', phone: '9654321098', email: 'neha.s@hotmail.com', message: 'Can you share your full price list and availability for next month?', status: 'Contacted', source: 'contact', isRead: true },
  { name: 'Amit Verma', phone: '9432109876', carName: 'Toyota Fortuner', pickupDate: new Date(Date.now() + 14*86400000), dropoffDate: new Date(Date.now() + 19*86400000), message: 'Corporate trip, need the best SUV available. Budget not an issue.', status: 'Confirmed', source: 'booking', isRead: true },
  { name: 'Pooja & Manish', phone: '9210987654', email: 'manish.p@gmail.com', carName: 'Maruti Dzire', pickupDate: new Date(Date.now() - 3*86400000), dropoffDate: new Date(Date.now() - 1*86400000), message: 'Completed trip. Wonderful experience!', status: 'Completed', source: 'car-page', isRead: true },
]

async function seed() {
  let mongoServer
  try {
    // Try real MongoDB first
    await connectDB()
    console.log('\n🌱 Starting database seed...\n')
  } catch (err) {
    // Fallback to in-memory MongoDB
    console.log('\n⚠️  Real MongoDB not available, using in-memory server...\n')
    const { MongoMemoryServer } = require('mongodb-memory-server')
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
    console.log('🌱 Starting database seed (in-memory)...\n')
  }

    // Clear existing data
    await Car.deleteMany({})
    await BlogPost.deleteMany({})
    await Testimonial.deleteMany({})
    await Inquiry.deleteMany({})
    await SiteSettings.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // Seed cars
    const cars = await Car.insertMany(demoCars)
    console.log(`✅ Seeded ${cars.length} cars`)

    // Seed blogs
    const blogs = await BlogPost.insertMany(demoBlogs)
    console.log(`✅ Seeded ${blogs.length} blog posts`)

    // Seed testimonials
    const testimonials = await Testimonial.insertMany(demoTestimonials)
    console.log(`✅ Seeded ${testimonials.length} testimonials`)

    // Seed inquiries with real car references
    const tharCar = cars.find(c => c.slug === 'mahindra-thar')
    demoInquiries[0].carId = tharCar?._id
    const inquiries = await Inquiry.insertMany(demoInquiries)
    console.log(`✅ Seeded ${inquiries.length} inquiries`)

    // Seed site settings
    await SiteSettings.create({
      phone: '+91 98765 43210',
      whatsapp: '919876543210',
      email: 'info@mirascarrental.com',
      address: 'Near TRC Ground, Residency Road, Srinagar, Kashmir - 190001',
      businessHours: 'Mon–Sun: 7:00 AM – 9:00 PM',
    })
    console.log('✅ Seeded site settings')

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📋 Summary:')
    console.log(`   Cars:         ${cars.length} (Thar, Swift, Innova, Creta, Dzire, Scorpio, Amaze, RE Himalayan, Fortuner, Alto, Seltos, Nexon)`)
    console.log(`   Blog posts:   ${blogs.length} (all published)`)
    console.log(`   Testimonials: ${testimonials.length}`)
    console.log(`   Inquiries:    ${inquiries.length} (mix of statuses for demo)`)
    console.log('\n🔐 Admin Login:')
    console.log('   Email:    admin@mirascarrental.com')
    console.log('   Password: Miras@2024')
    console.log('\n🚀 Start server: npm run dev\n')
    await mongoose.disconnect()
    if (mongoServer) await mongoServer.stop()
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    if (mongoServer) await mongoServer.stop()
    process.exit(1)
  }
}

seed()
