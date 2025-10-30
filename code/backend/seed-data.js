const db = require('./database');

// Clear existing data
console.log('Clearing existing data...');
db.prepare('DELETE FROM decisions').run();
db.prepare('DELETE FROM actions').run();

// Insert Decisions
console.log('Inserting decisions...');

const decisions = [
  {
    title: 'Location Strategy: 20+ Miles Inland',
    category: 'Location',
    status: 'decided',
    priority: 'high',
    options: 'Beachfront/Coastal (0-5 miles), Near Coast (5-10 miles), Inland (10-20 miles), Deep Inland (20+ miles)',
    decision: 'Target properties 20+ miles inland from coast (not beachfront/coastal)',
    rationale: 'Base insurance rates vs 200-400% coastal surcharges. Lower hurricane wind damage exposure. Annual insurance savings: $2,000-4,000+. Still within 2 hours of parents in Arcadia. Significantly reduces overall housing costs.',
    owner: 'Both',
    date_needed: '2025-09-01',
    dependencies: null
  },
  {
    title: 'RV Sale Method: Facebook Marketplace Primary',
    category: 'RV Strategy',
    status: 'decided',
    priority: 'high',
    options: 'Consignment primary (8-10% commission), Private sale (higher risk, timing uncertainty), Facebook Marketplace (no commission, control), Dealer trade-in (lowest value)',
    decision: 'Use Facebook Marketplace as primary sale method, with consignment dealers as backup',
    rationale: 'Saves 8-10% commission (~$15,000-19,000 on $160K-190K sale). Allows living in RV during transition. Timeline aligns with March 2026 arrival. Strong Florida RV market for direct sales. Consignment backup reduces risk if timing doesn\'t work.',
    owner: 'Both',
    date_needed: '2025-08-01',
    dependencies: null
  },
  {
    title: 'RV Sale Timing: January-March 2026',
    category: 'Timeline',
    status: 'decided',
    priority: 'medium',
    options: 'Fall 2024 (too early, need RV for housing), January-March 2026 (peak season, aligns with move), Spring-Summer 2026 (post-move, lower demand)',
    decision: 'Start listing Journey in January 2026, complete sale by March 2026',
    rationale: 'Peak RV selling season in Florida (40% increase in buyer activity). Spring break preparation drives demand. Perfect alignment with March 2026 Florida arrival. Allows time for prep and repairs. Avoids long-term storage costs.',
    owner: 'Both',
    date_needed: '2025-08-01',
    dependencies: null
  },
  {
    title: 'RV Prep Approach: 5 Essential Tasks',
    category: 'RV Strategy',
    status: 'decided',
    priority: 'low',
    options: 'Comprehensive 6+ task prep list (expensive, diminishing returns), Specific 5 tasks (batteries, generator, brakes, detailing, slide-outs), Minimal inspection-driven prep only',
    decision: 'Focus on 5 specific high-impact prep tasks rather than comprehensive overhaul',
    rationale: 'Focus on known Journey issues and buyer concerns. Manageable scope with clear budget ($2K-5K total). Addresses safety-critical systems (brakes, batteries). Cosmetic improvements for listing photos (detailing). Operational functionality (generator, slide-outs).',
    owner: 'JoJo',
    date_needed: '2025-08-01',
    dependencies: null
  },
  {
    title: 'Property Type Selection',
    category: 'Property Type',
    status: 'pending',
    priority: 'high',
    options: 'Manufactured Home in 55+ Community ($160K-230K), Modular Home ($200K-250K), Traditional Stick-Built Home ($250K+), 55+ Community (any type) ($180K-230K)',
    decision: 'Focus on quality manufactured homes in 55+ communities (based on October 2025 research findings)',
    rationale: 'True modular homes essentially non-existent in the $200-250K Florida market. Most homes marketed as modular are actually manufactured homes. Need to clarify occupancy status first.',
    owner: 'Both',
    date_needed: '2025-12-31',
    dependencies: 'Occupancy Status Decision'
  },
  {
    title: 'Occupancy Status: Primary vs Seasonal Residence',
    category: 'Financial',
    status: 'pending',
    priority: 'high',
    options: 'Primary Residence (6+ months/year occupancy), Seasonal Residence (3-9 months, 60+ days vacant)',
    decision: null,
    rationale: 'Difference: $1,000-2,000/year in insurance costs. Over 10 years: $10,000-20,000. Required for getting accurate insurance quotes (January 2026). Affects property type decision.',
    owner: 'Both',
    date_needed: '2025-12-01',
    dependencies: null
  },
  {
    title: 'Specific County/City Selection',
    category: 'Location',
    status: 'pending',
    priority: 'high',
    options: 'Sarasota County (Venice, North Port, Sarasota), Manatee County (Bradenton, Palmetto), Charlotte County (Punta Gorda, Port Charlotte)',
    decision: null,
    rationale: 'Current focus areas: Bay Indies Resort (Venice) - New construction, 55+. Harbor Isles (North Port) - Land-owned, waterfront.',
    owner: 'Both',
    date_needed: '2025-12-31',
    dependencies: null
  },
  {
    title: 'Budget Allocation Strategy',
    category: 'Financial',
    status: 'pending',
    priority: 'high',
    options: 'Max House Budget ($200-250K), Conservative House ($150-200K), Land + Build Strategy, Rent Initially (6-12 months)',
    decision: null,
    rationale: 'Journey proceeds: $160K-185K expected. Replacement RV: ~$100K needed. Insurance: $3K-5K/year. Property taxes: varies by county. HOA fees: $200-400/month if 55+ community.',
    owner: 'Both',
    date_needed: '2025-12-31',
    dependencies: 'Occupancy Status, Property Type'
  },
  {
    title: 'Replacement RV Selection',
    category: 'RV Strategy',
    status: 'pending',
    priority: 'medium',
    options: 'Class B (smaller, easier to drive, lower cost) $75K-90K, Class C (larger, more amenities) $90K-110K',
    decision: null,
    rationale: 'Not urgent until after home purchase. Journey proceeds will inform final budget. Can evaluate market conditions closer to purchase time.',
    owner: 'Both',
    date_needed: '2026-06-01',
    dependencies: 'Budget Allocation'
  }
];

const insertDecision = db.prepare(`
  INSERT INTO decisions (title, category, status, priority, options, decision, rationale, owner, date_needed, dependencies)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

decisions.forEach(d => {
  insertDecision.run(
    d.title, d.category, d.status, d.priority, d.options,
    d.decision, d.rationale, d.owner, d.date_needed, d.dependencies
  );
});

console.log(`Inserted ${decisions.length} decisions`);

// Insert Actions
console.log('Inserting actions...');

const actions = [
  {
    title: 'Schedule RV Inspection',
    category: 'RV Sale',
    status: 'pending',
    priority: 'high',
    owner: 'JoJo',
    due_date: '2025-11-15',
    dependencies: null,
    notes: 'Get professional inspection to identify repair needs and baseline condition for sale documentation. Budget: $400-500',
    on_critical_path: true,
    estimated_hours: null
  },
  {
    title: 'Begin Community Monitoring - Bay Indies Resort',
    category: 'Home Search',
    status: 'pending',
    priority: 'high',
    owner: 'Both',
    due_date: '2025-11-15',
    dependencies: null,
    notes: 'Target community #1. New 2024-2025 construction, $160-230K range, 55+ community. Check Zillow, Realtor.com, MHVillage regularly',
    on_critical_path: false,
    estimated_hours: null
  },
  {
    title: 'Begin Community Monitoring - Harbor Isles',
    category: 'Home Search',
    status: 'pending',
    priority: 'high',
    owner: 'Both',
    due_date: '2025-11-15',
    dependencies: null,
    notes: 'Target community #2. Land-owned (no lot rent), waterfront, manufactured homes on permanent foundation',
    on_critical_path: false,
    estimated_hours: null
  },
  {
    title: 'Start RV Prep Tasks',
    category: 'RVPrep',
    status: 'pending',
    priority: 'medium',
    owner: 'JoJo',
    due_date: '2025-11-30',
    dependencies: null,
    notes: 'Start with highest priority items (batteries, generator) before inspection. Budget $2K-5K total',
    on_critical_path: false,
    estimated_hours: null
  },
  {
    title: 'Clarify Occupancy Status',
    category: 'Financial',
    status: 'pending',
    priority: 'high',
    owner: 'Both',
    due_date: '2025-12-01',
    dependencies: null,
    notes: 'CRITICAL - REQUIRED for insurance quotes. Seasonal occupancy adds 50-150% surcharge vs primary residence base rates. This affects ALL insurance cost estimates and property type decision. Impact: $1,000-2,000/year in insurance costs',
    on_critical_path: true,
    estimated_hours: null
  },
  {
    title: 'Update Property Type Decision',
    category: 'Planning',
    status: 'pending',
    priority: 'high',
    owner: 'Both',
    due_date: '2025-12-15',
    dependencies: 'Occupancy Status',
    notes: 'October 2025 finding: True modular doesn\'t exist in FL market at our price point. Most modular are manufactured homes. Decision: Focus on quality manufactured homes in 55+ communities. Update Decision Log formally.',
    on_critical_path: true,
    estimated_hours: null
  },
  {
    title: 'Research 55+ Communities',
    category: 'Home Search',
    status: 'pending',
    priority: 'medium',
    owner: 'Both',
    due_date: '2025-12-15',
    dependencies: null,
    notes: 'Create comprehensive list of communities in Sarasota/Manatee counties (20+ miles inland) that allow RV parking. Contact HOAs for specific rules. Critical requirement for property selection.',
    on_critical_path: false,
    estimated_hours: null
  },
  {
    title: 'Finalize Budget Allocation',
    category: 'Financial',
    status: 'pending',
    priority: 'high',
    owner: 'Both',
    due_date: '2025-12-31',
    dependencies: 'Occupancy Status, Property Type',
    notes: 'Once occupancy status and property type are decided, finalize split between house purchase, reserves, and RV fund',
    on_critical_path: true,
    estimated_hours: null
  },
  {
    title: 'Get Insurance Quotes',
    category: 'Financial',
    status: 'pending',
    priority: 'high',
    owner: 'JoJo',
    due_date: '2026-01-01',
    dependencies: 'Occupancy Status',
    notes: 'Get actual insurance quotes for manufactured homes (3 carriers). Use hypothetical addresses in target areas (20+ miles inland). Try Citizens Property, Foremost, American Modern. REQUIRES occupancy status to be clarified first. Expected range: $1,200-2,500/year base, or $2,100-4,375 with seasonal surcharge.',
    on_critical_path: true,
    estimated_hours: null
  },
  {
    title: 'Facebook Marketplace Prep',
    category: 'RV Sale',
    status: 'pending',
    priority: 'high',
    owner: 'Both',
    due_date: '2026-01-15',
    dependencies: null,
    notes: 'Study safety protocols, pricing strategies, successful listing examples for large RVs. Prepare listing template and photo checklist.',
    on_critical_path: false,
    estimated_hours: null
  },
  {
    title: 'Begin Active Property Search',
    category: 'Home Search',
    status: 'pending',
    priority: 'high',
    owner: 'Both',
    due_date: '2026-01-31',
    dependencies: 'Property Type, Budget Allocation',
    notes: 'Based on decisions made in December, create specific property search criteria and begin active viewing schedule',
    on_critical_path: true,
    estimated_hours: null
  },
  {
    title: 'Research Consignment Backup',
    category: 'RV Sale',
    status: 'pending',
    priority: 'medium',
    owner: 'Both',
    due_date: '2026-01-31',
    dependencies: null,
    notes: 'Identify 3-5 reputable consignment dealers with good commission rates and marketing reach as backup to Facebook strategy',
    on_critical_path: false,
    estimated_hours: null
  },
  {
    title: 'Replace Batteries',
    category: 'RVPrep',
    status: 'pending',
    priority: 'high',
    owner: 'JoJo',
    due_date: '2026-01-31',
    dependencies: null,
    notes: 'Replace house and chassis batteries. Current batteries very old, likely to fail inspection. Need deep cycle house batteries (4x) + chassis battery. Get quotes from battery specialists and RV service centers. Budget: $800-1,200',
    on_critical_path: false,
    estimated_hours: 4
  },
  {
    title: 'Service Generator',
    category: 'RVPrep',
    status: 'pending',
    priority: 'high',
    owner: 'JoJo',
    due_date: '2026-01-31',
    dependencies: 'Replace Batteries',
    notes: 'Service generator and address operational issues. Generator must be fully operational for sale. Service, oil change, test all functions. Address any starting or operational issues. Budget: $300-600',
    on_critical_path: false,
    estimated_hours: 3
  },
  {
    title: 'Brake System Service',
    category: 'RVPrep',
    status: 'pending',
    priority: 'high',
    owner: 'JoJo',
    due_date: '2026-01-31',
    dependencies: null,
    notes: 'Complete brake system inspection and service. Essential safety system. Inspect brake pads, rotors, hydraulic system. Service if needed for safety and buyer confidence. Budget: $400-800',
    on_critical_path: false,
    estimated_hours: 4
  },
  {
    title: 'Slide-Out Inspection',
    category: 'RVPrep',
    status: 'pending',
    priority: 'medium',
    owner: 'JoJo',
    due_date: '2026-01-31',
    dependencies: null,
    notes: 'Inspect and repair slide-out operations. All 3 slideouts must operate smoothly. Check seals, motor operation, leveling. Repair any issues. Budget: $200-600',
    on_critical_path: false,
    estimated_hours: 3
  },
  {
    title: 'Professional Detailing',
    category: 'RVPrep',
    status: 'pending',
    priority: 'low',
    owner: 'JoJo',
    due_date: '2026-02-01',
    dependencies: 'Replace Batteries, Service Generator, Brake System Service, Slide-Out Inspection',
    notes: 'Professional RV detailing (interior/exterior). Essential for listing photos. Deep clean interior, exterior wash/wax, carpet cleaning. Research mobile RV detailers. Schedule AFTER all mechanical work is complete. Budget: $800-1,200',
    on_critical_path: false,
    estimated_hours: 8
  }
];

const insertAction = db.prepare(`
  INSERT INTO actions (title, category, status, priority, owner, due_date, dependencies, notes, on_critical_path, estimated_hours)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

actions.forEach(a => {
  insertAction.run(
    a.title, a.category, a.status, a.priority, a.owner,
    a.due_date, a.dependencies, a.notes, a.on_critical_path ? 1 : 0, a.estimated_hours
  );
});

console.log(`Inserted ${actions.length} actions`);
console.log('\n✅ Database seeded successfully!');
console.log(`Total: ${decisions.length} decisions, ${actions.length} actions`);
