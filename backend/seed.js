import { Admin } from './models/Admin.js';
import { Category } from './models/Category.js';
import { Product } from './models/Product.js';
import { Enquiry } from './models/Enquiry.js';
import { Program } from './models/Program.js';

export const seedDatabaseIfEmpty = async () => {
  try {
    // 1. Admin
    const adminCount = await Admin.countDocuments({});
    if (adminCount === 0) {
      console.log('[Seed] Seeding default administrator account...');
      await Admin.create({
        name: 'Dr. R. Senthilkumar (Proprietor)',
        email: 'admin@sriammanbiocare.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('[Seed] Admin created: admin@sriammanbiocare.com / admin123');
    }

    // 2. Exact 8 Product Categories
    const existingCats = await Category.find({});
    const requiredCategoryNames = [
      'Biofertilizer',
      'Biocontrol agents',
      'Bio pesticides',
      'Bio insecticides',
      'Bio tonics',
      'Vermicompost',
      'Earth worms',
      'Azolla'
    ];

    const hasAllCats = requiredCategoryNames.every(name => 
      existingCats.some(c => c.name.toLowerCase() === name.toLowerCase())
    );

    if (!hasAllCats || existingCats.length < 8) {
      console.log('[Seed] Ensuring all 8 exact Sri Amman Biocare product categories exist...');
      const targetCategories = [
        {
          name: 'Biofertilizer',
          slug: 'biofertilizer',
          description: 'Living microbial inoculants like Azospirillum, Phosphobacteria, and KMB that provide organic N P K nutrition naturally.',
          image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80',
          status: 'Active',
        },
        {
          name: 'Biocontrol agents',
          slug: 'biocontrol-agents',
          description: 'Beneficial antagonistic fungi and bacteria like Trichoderma viride and Pseudomonas to protect roots against soil wilts.',
          image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80',
          status: 'Active',
        },
        {
          name: 'Bio pesticides',
          slug: 'bio-pesticides',
          description: 'Eco-friendly entomopathogenic fungal biological pesticides targeting caterpillar pests, sucking insects, and root grubs.',
          image: 'https://images.unsplash.com/photo-1596742578443-7682ef5251cd?auto=format&fit=crop&w=800&q=80',
          status: 'Active',
        },
        {
          name: 'Bio insecticides',
          slug: 'bio-insecticides',
          description: 'Pure biological insecticides including Bacillus thuringiensis (Bt) and cold-pressed botanical neem formulations.',
          image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80',
          status: 'Active',
        },
        {
          name: 'Bio tonics',
          slug: 'bio-tonics',
          description: 'Concentrated humic acid, fulvic extracts, and marine Ascophyllum seaweed bio-stimulants for explosive canopy growth.',
          image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
          status: 'Active',
        },
        {
          name: 'Vermicompost',
          slug: 'vermicompost',
          description: 'High-grade 100% organic earthworm castings rich in microflora, humic substances, and vital plant macronutrients.',
          image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
          status: 'Active',
        },
        {
          name: 'Earth worms',
          slug: 'earth-worms',
          description: 'High-multiplication African nightcrawler (Eudrilus eugeniae) live mother cultures for establishing home and farm vermicompost units.',
          image: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=800&q=80',
          status: 'Active',
        },
        {
          name: 'Azolla',
          slug: 'azolla',
          description: 'Fresh organic Azolla pinnata mother culture. Rapid nitrogen bio-fixer, green manure for paddy fields, and high-protein cattle feed.',
          image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
          status: 'Active',
        },
      ];

      for (const cat of targetCategories) {
        const found = existingCats.find(c => c.name.toLowerCase() === cat.name.toLowerCase() || c.slug === cat.slug);
        if (!found) {
          await Category.create(cat);
        }
      }
      console.log('[Seed] 8 exact categories verified.');
    }

    // 3. Products
    const existingProducts = await Product.find({});
    const hasPaddySpecial = existingProducts.some(p => p.name.toLowerCase().includes('paddy special'));

    if (!hasPaddySpecial) {
      console.log('[Seed] Seeding Paddy Special and targeted 8-category products...');
      const allCats = await Category.find({});
      const getCatId = (name) => {
        const found = allCats.find(c => c.name.toLowerCase() === name.toLowerCase());
        return found ? (found._id || found.id) : '';
      };

      const requiredProducts = [
        {
          name: 'Paddy special - compo of 3 biofertilizer',
          slug: 'paddy-special-compo-of-3-biofertilizer',
          category: 'Biofertilizer',
          categoryId: getCatId('Biofertilizer'),
          price: 550,
          dosage: '1000 ml per acre',
          applicationMethod: 'Soil application by sowing',
          description: 'Paddy Special is an elite 3-in-1 composite biofertilizer scientifically engineered for rice fields. Combines high-potency nitrogen fixing Azospirillum, phosphate solubilizing bacteria (PSB), and potassium mobilizing bacteria (KMB) to fulfill complete organic N-P-K nutrition in a single application.',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
          images: [
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80'
          ],
          specifications: [
            { key: 'Product Type', value: '3-in-1 Composite Biofertilizer' },
            { key: 'Recommended Dosage', value: '1000 ml per acre' },
            { key: 'Retail Price', value: '₹550 per 1000 ml' },
            { key: 'Application Method', value: 'Soil application by sowing' },
            { key: 'Microbial Strains', value: 'Azospirillum + Phosphobacteria + Potash Bacteria' },
            { key: 'Viable Count', value: '1 x 10^9 CFU/ml min' }
          ],
          features: [
            'Composite 3-in-1 bio-fertilizer formulation for paddy cultivation',
            'Provides complete N P K biological nutrition to paddy plants',
            'Increases productive tillers and panicle density significantly',
            'Builds natural resistance against diseases, insects, and pest attacks',
            'Reduces synthetic chemical fertilizer dependency by 30-40%'
          ],
          benefits: [
            'Increases paddy grain yield by up to 50%',
            'Provides N P K fertilizer biologically directly to the plant root rhizosphere',
            'Accelerates vigorous tillering and heavy grain weight at harvest',
            'Enhances soil fertility and water-holding capacity across paddy seasons'
          ],
          status: 'Featured',
        },
        {
          name: 'SAB Trichoderma Viride (Biocontrol Agent)',
          slug: 'sab-trichoderma-viride-biocontrol-agent',
          category: 'Biocontrol agents',
          categoryId: getCatId('Biocontrol agents'),
          price: 350,
          dosage: '1000 ml / 1 kg per acre',
          applicationMethod: 'Seed treatment, soil drenching, or compost mix',
          description: 'A biological control agent active against root rot, collar rot, damping off, and Fusarium wilts. Triggers systemic acquired resistance in all crops.',
          image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80',
          images: ['https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80'],
          specifications: [
            { key: 'Organism', value: 'Trichoderma viride 1.5% W.P.' },
            { key: 'Spore Count', value: '2 x 10^6 CFU/g min' },
            { key: 'Price', value: '₹350' },
            { key: 'Dosage', value: '1000 ml / 1 kg per acre' }
          ],
          features: [
            'Natural antagonism against soil-borne fungal pathogens',
            'Protects banana, vegetable, pulse, and sugarcane crops from wilt',
            '100% residue free organic formulation'
          ],
          benefits: [
            'Prevents catastrophic crop loss from root and collar rot diseases',
            'Improves seedling survival rate during initial transplanting'
          ],
          status: 'Featured',
        },
        {
          name: 'SAB Beauveria Bassiana (Bio Pesticide)',
          slug: 'sab-beauveria-bassiana-bio-pesticide',
          category: 'Bio pesticides',
          categoryId: getCatId('Bio pesticides'),
          price: 420,
          dosage: '500 ml - 1000 ml per acre',
          applicationMethod: 'Foliar spray during evening hours',
          description: 'An entomopathogenic fungus that penetrates insect cuticles, eliminating harmful caterpillars, whiteflies, aphids, thrips, and beetles organically.',
          image: 'https://images.unsplash.com/photo-1596742578443-7682ef5251cd?auto=format&fit=crop&w=800&q=80',
          images: ['https://images.unsplash.com/photo-1596742578443-7682ef5251cd?auto=format&fit=crop&w=800&q=80'],
          specifications: [
            { key: 'Active Strain', value: 'Beauveria bassiana 1.15% WP' },
            { key: 'Target Pests', value: 'Bollworms, caterpillars, mealybugs, thrips' },
            { key: 'Price', value: '₹420' },
            { key: 'Dosage', value: '500 ml - 1000 ml per acre' }
          ],
          features: [
            'Zero chemical residue; harmless to predatory insects and honey bees',
            'Safe for organic vegetable and fruit orchards'
          ],
          benefits: [
            'Effective natural biological pest control without toxicity',
            'Prevents pesticide resistance development'
          ],
          status: 'Active',
        },
        {
          name: 'SAB Bacillus Thuringiensis (Bio Insecticide)',
          slug: 'sab-bacillus-thuringiensis-bio-insecticide',
          category: 'Bio insecticides',
          categoryId: getCatId('Bio insecticides'),
          price: 480,
          dosage: '2.5 ml per litre of water',
          applicationMethod: 'Foliar spray on leaf undersides',
          description: 'Specialized endotoxin-producing bio-insecticide highly toxic to lepidopteran larvae, diamondback moths, and pod borers.',
          image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80',
          images: ['https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80'],
          specifications: [
            { key: 'Active Ingredient', value: 'Bacillus thuringiensis var. kurstaki' },
            { key: 'Price', value: '₹480' },
            { key: 'Dosage', value: '2.5 ml per litre of water' }
          ],
          features: ['Selective action against targeted caterpillar pests', 'Safe for livestock and humans'],
          benefits: ['Quick cessation of leaf damage within 24 hours of spray'],
          status: 'Active',
        },
        {
          name: 'SAB Bio-Humic Seaweed Tonic (Bio Tonic)',
          slug: 'sab-bio-humic-seaweed-tonic',
          category: 'Bio tonics',
          categoryId: getCatId('Bio tonics'),
          price: 490,
          dosage: '2-3 ml per litre or 1000 ml per acre',
          applicationMethod: 'Drip irrigation or foliar spray',
          description: 'Pure blend of cold-extracted marine Ascophyllum seaweed and Potassium Humate 12%. Boosts chlorophyll, root elongation, and flower setting.',
          image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
          images: ['https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80'],
          specifications: [
            { key: 'Composition', value: 'Potassium Humate + Marine Seaweed Extract' },
            { key: 'Price', value: '₹490' },
            { key: 'Dosage', value: '1000 ml per acre' }
          ],
          features: ['100% water-soluble organic growth promoter', 'Prevents flower and fruit shedding under stress'],
          benefits: ['Explosive vegetative growth and higher grade fruit size'],
          status: 'Featured',
        },
        {
          name: 'SAB Enriched Organic Vermicompost (50 Kg)',
          slug: 'sab-enriched-organic-vermicompost-50-kg',
          category: 'Vermicompost',
          categoryId: getCatId('Vermicompost'),
          price: 450,
          dosage: '500 kg - 1 Ton per acre',
          applicationMethod: 'Basal soil dressing before planting',
          description: 'High-quality organic manure processed with African earthworms and enriched with Trichoderma and Azospirillum cultures.',
          image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
          images: ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'],
          specifications: [
            { key: 'Moisture Content', value: '20% max' },
            { key: 'Organic Carbon', value: '18% min' },
            { key: 'Packing', value: '50 Kg HDPE Bag' },
            { key: 'Price', value: '₹450 per 50 Kg bag' }
          ],
          features: ['Rich in microbial humus and earthworm castings', 'Improves aeration in clayey soil'],
          benefits: ['Retains vital soil moisture and unlocks dormant nutrients'],
          status: 'Featured',
        },
        {
          name: 'Live African Nightcrawler Earthworms (Eudrilus Eugeniae)',
          slug: 'live-african-nightcrawler-earthworms-eudrilus-eugeniae',
          category: 'Earth worms',
          categoryId: getCatId('Earth worms'),
          price: 400,
          dosage: '2 - 3 Kg per vermicompost bed (10x3 ft)',
          applicationMethod: 'Inoculation into moist organic compost bed',
          description: 'Live adult breeding earthworms with egg cocoons. Highly active composting species converting farm waste into premium vermicompost in 45 days.',
          image: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=800&q=80',
          images: ['https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=800&q=80'],
          specifications: [
            { key: 'Species', value: 'Eudrilus eugeniae (African Nightcrawler)' },
            { key: 'Packing', value: 'Ventilated live moisture pack' },
            { key: 'Price', value: '₹400 per Kg' }
          ],
          features: ['Rapid breeding rate with heavy biomass decomposition efficiency', 'Suitable for tropical South Indian climate'],
          benefits: ['Produces continuous organic vermicompost on your own farm'],
          status: 'Active',
        },
        {
          name: 'Fresh Organic Azolla Pinnata Culture (Mother Stock)',
          slug: 'fresh-organic-azolla-pinnata-culture-mother-stock',
          category: 'Azolla',
          categoryId: getCatId('Azolla'),
          price: 250,
          dosage: '1 - 2 Kg mother culture per pit (6x3 ft)',
          applicationMethod: 'Inoculate in shallow farm water beds',
          description: 'High-protein aquatic fern containing symbiotic Anabaena azollae. Outstanding green manure for paddy fields fixing 30-50 kg N/ha, and nutritious cattle/poultry feed.',
          image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
          images: ['https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80'],
          specifications: [
            { key: 'Species', value: 'Azolla pinnata' },
            { key: 'Protein Content', value: '25% - 30% crude protein' },
            { key: 'Price', value: '₹250 per Kg' }
          ],
          features: ['Multiplies double biomass in 3 to 5 days', 'Dual purpose: Bio-fertilizer & Livestock superfeed'],
          benefits: ['Increases dairy cattle milk yield and fat percentage naturally'],
          status: 'Featured',
        }
      ];

      for (const prod of requiredProducts) {
        await Product.create(prod);
      }
      console.log('[Seed] Paddy Special and category products seeded.');
    }

    // 4. Resource Person Programs & Events
    const programCount = await Program.countDocuments({});
    if (programCount === 0) {
      console.log('[Seed] Seeding resource person programs and institutional workshops...');
      const samplePrograms = [
        {
          title: 'Resource Person: Biofertilizer & Biocontrol Production Technologies',
          institution: 'College of Agricultural Technology & University Research Campus',
          topic: 'Industrial Mass Fermentation of Azospirillum, Trichoderma and Commercialization',
          date: '2026-02-14',
          image: '/uploads/program1.jpeg',
          images: ['/uploads/program1.jpeg', '/uploads/program2.jpeg'],
          description: 'Dr. R. Senthilkumar delivered an intensive hands-on resource lecture to B.Sc. and M.Sc. Agriculture students on setting up commercial biofertilizer units, microbial purity testing, and eco-friendly disease control.',
          category: 'Resource Person',
        },
        {
          title: 'Entrepreneurship Development Program: Mushroom & Vermicompost',
          institution: 'Arts and Science College, Thanjavur & Self-Help Group Training Hall',
          topic: 'Oyster Mushroom Cultivation, Spawn Production & Vermicompost Bed Setup',
          date: '2026-01-20',
          image: '/uploads/program2.jpeg',
          images: ['/uploads/program2.jpeg', '/uploads/program4.jpeg'],
          description: 'Vocational self-employment training program conducted for rural unemployed youth and self-help group women, covering low-cost mushroom huts, substrate sterilization, and vermiwash harvesting.',
          category: 'Entrepreneurship Training',
        },
        {
          title: 'Official MoU Signing Ceremony for Technical Sharing & Student Placements',
          institution: 'Autonomous University Department of Biotechnology & Agriculture',
          topic: 'Academic-Industry Partnership for Student Internships, Ph.D. Research & Placements',
          date: '2025-11-28',
          image: '/uploads/program3.jpeg',
          images: ['/uploads/program3.jpeg', '/uploads/program1.jpeg'],
          description: 'Sri Amman Biocare officially signed a formal Memorandum of Understanding (MoU) with leading university departments to offer student internships, project research assistance, and direct technical placement opportunities.',
          category: 'MoU Signing',
        },
        {
          title: 'B.Sc. Agriculture Students Industrial Visit & Hands-On Bio-Technology Training',
          institution: 'Department of Agricultural Sciences & Affiliated Colleges',
          topic: 'Commercial Mass Fermentation of Azospirillum, Trichoderma & Field Inoculation',
          date: '2026-03-05',
          image: '/uploads/visit1.jpeg',
          images: ['/uploads/visit1.jpeg', '/uploads/visit2.jpeg'],
          description: 'Over 65 undergraduate B.Sc. Agriculture students attended a comprehensive industrial visit at Sri Amman Biocare, observing large-scale liquid biofertilizer fermentation, quality testing, and field application.',
          category: 'Industrial Visit',
        },
        {
          title: 'College Faculty & Student Internship Delegation on Mushroom & Vermiculture',
          institution: 'Arts and Science College & Vocational Training Institute',
          topic: 'Oyster Mushroom Shed Preparation, Spawn Production & Live Earthworm Beds',
          date: '2026-02-18',
          image: '/uploads/visit2.jpeg',
          images: ['/uploads/visit2.jpeg', '/uploads/visit1.jpeg'],
          description: 'Intensive practical internship session conducted at Sri Amman Biocare research facility with live demonstration of African nightcrawler earthworm beds, vermiwash collection, and organic pest control.',
          category: 'College Workshop',
        },
        {
          title: 'Field Training & Hands-On Workshop: Spirulina & Azolla Cultivation',
          institution: 'SAB Bio-Research Center, Pudukkottai Main Road, Thirukkanurpatti',
          topic: 'Raceway Pond Management, Harvesting, Drying and Animal Feed Formulation',
          date: '2025-10-15',
          image: '/uploads/program4.jpeg',
          images: ['/uploads/program4.jpeg'],
          description: 'Field demonstration held at Sri Amman Biocare practical demo plots for agriculture college students demonstrating live Azolla multiplication pits and high-protein Spirulina drying techniques.',
          category: 'Field Visit',
        }
      ];

      for (const prog of samplePrograms) {
        await Program.create(prog);
      }
      console.log('[Seed] Programs seeded.');
    }

    console.log('[Seed] Database initialization verified with complete SAB data.');
  } catch (err) {
    console.error('[Seed] Error seeding database:', err.message);
  }
};
