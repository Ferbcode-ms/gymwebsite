import { ServiceItem, PricingPlan, SiteContent, FeatureCardItem } from "./types";

export const DEFAULT_FEATURE_CARDS: FeatureCardItem[] = [
  {
    id: "coaches",
    title: "experienced coaches",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
    alt: "Experienced coaches at Apex Fitness guiding an athlete",
  },
  {
    id: "equipment",
    title: "best equipment",
    image:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
    alt: "State-of-the-art fitness equipment and weights at Apex Fitness",
  },
  {
    id: "coffee",
    title: "free coffee",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    alt: "Fresh coffee and athlete lounge at Apex Fitness",
  },
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "fitness",
    num: "01",
    title: "Fitness",
    category: "Full Gym Access",
    description:
      "Train independently or with expert guidance in our state-of-the-art gym equipped with premium cardio and strength machines.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    order_index: 1,
  },
  {
    id: "personal-training",
    num: "02",
    title: "Personal Training",
    category: "1-on-1 Coaching",
    description:
      "1-on-1 coaching customized to your individual goals, movement mechanics, and lifestyle for lasting, measurable results.",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    order_index: 2,
  },
  {
    id: "group-classes",
    num: "03",
    title: "Group Classes",
    category: "High Energy Workouts",
    description:
      "High-energy, motivating group sessions led by passionate coaches designed to challenge and elevate you together.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    order_index: 3,
  },
  {
    id: "hyrox",
    num: "04",
    title: "Hyrox & Conditioning",
    category: "Official Affiliate",
    description:
      "The premier competition format merging functional strength and endurance. Train in small cohorts with certified coaches.",
    image:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80",
    order_index: 4,
  },
];

export const DEFAULT_PRICING: PricingPlan[] = [
  {
    id: "individual",
    title: "Individual",
    description:
      "The premier membership to get the absolute most out of your fitness lifestyle. Go all-out with expert, friendly guidance. We're here for you every single day in the gym.",
    monthly_price: "$49",
    yearly_price: "$39",
    period_note: "* Billed monthly or annually",
    plan_type: "standard",
    features: [
      "Unlimited 24/7 gym access",
      "Complimentary coaching assessment",
      "Free access to group training & classes",
      "Custom workout program tracking",
      "Full locker room & sauna access",
    ],
    order_index: 1,
  },
  {
    id: "family",
    title: "Family",
    description:
      "Join together with family members living at the same address and receive an exclusive family discount. Multi-member pass with complete privileges.",
    monthly_price: "$44",
    yearly_price: "$35",
    period_note: "* Per member with family plan",
    plan_type: "standard",
    features: [
      "Unlimited gym & facility access",
      "Personal fitness consultations",
      "Free group classes for all members",
      "Custom workout programming",
      "Shared family portal discounts",
    ],
    order_index: 2,
  },
  {
    id: "student",
    title: "Student",
    description:
      "Studying hard and looking to de-stress with a high-intensity workout? We have an exclusive student membership designed with full privileges at reduced rates.",
    monthly_price: "$39",
    yearly_price: "$29",
    period_note: "* Valid student ID required",
    plan_type: "standard",
    features: [
      "Unlimited gym access",
      "Personal form checks & guidance",
      "Free access to all group classes",
      "Custom fitness plan via app",
      "Discounted student pricing",
    ],
    order_index: 3,
  },
  {
    id: "hyrox-basic",
    title: "Hyrox Basic",
    description:
      "Train in small cohorts alongside certified functional fitness coaches and challenge yourself to reach peak endurance and strength.",
    monthly_price: "$59",
    yearly_price: "$49",
    period_note: "* Billed monthly",
    plan_type: "hyrox",
    features: [
      "5x per month access to group training",
      "Certified functional fitness coaching",
      "Vibrant athletic community",
      "Quarterly benchmark testing",
    ],
    order_index: 4,
  },
  {
    id: "hyrox-premium",
    title: "Hyrox Premium",
    description:
      "Dedicated competition preparation and intensive functional strength training with unlimited small-group sessions.",
    monthly_price: "$79",
    yearly_price: "$69",
    period_note: "* Billed monthly",
    plan_type: "hyrox",
    features: [
      "Unlimited access to specialized training",
      "1-on-1 technique & pacing reviews",
      "Official simulation events",
      "Nutrition & recovery guidelines",
    ],
    order_index: 5,
  },
];

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    badge: "Official Athletic Training Club",
    headline: "TRAIN TODAY. GROW TOMORROW.",
    subheadline:
      "Experience premium equipment, expert coaching, and a vibrant community dedicated to taking your athletic potential to the next level.",
    cta_primary: "Free Trial Session",
    cta_secondary: "View Programs",
  },
  feature_cards: DEFAULT_FEATURE_CARDS,
  editorial: {
    line1: "Your couch is very",
    line2: "tastier if you add it",
    line3: "exhausted lies",
  },
  marquee: {
    text1: "START FAST. FINISH FASTER.",
    text2: "WANT TO KNOW MORE?",
  },
  about: {
    headline: "Apex Fitness",
    paragraph1:
      "At Apex Fitness, we believe in the power of an active and healthy lifestyle. Our modern facility and dedicated trainers are here to help you achieve your personal fitness goals, whether you are taking your first steps or are a seasoned athlete.",
    paragraph2:
      "That is why we move beyond the generic talk of weight loss, muscle gain, and basic conditioning. Feeling stronger, happier, more resilient, and truly energized. Yes, that is within your reach. But you have to put in the work. Great results don't happen by chance.",
    highlights: [
      "High-end fitness equipment",
      "Experienced coaches",
      "Unlimited workouts",
      "Extensive opening hours",
      "Diverse group classes",
      "Personal training & coaching",
      "Vibrant community",
    ],
  },
  contact: {
    phone: "+1 (555) 234-5678",
    email: "info@apexfitness.com",
    address: "100 Athletic Way, Suite 400",
    hours: "Mon - Fri: 06:00 - 23:00 | Sat - Sun: 08:00 - 18:00",
    facebook_url: "https://facebook.com",
    instagram_url: "https://instagram.com",
  },
};
