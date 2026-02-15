import { Product, Partner, Testimonial, Category, Project } from './types';

export const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=1920", // Wood logs
  "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1920", // Modern wood interior
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920", // Warehouse
  "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1920", // Woodwork
  "https://images.unsplash.com/photo-1520004434532-668416a08753?auto=format&fit=crop&q=80&w=1920"  // Finished timber
];

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Todos' },
  { id: 'bruto', name: 'Madeira Bruta' },
  { id: 'aparelhado', name: 'Madeira Aparelhada' },
  { id: 'decorativo', name: 'Acabamento e Decor' },
  { id: 'telhado', name: 'Estruturas e Telhados' }
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Viga de Angelim Pedra',
    description: 'Resistente e ideal para coberturas pesadas. Durabilidade garantida por décadas.',
    price: 'R$ 85,00/m',
    category: 'telhado',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    name: 'Prancha de Peroba Rosa',
    description: 'Relíquia da nossa tradição. Madeira nobre para móveis de alto padrão.',
    price: 'Sob Consulta',
    category: 'decorativo',
    image: 'https://images.unsplash.com/photo-1505798577917-a65157d4420e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    name: 'Ripão de Eucalipto Tratado',
    description: 'Econômico e sustentável. Ideal para cercas e estruturas leves.',
    price: 'R$ 12,00/m',
    category: 'bruto',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '4',
    name: 'Deck de Cumaru',
    description: 'Beleza natural para áreas externas. Resistência ao sol e chuva.',
    price: 'R$ 210,00/m²',
    category: 'decorativo',
    image: 'https://images.unsplash.com/photo-1590059345025-50e501d5df40?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '5',
    name: 'Tábua de Cedro Rosa',
    description: 'Fácil de trabalhar, aroma agradável e ótima para marcenaria fina.',
    price: 'R$ 65,00/m',
    category: 'aparelhado',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '6',
    name: 'Caibro de Garapeira',
    description: 'Cor clara e alta densidade. Excelente para telhados aparentes.',
    price: 'R$ 42,00/m',
    category: 'telhado',
    image: 'https://images.unsplash.com/photo-1565191999001-551c187427bb?auto=format&fit=crop&q=80&w=600'
  }
];

export const PARTNERS: Partner[] = [
  { id: '1', name: 'Montana Química', logo: 'https://cdn-icons-png.flaticon.com/512/1000/1000946.png' },
  { id: '2', name: 'Bosch Professional', logo: 'https://cdn-icons-png.flaticon.com/512/5969/5969046.png' },
  { id: '3', name: 'Dewalt Brasil', logo: 'https://cdn-icons-png.flaticon.com/512/5969/5969041.png' },
  { id: '4', name: 'Sayerlack', logo: 'https://cdn-icons-png.flaticon.com/512/1000/1000951.png' },
  { id: '5', name: 'Starrett', logo: 'https://cdn-icons-png.flaticon.com/512/1000/1000955.png' }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    author: 'Ricardo Mendes',
    content: 'Compro na Pindorama há 20 anos. O atendimento é exemplar e a qualidade da madeira é inigualável em Uberaba.',
    rating: 5
  },
  {
    id: '2',
    author: 'Eng. Ana Paula',
    content: 'Como engenheira, preciso de materiais com certificado de procedência. A Pindorama nunca me deixou na mão.',
    rating: 5
  },
  {
    id: '3',
    author: 'Móveis Design Uberaba',
    content: 'As melhores chapas e madeiras nobres da região. Parceria de longa data com muito sucesso.',
    rating: 4
  }
];

export const PROJECTS: Project[] = [
  { id: '1', title: 'Área Gourmet Rústica', location: 'Condomínio Flamboyant', image: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=800' },
  { id: '2', title: 'Pergolado em Deck', location: 'Residência Privativa', image: 'https://images.unsplash.com/photo-1590059345025-50e501d5df40?auto=format&fit=crop&q=80&w=800' },
  { id: '3', title: 'Cobertura Aparente', location: 'Sítio Uberaba', image: 'https://images.unsplash.com/photo-1565191999001-551c187427bb?auto=format&fit=crop&q=80&w=800' },
  { id: '4', title: 'Revestimento de Fachada', location: 'Centro Comercial', image: 'https://images.unsplash.com/photo-1510627489930-0c1b0ba3ff7a?auto=format&fit=crop&q=80&w=800' }
];