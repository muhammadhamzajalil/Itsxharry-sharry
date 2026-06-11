export interface YourMartItem {
  id: string;
  name: string;
  description: string;
  category: string;
  supplier_price: number;
  stock: number;
  images: string[];
  specifications: Record<string, string>;
  variants: string[];
}

export const YOURMART_CATALOG: YourMartItem[] = [
  {
    id: "pink-stanley-40-oz-stainless-steel-tumbler",
    name: "Pink Stanley 40 oz Stainless Steel Tumbler",
    description: "The viral hydration sensation. Double-wall vacuum insulation keeps drinks ice cold for up to 48 hours. Features an ergonomic comfort-grip handle, narrow base that fits in cup holders, and a versatile 3-position FlowState straw lid.",
    category: "Accessories",
    supplier_price: 2400,
    stock: 140,
    images: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Capacity": "40 Fluid Ounces (1.18 Liters)",
      "Material": "18/8 Recycled Food-Grade Stainless Steel",
      "Thermal Rating": "Cold: 11 hours | Iced: 2 days | Hot: 7 hours",
      "Lid Style": "FlowState 3-Way Rotating Lid",
      "Safety": "BPA-Free, Dishwasher Safe"
    },
    variants: ["Soft Pink Cream", "Blossom Pink Matte", "Rose Quartz Crystal"]
  },
  {
    id: "karaoke-portable-wireless-bluetooth-speaker",
    name: "Karaoke Portable Wireless Bluetooth Speaker",
    description: "Bring the concert anywhere with this dual-subwoofer Bluetooth speaker setup and rechargeable wireless microphone package. Equipped with dynamic multi-color RGB light show matching auditory rhythms.",
    category: "Smart Gadgets",
    supplier_price: 3100,
    stock: 95,
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Output Intensity": "20W RMS High Fidelity Output",
      "Battery Capacity": "3000mAh Lithium Cell + 1200mAh Microphone battery",
      "Connectivity": "Bluetooth v5.1, AUX, TF Card, USB flash",
      "Vocal Settings": "Adjustable Eco, Reverb, Treble, and Bass",
      "Vocal Cuts": "One-key accompaniment cancellation for genuine karaoke vocals"
    },
    variants: ["Midnight Black Set", "Rose Gold Harmony Set", "Pearl White Duet Set"]
  },
  {
    id: "orange-raf-r8010b-electric-stove",
    name: "Orange RAF-R8010B Portable Electric Stove",
    description: "A striking high-efficiency single hot plate electric burner with rapid preheat thermal coils. Perfect for small apartments, dormitory kitchens, travel vans, or guest buffet panels.",
    category: "Home & Kitchen Products",
    supplier_price: 3600,
    stock: 80,
    images: ["https://images.unsplash.com/photo-1585515306114-1f5b1338a8a2?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Manufacturer Model": "RAF R8010B Edition",
      "Burner Wattage": "1000 Watts",
      "Heat Levels": "5-Stage adjustable thermostat slider",
      "Cookware Compability": "Flat bottom metal, glass, ceramic, or iron pots",
      "Safety Protocols": "Auto thermal fuse cutoff, rubber non-slip stabilization feet"
    },
    variants: ["Volcanic Orange Orange", "Charcoal Quartz Gray"]
  },
  {
    id: "raf-kt-200-electric-kettle",
    name: "RAF KT-200 Stainless Steel Electric Kettle",
    description: "Boil water in under 3 minutes with this durable, fast-heating 2.0-liter electric kettle. Features food-contact safe stainless steel interior walls and dry-boil safety automatic shutoffs.",
    category: "Home & Kitchen Products",
    supplier_price: 1650,
    stock: 220,
    images: ["https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Storage Size": "2.0 Liters heavy capacity",
      "Heating Output": "1500 Watts rapid heating core",
      "Wall Build": "Double layer insulation (Warm touch exterior, SS304 inner)",
      "Base Support": "360-degree rotating base with cable wrap organizer",
      "Sensor safety": "Steam sensor auto shutdown, anti Boil-Dry dry-cook preventative"
    },
    variants: ["Brushed Metal Steel", "Glossy Obsidian Black"]
  },
  {
    id: "luxury-womens-shoulder-bag-charcoal-black",
    name: "Luxury Womens Shoulder Bag (Charcoal Black)",
    description: "The epitome of high-fashion workspace luxury. Hand-stitched with top-grain textured synthetic calfskin leather, modern dual compartment divisions, and accented golden hardware latches.",
    category: "Fashion",
    supplier_price: 2850,
    stock: 75,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Structure Style": "Bespoke structured tote shoulder purse",
      "Composition Leather": "Waterproof vegan crossgrain polyurethane leather",
      "Pocket Configuration": "Two generous zip sections, middle divider slip, internal secure credit card sleeve",
      "Straps included": "Integrated leather handles + detachable adjustable metal crossbody strap"
    },
    variants: ["Midnight Charcoal Black", "Royal Antique Tan", "Crimson Burgundy Gloss"]
  },
  {
    id: "bamboo-joint-glass-cup",
    name: "Bamboo Joint High Borosilicate Glass Cup",
    description: "Sip in minimal luxury with this aesthetic bamboo-profile jointed glass. Ideal for iced coffees, herbal smoothies, boba teas, or workspace hydration setups. Comes with leakproof natural bamboo lid and reusable glass straw.",
    category: "Home & Kitchen Products",
    supplier_price: 750,
    stock: 350,
    images: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Capacity Index": "16 Fluid Ounces (480ml)",
      "Glass Rating": "Borosilicate glass (Resistant to thermal shocks -20C to 150C)",
      "Lid Properties": "Eco friendly food-grade bamboo lid with silicone sealant band",
      "Straw Structure": "Anti-slip bottom bulb glass straw"
    },
    variants: ["Transparent Pure glass", "Frosted Mist white", "Amber Warm Tea"]
  },
  {
    id: "ipl-laser-hair-removal-device",
    name: "IPL Laser Hair Removal Device",
    description: "Unveil silky, smooth skin from your home. Utilizes medical-grade Intense Pulsed Light (IPL) tech to target hair root follicles and interrupt regrowth loops gracefully.",
    category: "Wellness",
    supplier_price: 3950,
    stock: 65,
    images: ["https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Flash Tube Lifespan": "999,999 Permanent Quartz Flashes",
      "Operating Energy": "5 Configurable energy levels",
      "Modes": "Manual Flash (face, underarm) & Auto Flash (legs, back)",
      "Accessories Bundle": "Safety protective eyeglasses, razor, US outlet power transformer"
    },
    variants: ["Pearl Gold White", "Mint Emerald Green"]
  },
  {
    id: "remington-hair-dryer-r6010",
    name: "Remington Hair Dryer R6010 Series",
    description: "Compact yet highly potent professional blowdryer. Engineered with standard ionic ceramic grills to trap moisture, combat static, and deliver healthy blowouts with salon shine.",
    category: "Wellness",
    supplier_price: 2450,
    stock: 130,
    images: ["https://images.unsplash.com/photo-1621245388145-21d7820067ff?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Manufacturer Model": "R-6010 BlowDryer Series",
      "Motor Wattage": "2200W DC Professional Airflow Motor",
      "Control Knobs": "3 heat settings, 2 speed settings + Instant Smart Cold Shot button",
      "Concentrators": "Includes slim styling concentrator + broad volume diffuser",
      "Grate Coating": "Premium Keratin and Argan Oil infused micro-conditioners"
    },
    variants: ["Velvet Matte Pink", "Satin Gold Obsidian"]
  },
  {
    id: "gray-leather-handbag",
    name: "Classic Gray Leather Handbag",
    description: "A soft-structured designer handbag featuring custom textured pebble grain leather. Seamlessly transitions from boardroom meetings to elegant cocktail evenings with its elegant grey tone.",
    category: "Fashion",
    supplier_price: 2950,
    stock: 90,
    images: ["https://images.unsplash.com/photo-1566150905458-1bf1fc15a49d?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Structure Profile": "Pebbled slouchy satchel",
      "Interior Liner": "Water-resistant satin fabric lining",
      "Fittings": "Electroplated dark pewter metallic loops & buckles",
      "External Slots": "Quick access back magnetic envelope card pouch"
    },
    variants: ["Cool Slate Grey", "Warm Taupe Pearl"]
  },
  {
    id: "sheglam-complexion-pro-matte-foundation",
    name: "SHEGLAM Complexion Pro Matte Foundation",
    description: "Next level complexional coverage. Waterproof, transfer-resistant, lightweight formula that conceals blemishes while keeping a soft skin-like satin-matte texture throughout the day.",
    category: "Wellness",
    supplier_price: 1150,
    stock: 180,
    images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Formula Profile": "Oil-Free, talc-free, sweatproof breathable liquid",
      "Coverage Scope": "Medium to Full Build",
      "Active benefits": "Infused with standard botanicals to control sebum without drying",
      "Volume Metric": "30ml Bottle Glass Pump"
    },
    variants: ["Shell Sand (Fair Warm)", "Camel Latte (Medium)", "Porcelain Mist (Fair Cool)"]
  },
  {
    id: "multicolor-acrylic-artificial-nails-kit",
    name: "Multicolor Acrylic Artificial Nails Kit",
    description: "A salon-quality home manicure experience. Includes dynamic colored press-on nails, strong bonding adhesives, prep files, and wood sticks to achieve flawless salon hands.",
    category: "Fashion",
    supplier_price: 650,
    stock: 250,
    images: ["https://images.unsplash.com/photo-1604654894610-df4906b18502?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Kit Inclusions": "24 pieces high durable nails (12 sizes), 1x professional jelly glue sheet, 1x liquid glue, nail file",
      "Material Composition": "Flexible ABS resin (resistant to chipping or lifting)",
      "Finishing coat": "High UV cured lacquer with gloss and glitter details"
    },
    variants: ["French Pastel Ombre", "Burgundy Glitter Velvet", "Nude Minimal Accent"]
  },
  {
    id: "white-luxury-fashion-handbag",
    name: "White Premium Luxury Fashion Handbag",
    description: "Chic, clean, and uncompromisingly high class. Impeccable solid ivory leather build with structured bottom gold studs, modern turn-lock flap, and chain-woven straps.",
    category: "Fashion",
    supplier_price: 3250,
    stock: 60,
    images: ["https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Chassis Layout": "Structured envelope satchel",
      "Colorway": "Ivory Alabaster White",
      "Clasp": "Heavy rotating gold lock",
      "Strap": "Chain woven leather ribbon handle"
    },
    variants: ["Ivory White Gold", "Snow White Silver"]
  },
  {
    id: "oil-free-mini-popcorn-maker",
    name: "Oil-Free High Speed Mini Popcorn Maker",
    description: "Make a bucket of hot, crispy popcorn in 2 minutes without a drop of high-fat frying oil. Utilizing rapid cyclonic hot-air turbine systems for extreme popping yields up to 98%.",
    category: "Home & Kitchen Products",
    supplier_price: 3100,
    stock: 120,
    images: ["https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Total Output": "1200 Watts core hot air turbine",
      "Popping mechanism": "Heat circulation (no oil required)",
      "Materials": "Food grade FDA approved PP housing, aluminum heating chamber",
      "Accessories": "Built in measuring spoon doubles as butter-melting tray lid"
    },
    variants: ["Crimson Red Retro", "Midnight Pitch Black"]
  },
  {
    id: "moving-sand-art-picture",
    name: "3D Moving Sand Art Picture Round Glass",
    description: "Immersive desk art piece. Delicate shifting sand formations create majestic mountains, endless deserts, and scenic ocean beds with every single rotation. Relieves stress instantly.",
    category: "Lifestyle Products",
    supplier_price: 1350,
    stock: 180,
    images: ["https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Outer Dimension": "7 inches Round Glass Frame",
      "Base Construction": "Steady secure acrylic support stand",
      "Layer Details": "Multi colored mineral sand, air regulator valve",
      "Visual effects": "Slow continuous flow dynamics"
    },
    variants: ["Oceanic Blue Shimmer", "Midnight Golden Dune", "Purple Galaxy Violet"]
  },
  {
    id: "led-temperature-display-water-bottle",
    name: "LED Temperature Display Smart Water Bottle",
    description: "Sip wisely. Double-walled vacuum stainless steel thermos with an integrated high-resolution smart touch LED temperature reading cap. Prevents hot liquid mouth burns.",
    category: "Accessories",
    supplier_price: 850,
    stock: 400,
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Capacity Limit": "500 Milliliters (17oz)",
      "Sensor Tech": "Instant temperature cap sensor (battery lasts 50,000+ touches)",
      "Lining Composition": "Dual Wall premium SS304 Food-Contact Stainless",
      "Insulation Duration": "Keep hot for 12 hours | Keep ice cold for up to 24 hours"
    },
    variants: ["Obsidian Matte Black", "Cool Alpine Blue", "Crimson Metallic Red"]
  },
  {
    id: "we-babe-bears-water-bottle",
    name: "We Babe Bears Pastel Straw Water Bottle",
    description: "Adorably playful hydration flask featuring cartoon series panda and polar bear designs. Perfect school bottle with a pop-up dust cover, safety lock, and food-safe soft silicon straw.",
    category: "Accessories",
    supplier_price: 750,
    stock: 280,
    images: ["https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Liquid Volume": "650 Milliliters",
      "Material Build": "Shatterproof BPA-Free Tritan clear copolymer",
      "Portability": "Adjustable woven shoulder string belt",
      "Lid mechanism": "One-Button spring-pop push trigger"
    },
    variants: ["Cute Milk Grizzly Bear", "Chibi Ice Polar Bear", "Panda Bamboo Mint"]
  },
  {
    id: "vacuum-sealer-machine",
    name: "Fresh Preservation Vacuum Sealer Machine",
    description: "Keep groceries 10x fresher and prevent bad freezer burns. Powerful high-pressure vacuum evacuation seals vegetables, meats, and dried herbs in milliseconds.",
    category: "Home & Kitchen Products",
    supplier_price: 1950,
    stock: 110,
    images: ["https://images.unsplash.com/photo-1547032175-7fc8c7bd15b3?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Motor Suction Value": "60Kpa Air Evacuation pump",
      "Sealable Length": "Maximum 30cm seal track width",
      "Operating Cycles": "Two settings: Single Heat Seal / Vacuum and Fast Heat Seal",
      "Inside packaging": "Includes 10x textured heat-lock sealer bags"
    },
    variants: ["Sleek Alabaster White", "Professional Matte Black"]
  },
  {
    id: "black-stylish-water-sport-bottle",
    name: "Black Stylish Water Sport Bottle",
    description: "Heavy duty gym hydration container with motivational hourly volume marks. Equipped with dynamic handle straps, wide leak-proof lids, and single hand click-cap locks.",
    category: "Accessories",
    supplier_price: 1050,
    stock: 320,
    images: ["https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Total Capacity": "1000ml (32 oz) volumetric body",
      "Body material": "High impact resistant BPA-free clear Eastman Tritan",
      "Lid safety": "360-degree leak-free lock latch cover",
      "Accents": "Soft rubberized anti slip grip band"
    },
    variants: ["Smokey Charcoal Black", "Cyberpunk Lime Black"]
  },
  {
    id: "14-in-1-mandoline-slicer",
    name: "14-in-1 Mandoline Vegetable Slicer & Chopper",
    description: "Cut meal-prep time in half. Professional countertop mandoline with 14 exchangeable stainless steel blades to slice, julienne, grate, and dice onions, potatoes, and garlic safely.",
    category: "Home & Kitchen Products",
    supplier_price: 1450,
    stock: 160,
    images: ["https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Interchangeable Blades": "14 unique functional stainless steel cutters",
      "Catch Basin Area": "1.5 Liters clear container",
      "Safety Layering": "Integrated finger protective push guard glove",
      "Cleaning tool": "Mini comb scraper brush included"
    },
    variants: ["Kitchen Forest Green", "Modern Light Grey"]
  },
  {
    id: "f3-mobile-screen-magnifier",
    name: "F3 3D HD Mobile Screen Magnifier",
    description: "Turn your smartphone screen layout into an instant 12-inch private theater projector box. Built with premium acrylic optical lens to zoom mobile pictures without distortion under eye strain.",
    category: "Smart Gadgets",
    supplier_price: 550,
    stock: 450,
    images: ["https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Amplification Power": "3x to 4x High Definition Zoom magnifying",
      "Screen Panel Material": "3D Fresnel optical blue-ray lens",
      "Stand Frame": "Foldable book-slip wooden grain veneer casing",
      "Broad Support": "Universally adjustable for all iOS/Android phones"
    },
    variants: ["Executive Walnut Gold", "Royal Maple Carbon"]
  },
  {
    id: "white-cat-handle-handbag",
    name: "White Cat-Handle Kawaii Shoulder Bag",
    description: "An incredibly adorable fashion statement purse. Beautifully crafted structured vegan leather featuring metal cute cat ears handle grips and gold whiskers decorations.",
    category: "Fashion",
    supplier_price: 1850,
    stock: 140,
    images: ["https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Structure Frame": "Rigid geometric pastel clutch box",
      "Carry Modes": "Gold-plated cat ear handles + long detachable crossbody gold chain",
      "Material Build": "Scratchproof premium PU artificial leather",
      "Closure Link": "High density snap button clasp"
    },
    variants: ["Kawaii Cat Ivory White", "Blossom Pastel Pink", "Aesthetic Lilac Mist"]
  },
  {
    id: "back-pain-relief-posture-corrector",
    name: "Smart Back Pain Relief Posture Corrector",
    description: "Combat desk job muscle fatigue and curved backs. Fully adjustable dual-tension skeletal straps guide shoulders back gently to align the spine, enhancing sitting posture.",
    category: "Wellness",
    supplier_price: 750,
    stock: 290,
    images: ["https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Strap Structure": "Ergonomic Fig.8 high breathable neoprene shoulder straps",
      "Fixation Support": "Thick broad velcro chest panel straps",
      "Target Sizes": "Fully adjustable (waist size 28 to 44 inches compatible)",
      "Breathability": "Ventilated mesh fabric back spacer panel"
    },
    variants: ["Minimal Charcoal Black", "Medical Light Grey"]
  },
  {
    id: "speed-x-bulb-camera",
    name: "Speed-X 1080P Panoramic Smart E27 Bulb Camera",
    description: "Get immediate full-circle security without drilling holes or wiring power supplies. Fits into any standard E27 electrical light socket. Features night vision, tracking, and two-way voice chat.",
    category: "Smart Gadgets",
    supplier_price: 2600,
    stock: 150,
    images: ["https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Socket Port": "E27 Threaded Base Socket Type",
      "Sensor Resolution": "1080P HD (1920*1080) video capture",
      "Rotation Sweep": "Pan: 355-degrees, Tilt: 90-degrees smart track",
      "Night illumination": "Dual Array (4x White LED, 4x Infrared LED sensors)",
      "Wireless Protocol": "2.4GHz Wi-Fi (requires camera smartphone app)"
    },
    variants: ["Pure White Security Edition", "Tactical Obsidian Cover"]
  },
  {
    id: "mac-makeup-brush-set",
    name: "MAC Premium Synthetic Makeup Brush Set",
    description: "Elevate your cosmetics game. Premium cosmetic brushes featuring extremely soft, silk-engineered synthetic bristles that blend powders and creams perfectly without soaking products.",
    category: "Fashion",
    supplier_price: 1250,
    stock: 220,
    images: ["https://images.unsplash.com/photo-1522337628087-0242ee474bc2?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Case Inclusions": "12 essential face & eye brushes (powder, blush, eyeshadow contour brushes)",
      "Bristle Material": "Micro-fine cruelty-free hypoallergenic synthetic fibers",
      "Handles build": "Reinforced solid timber handles with plated aluminum ferrules",
      "Package Casing": "Includes roll-up vegan leather luxury brush wallet bag"
    },
    variants: ["Classic Onyx Black", "Chic Champagne Gold", "Sunset Rose Pink"]
  },
  {
    id: "brava-spring-vegetable-slicer",
    name: "Brava Spring Vertical Safe Vegetable Slicer",
    description: "The safest kitchen slicer. Vertical spring lever system cuts cucumbers, carrots, and onions without fingers ever approaching the razor blades. Compact fold design.",
    category: "Home & Kitchen Products",
    supplier_price: 1850,
    stock: 140,
    images: ["https://images.unsplash.com/photo-1547032175-7fc8c7bd15b3?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Slicing Styles": "Slices, juliennes, matchsticks, and chips (thickness 0.5mm to 8.0mm)",
      "Safety Layer": "Automatic spring plunger arm, concealed cutting design",
      "Cutter Quality": "Triple surgical grade SS420 hardened steel blades",
      "Base Support": "Broad suction cups stabilization base"
    },
    variants: ["Sage Mint Green", "Polar Ice White", "Crimson Kitchen Pepper"]
  },
  {
    id: "led-acrylic-writing-board",
    name: "LED Luminous Acrylic Message Writing Board",
    description: "Scribble down your daily notes, calendar dates, or sweet sketches on this gorgeous light-up acrylic note board. Highlighted with warm bedside LED desk lamps.",
    category: "Lifestyle Products",
    supplier_price: 1150,
    stock: 190,
    images: ["https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Board material": "Premium high transmittance clear safety acrylic",
      "Base Construction": "Warm-white high energy LED solid plastic base",
      "Connectivity": "Power cord connects to standard USB",
      "Accessories Bundle": "Comes with 1x white liquid chalk pen with integrated caps eraser"
    },
    variants: ["Aero Desktop Rectangular", "Creative Bedside Rounded Heart"]
  },
  {
    id: "pack-of-3-led-tap-lights",
    name: "Wireless Touch LED Push Tap Lights (Pack of 3)",
    description: "Install quick spotlighting anywhere in seconds. High intensity battery powered puck lights. Tap the face to turn on/off or use the remote controller to activate distance timers.",
    category: "Lifestyle Products",
    supplier_price: 550,
    stock: 310,
    images: ["https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Bundle Volume": "3x Premium circular light pucks + 1x Multi-device remote control",
      "Luminous Output": "COB High Output brightness (adjustable dimming settings)",
      "Battery Source": "Requires 3x AAA cells for every single puck light unit",
      "Sticking Base": "Includes heavy traction double side adhesive tape"
    },
    variants: ["Alabaster White Glow", "Charcoal Slate Silver"]
  },
  {
    id: "turbofan-rechargeable-mini-fan",
    name: "Turbofan Rechargeable High Velocity Mini Fan",
    description: "Beat the summer heat. Pocket size personal fan utilizing fighter jet engine turbine structures. Incredible airflow yield in an ultra compact casing.",
    category: "Smart Gadgets",
    supplier_price: 1550,
    stock: 240,
    images: ["https://images.unsplash.com/photo-1619224466241-8e516b8a2f1b?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Airflow Speed": "5m/s wind speed velocity",
      "Speed gears": "3 modular gear adjustments (Gentle, Breeze, Jet-Stream)",
      "Power Reservoir": "Rechargeable 2200mAh lithium battery (lasts 3 to 7 hours)",
      "Charging Port": "Type-C universal charger port"
    },
    variants: ["Ice Jade Green", "Charcoal Matte Black", "Cool Frost White"]
  },
  {
    id: "silicone-spa-gel-socks",
    name: "Moisturizing Silicone Spa Gel Care Socks",
    description: "Soften rough dry cracked heels in 3 days. Standard spandex socks containing thick inside lining of medical gel infused with Vitamin E, Jojoba oils, and Aloe Vera plant nutrients.",
    category: "Wellness",
    supplier_price: 450,
    stock: 500,
    images: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Gel Ingredients": "100% thick medical TPU gel, Jojoba oil, lavender essence, Olive oil, Vitamin E",
      "Fabric Material": "Highly elastic soft cotton-spandex breathable knit",
      "Instructions": "Wear for 20-30 mins daily or as sleep socks, washable and reusable"
    },
    variants: ["Sweet Blossom Pink", "Fresh Ocean Turquoise"]
  },
  {
    id: "silicone-ice-genie-cube-maker",
    name: "Silicone Ice Genie Portable Ice Cube Maker",
    description: "Save space in compact freezers. Dynamic circular double-chamber ice bucket mold. Outside chamber freezes the cubes while the inside chamber holds up to 120 freshly frozen cubes.",
    category: "Home & Kitchen Products",
    supplier_price: 650,
    stock: 180,
    images: ["https://images.unsplash.com/photo-1610970881699-44a5587caa16?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Freezing Capacity": "Can produce and hold up to 120 standard ice cubes",
      "Outer Mold material": "FDA certified food safe flexible silicone",
      "Structure Support": "Includes air-tight sealing top lid to keep ice fresh from fridge odors",
      "Space Saving Index": "Replaces up to 10 standard square plastic ice trays"
    },
    variants: ["Sky Blue Genie", "Emerald Mint Green"]
  },
  {
    id: "cordless-drill-machine-kit",
    name: "12V Rechargeable Cordless Drill Machine Kit",
    description: "The complete home repair companion. Powerful 12V variable torque screwdriver and impact drill. Includes drill bits, extension shafts, and dual speed gearbox. Encased in a solid carrying box.",
    category: "Smart Gadgets",
    supplier_price: 4250,
    stock: 110,
    images: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Volt Capacity": "12V Rechargeable Lithium High Yield Ion",
      "Clutch Gears": "18+1 adjustable torque positions",
      "No Load Speed rate": "0-350 / 0-1350 Rpm dual index speeds",
      "Bundle Items": "1x Drill machine, 1x battery charger, 12x drill & screwdriver accessories bits, hard organizer plastic case"
    },
    variants: ["Tactical Amber Yellow", "Industrial Teal Green"]
  },
  {
    id: "8-pcs-professional-tool-set",
    name: "8-Pcs Professional Household Hardware Tool Set",
    description: "Essential tool array for standard apartment maintenance, furniture assembly, and basic DIY crafts. Contains hardened steel hex keys, levelers, screwdrivers, tape meters, and hammers.",
    category: "Home & Kitchen Products",
    supplier_price: 1950,
    stock: 170,
    images: ["https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Kit Components": "1x utility knife, 1x digital voltage tester pen, 1x 2-meter tape measurer, 1x Phillips screwdriver, 1x Flathead screwdriver, 1x insulation pliers, 1x solid claw hammer, storage box",
      "Metal Quality": "Heat treated high grade chrome vanadium alloys",
      "Handles Profile": "Double layer insulated non-slip rubber jackets"
    },
    variants: ["Safety Yellow Pack", "Corporate Graphite Green"]
  },
  {
    id: "crazy-girl-waterproof-blush",
    name: "Crazy Girl Waterproof Liquid Blush",
    description: "Create elegant summer glows. Long-lasting, silky feather-light liquid blush formulation that blends into your cheeks flawlessly, offering dynamic pink mineral finishes.",
    category: "Wellness",
    supplier_price: 550,
    stock: 350,
    images: ["https://images.unsplash.com/photo-1631730359575-38e4755d772b?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Finish Accent": "Dewy luminous natural blushing cheek tint",
      "Drying Speed": "Quick set smudge-proof transfer-resistant dry-down",
      "Botanical extracts": "Infused with standard rose moisturizing seed oils",
      "Volume metric": "10ml clear vial bottle with cushion wand applicator"
    },
    variants: ["Cherry Blossom (Rosy Pink)", "Peachy Glow (Warm Sunset)", "Plum Berry (Rich Wine)"]
  },
  {
    id: "remington-keratin-therapy-straightener",
    name: "Remington Keratin Therapy Hair Straightener",
    description: "Achieve sleek hairstyles while shielding your hair from bad thermal damage. Features ceramic plates infused with Keratin keratin-protective micro conditioners.",
    category: "Wellness",
    supplier_price: 3100,
    stock: 90,
    images: ["https://images.unsplash.com/photo-1522337628087-0242ee474bc2?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Plate Quality": "110mm floating ceramic plates with Keratin Protective Technology",
      "Heat Range": "Adjustable digital temperature control up to 230C",
      "Safe Shutoffs": "Automatic safety auto shutoff timer after 60 mins",
      "Special Heat sensors": "Built-in Heat Protection active sensor adjusts plates heat to balance hair moisture levels"
    },
    variants: ["Bronze Keratin Edition", "Soft Pearl Cream Straightener"]
  },
  {
    id: "2-in-1-flawless-facial-hair-remover",
    name: "2-in-1 Flawless Electric Facial Hair Remover",
    description: "Gently wipe away fuzzy upper lips, sideburns, and eyebrow stray hairs with absolute painless perfection. Features micro-precision hypoallergenic trimmer tips.",
    category: "Wellness",
    supplier_price: 750,
    stock: 380,
    images: ["https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Dual Head Tips": "Includes 1x broad facial shave tip, 1x micro precision eyebrow shaper comb tip",
      "Trimming Blades": "Hypoallergenic gold plated medical steel rotary cutters",
      "Power Charging": "USB rechargeable (charging cord included)",
      "Safety Layer": "Smooth gliding skin-guard shield prevents cuts or redness"
    },
    variants: ["Glossy Rose Gold", "Chic Pearl White", "Sweet Pink Pastel"]
  },
  {
    id: "black-stylish-stanley-barbie-tumbler",
    name: "Black Stylish Stanley Barbie Edition Tumbler",
    description: "The ultimate limited edition collaboration. A chic, dark aesthetic design blended with pop Barbie pink accents. High-yield double vacuum steel insulation that locks ice fresh for 48 hours.",
    category: "Accessories",
    supplier_price: 2500,
    stock: 110,
    images: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Special Edition": "Barbie x Stanley Gothic Pink Glamour",
      "Volume index": "40 Fluid Ounces (1.18 Liters)",
      "Thermal Insulation": "Cold: 11 hours | Iced: 48 hours | Hot: 7 hours",
      "Body Structure": "Textured matte coal carbon steel with hot-magenta logo stamping"
    },
    variants: ["Gothic Barbie Black-Pink", "Neon Malibu Pink-Carbon"]
  },
  {
    id: "ordinary-face-hand-brightening-kit",
    name: "The Ordinary Face & Hand Brightening Kit",
    description: "Restore skin luminosity with this ultra-brightening treatment kit. Combines premium Alpha Arbutin and concentrated Niacinamide to repair dark spots and uneven skin textures.",
    category: "Wellness",
    supplier_price: 1350,
    stock: 240,
    images: ["https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Bundle Components": "1x Alpha Arbutin 2% + HA Serum (30ml), 1x Niacinamide 10% + Zinc 1% Serum (30ml)",
      "Target Symptoms": "Sun pigmentation, face hyperpigmentation, rough skin, hand wrinkles",
      "User guides": "Apply Arbutin in morning routine, apply Niacinamide at night routine, wear SPF daily"
    },
    variants: ["Standard Twin Booster Kit"]
  },
  {
    id: "xingchao-lint-remover",
    name: "XingChao Rechargeable Electric Lint Remover",
    description: "Make worn-out winter sweaters and fleece trousers look brand new in 30 seconds. Strong rotary vacuum fan sucks up and slices away lint fuzz, pilling, and stray fiber threads elegantly.",
    category: "Home & Kitchen Products",
    supplier_price: 1050,
    stock: 200,
    images: ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Cutting Grid": "Stainless steel micro-honeycomb mesh shaver screen",
      "Blade core": "Floating three-blade carbon steel rotary cutting head",
      "Air Suction power": "7000 Rpm rapid rotation fan",
      "Power charging": "Universal USB charging (lasts up to 60 mins continuous operation)"
    },
    variants: ["Jade Mint Green", "Sleek Frost White"]
  },
  {
    id: "digital-period-heating-pad",
    name: "Digital Period Warm Menstrual Heating Pad",
    description: "Immediate relief from intense lady cramps. Smart wearable abdominal massage belt equipped with rapid heating pads and mild acoustic dynamic massage frequencies.",
    category: "Wellness",
    supplier_price: 1750,
    stock: 190,
    images: ["https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Heat Temperature levels": "3 levels (50C / 55C / 60C rapid carbon-crystal heating)",
      "Massage programs": "4 modular vibrating relaxation speeds",
      "Strap Extension": "Elastic stretchable buckled waist strap (fits up to 48-inch waist)",
      "Battery Source": "Rechargeable internal 1800mAh battery (lasts 3 to 5 hours)"
    },
    variants: ["Soft Sakura Pink", "Creamy Alabaster White"]
  },
  {
    id: "makeup-brush-set-12-piece",
    name: "Professional 12-Piece HD Makeup Brush Set",
    description: "A complete toolkit for professional blending, highlighting, and lining. Master makeup looks with these eco-friendly bamboo wood handle brushes with ultra-dense micro-synthetic bristles.",
    category: "Fashion",
    supplier_price: 1050,
    stock: 260,
    images: ["https://images.unsplash.com/photo-1522337628087-0242ee474bc2?auto=format&fit=crop&q=80&w=600"],
    specifications: {
      "Total brushes": "12 essential cosmetic brushes with labeled names",
      "Bristle Fibers": "Deep premium density soft synthetic goat-wool substitute",
      "Ferrule build": "Heavy duty nickel-plated copper cuffs",
      "Case Styling": "Includes elegant canvas roll up drawstring cotton pouch"
    },
    variants: ["Eco Linen Cream Set", "Obsidian Wood Black Set"]
  }
];
