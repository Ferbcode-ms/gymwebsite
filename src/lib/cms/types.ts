export interface ServiceItem {
  id: string;
  num: string;
  title: string;
  category: string;
  description: string;
  image: string;
  order_index?: number;
}

export interface PricingPlan {
  id: string;
  title: string;
  description: string;
  monthly_price: string;
  yearly_price: string;
  period_note?: string;
  features: string[];
  plan_type: "standard" | "hyrox";
  order_index?: number;
}

export interface FeatureCardItem {
  id: string;
  title: string;
  image: string;
  alt?: string;
}

export interface SiteContent {
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    cta_primary: string;
    cta_secondary: string;
  };
  feature_cards?: FeatureCardItem[];
  editorial: {
    line1: string;
    line2: string;
    line3: string;
  };
  marquee: {
    text1: string;
    text2: string;
  };
  about: {
    headline: string;
    paragraph1: string;
    paragraph2: string;
    highlights: string[];
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    hours: string;
    facebook_url: string;
    instagram_url: string;
  };
}

export interface LeadItem {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
  status?: "new" | "contacted" | "archived";
}
