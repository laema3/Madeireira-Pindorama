export interface Product {
  id: string;
  name: string;
  description: string;
  price?: string;
  category: string;
  subcategory?: string;
  image: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
}

export interface Testimonial {
  id: string;
  author: string;
  content: string;
  rating: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Project {
  id: string;
  title: string;
  location: string;
  image: string;
}

export interface SiteSettings {
  siteName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hoursWeek: string;
  hoursSat: string;
  instagram: string;
  facebook: string;
  pixelId: string;
  googleTag: string;
}