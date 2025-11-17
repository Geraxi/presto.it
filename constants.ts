

import type { User, Ad, Language, CategoryKey, Store } from './types';

export const PLACEHOLDER_IMG = '/images/placeholder.svg';
const placeholderPath = PLACEHOLDER_IMG;

// Automatic filename detection based on ad title
export const guessImageFromTitle = (title: string): string | null => {
  const t = title.toLowerCase();
  
  // Electronics
  if (t.includes('iphone')) return '/images/iphone-15-pro.png';
  if (t.includes('macbook') || t.includes('laptop') || t.includes('computer')) return '/images/iphone-15-pro.png';
  if (t.includes('ipad') || t.includes('tablet')) return '/images/iphone-15-pro.png';
  if (t.includes('cuffie') || t.includes('headphone') || t.includes('auricular')) return '/images/iphone-15-pro.png';
  
  // Furniture
  if (t.includes('divano') || t.includes('sofa')) return '/images/vintage-sofa.png';
  if (t.includes('tavolo') || t.includes('table') || t.includes('mesa')) return '/images/vintage-sofa.png';
  if (t.includes('sedia') || t.includes('chair') || t.includes('silla')) return '/images/vintage-sofa.png';
  if (t.includes('libreria') || t.includes('bookshelf') || t.includes('estantería')) return '/images/vintage-sofa.png';
  
  // Motors
  if (t.includes('fiat')) return '/images/fiat500.png';
  if (t.includes('vespa') || t.includes('scooter') || t.includes('moto')) return '/images/fiat500.png';
  if (t.includes('bicicletta') || t.includes('bike') || t.includes('bici') || t.includes('bicicleta')) return '/images/fiat500.png';
  if (t.includes('e-bike') || t.includes('elettrica') || t.includes('eléctrica')) return '/images/fiat500.png';
  
  // Collectibles
  if (t.includes('dragon')) return '/images/dragonball.png';
  if (t.includes('funko') || t.includes('action figure') || t.includes('figura')) return '/images/dragonball.png';
  if (t.includes('rolex') || t.includes('orologio') || t.includes('watch') || t.includes('reloj')) return '/images/dragonball.png';
  if (t.includes('moneta') || t.includes('coin') || t.includes('moneda')) return '/images/dragonball.png';
  
  // Sports
  if (t.includes('tapis')) return '/images/tapisroulant.png';
  if (t.includes('golf') || t.includes('mazze') || t.includes('clubs')) return '/images/tapisroulant.png';
  if (t.includes('pesi') || t.includes('weight') || t.includes('pesa') || t.includes('bilanciere') || t.includes('barbell')) return '/images/tapisroulant.png';
  
  // Books
  if (t.includes('harry') || t.includes('potter')) return '/images/Harrypotter.png';
  if (t.includes('enciclopedia') || t.includes('encyclopedia') || t.includes('enciclopedia')) return '/images/Harrypotter.png';
  if (t.includes('riviste') || t.includes('magazine') || t.includes('revista') || t.includes('national geographic')) return '/images/Harrypotter.png';
  if (t.includes('libri') || t.includes('book') || t.includes('libro') || t.includes('cucina') || t.includes('cookbook')) return '/images/Harrypotter.png';
  
  // Music & Movies
  if (t.includes('vinile') || t.includes('dark') || t.includes('floyd') || t.includes('vinyl')) return '/images/darkside.png';
  if (t.includes('giradischi') || t.includes('turntable') || t.includes('tocadiscos')) return '/images/darkside.png';
  if (t.includes('cd') || t.includes('collection') || t.includes('colección')) return '/images/darkside.png';
  if (t.includes('blu-ray') || t.includes('bluray') || t.includes('film') || t.includes('movie') || t.includes('película')) return '/images/darkside.png';
  
  // Jobs
  if (t.includes('sviluppatore') || t.includes('developer') || t.includes('web') || t.includes('desarrollador')) return '/images/web-developer.png';
  if (t.includes('designer') || t.includes('graphic') || t.includes('diseñador')) return '/images/web-developer.png';
  if (t.includes('marketing') || t.includes('manager') || t.includes('gerente')) return '/images/web-developer.png';
  if (t.includes('chef') || t.includes('cucina') || t.includes('ristorante') || t.includes('restaurant') || t.includes('restaurante')) return '/images/web-developer.png';
  if (t.includes('lavoro') || t.includes('job') || t.includes('trabajo') || t.includes('offerta') || t.includes('offer') || t.includes('oferta')) return '/images/web-developer.png';
  
  // Clothing - use electronics as placeholder (we don't have clothing images)
  if (t.includes('cappotto') || t.includes('coat') || t.includes('abrigo') || t.includes('north face')) return '/images/iphone-15-pro.png';
  if (t.includes('scarpe') || t.includes('shoe') || t.includes('zapatilla') || t.includes('nike')) return '/images/iphone-15-pro.png';
  if (t.includes('borsa') || t.includes('bag') || t.includes('bolso') || t.includes('gucci')) return '/images/iphone-15-pro.png';
  if (t.includes('giacca') || t.includes('jacket') || t.includes('chaqueta') || t.includes('levi')) return '/images/iphone-15-pro.png';
  
  // Real Estate - use furniture as placeholder
  if (t.includes('appartamento') || t.includes('apartment') || t.includes('apartamento') || t.includes('monolocale') || t.includes('studio')) return '/images/vintage-sofa.png';
  if (t.includes('villa') || t.includes('giardino') || t.includes('garden') || t.includes('jardín')) return '/images/vintage-sofa.png';
  if (t.includes('ufficio') || t.includes('office') || t.includes('oficina') || t.includes('immobili') || t.includes('real estate') || t.includes('inmobiliaria')) return '/images/vintage-sofa.png';

  return null;
};


// Helper to ensure ad has valid image path
export const ensureAdImage = (ad: Ad): Ad => {
  if (!ad) {
    console.error('ensureAdImage called with null/undefined ad');
    return ad;
  }
  // Get translated title
  const title = ad.title?.it || ad.title?.en || ad.title || '';
  const translatedTitle = typeof title === 'string' ? title : (title.it || title.en || '');
  
  // Check if images[0] is valid (not null, undefined, empty, or placeholder)
  // Also check if it's a base64 data URL (starts with 'data:')
  const isValidImage = (img: string | undefined | null): boolean => {
    if (!img || typeof img !== 'string') return false;
    const trimmed = img.trim();
    if (trimmed === '') return false;
    // Base64 data URLs are always valid
    if (trimmed.startsWith('data:')) return true;
    // HTTP/HTTPS URLs are valid
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return true;
    // Check if it's a placeholder
    if (trimmed === PLACEHOLDER_IMG || trimmed === placeholderPath || trimmed.includes('placeholder')) return false;
    return true;
  };
  
  // If images[0] is missing or invalid, try to guess from title
  // BUT: Don't overwrite base64 data URLs or HTTP URLs
  const currentImage = ad.images && ad.images[0];
  if (!currentImage || !isValidImage(currentImage)) {
    const guessed = guessImageFromTitle(translatedTitle);
    if (guessed) {
      ad.images = [guessed];
    } else {
      ad.images = [PLACEHOLDER_IMG];
    }
  }
  
  // Normalize image path to /images/ format
  // BUT: Skip normalization for base64 data URLs and HTTP/HTTPS URLs
  if (ad.images && ad.images[0]) {
    let imgPath = ad.images[0];
    
    // Don't normalize base64 data URLs or HTTP/HTTPS URLs - keep them as-is
    if (!imgPath.startsWith('data:') && !imgPath.startsWith('http://') && !imgPath.startsWith('https://')) {
      if (imgPath.startsWith('/public/')) {
        imgPath = imgPath.replace('/public/', '/');
      }
      if (!imgPath.startsWith('/images/')) {
        const filename = imgPath.split('/').pop();
        imgPath = `/images/${filename}`;
      }
      ad.images[0] = imgPath;
    }
    // If it's a data URL or HTTP URL, keep it as-is (no modification needed)
  }
  
  // Handle watermarkedImages - only use if valid, otherwise use images[0]
  if (ad.watermarkedImages && ad.watermarkedImages[0]) {
    if (!isValidImage(ad.watermarkedImages[0])) {
      ad.watermarkedImages = ad.images;
    } else {
      // Normalize watermarked image path
      // BUT: Skip normalization for base64 data URLs and HTTP/HTTPS URLs
      let wmPath = ad.watermarkedImages[0];
      
      // Don't normalize base64 data URLs or HTTP/HTTPS URLs
      if (!wmPath.startsWith('data:') && !wmPath.startsWith('http://') && !wmPath.startsWith('https://')) {
        if (wmPath.startsWith('/public/')) {
          wmPath = wmPath.replace('/public/', '/');
        }
        if (!wmPath.startsWith('/images/')) {
          const filename = wmPath.split('/').pop();
          wmPath = `/images/${filename}`;
        }
        ad.watermarkedImages[0] = wmPath;
      }
      // If it's a data URL or HTTP URL, keep it as-is
    }
  } else {
    ad.watermarkedImages = ad.images;
  }
  
  return ad;
};

export const USERS: User[] = [
  { id: 1, name: 'Linda', email: 'linda@example.com', isRevisor: false, password: 'password', storeId: 1 },
  { id: 2, name: 'Pino', email: 'pino@example.com', isRevisor: false, password: 'password', storeId: 2 },
  { id: 3, name: 'Pablo', email: 'pablo@example.com', isRevisor: true, password: 'password' },
  { id: 4, name: 'Arnold', email: 'arnold@example.com', isRevisor: false, password: 'password' },
  { id: 5, name: 'Guohua', email: 'guohua@example.com', isRevisor: false, password: 'password' },
];

export const STORES: Store[] = [
    { id: 1, name: "Linda's Luxuries", description: "High-quality vintage furniture and decor that brings elegance to any home.", logo: placeholderPath, ownerId: 1 },
    { id: 2, name: "Pino's Tech Hub", description: "The latest and greatest in personal electronics, gadgets, and accessories.", logo: placeholderPath, ownerId: 2 },
];

export const CATEGORY_KEYS: CategoryKey[] = [
  'electronics',
  'furniture',
  'clothing',
  'motors',
  'books_magazines',
  'sports',
  'real_estate',
  'collectibles',
  'music_movies',
  'jobs',
];

export const CATEGORIES: Record<CategoryKey, Record<Language['code'], string>> = {
  electronics: { it: 'Elettronica', en: 'Electronics', es: 'Electrónica' },
  furniture: { it: 'Arredamento', en: 'Furniture', es: 'Muebles' },
  clothing: { it: 'Abbigliamento', en: 'Clothing', es: 'Ropa' },
  motors: { it: 'Motori', en: 'Motors', es: 'Motores' },
  books_magazines: { it: 'Libri e Riviste', en: 'Books & Magazines', es: 'Libros y Revistas' },
  sports: { it: 'Sport', en: 'Sports', es: 'Deportes' },
  real_estate: { it: 'Immobili', en: 'Real Estate', es: 'Inmobiliaria' },
  collectibles: { it: 'Collezionismo', en: 'Collectibles', es: 'Coleccionismo' },
  music_movies: { it: 'Musica e Film', en: 'Music & Movies', es: 'Música y Películas' },
  jobs: { it: 'Lavoro', en: 'Jobs', es: 'Trabajo' },
};

export const INITIAL_ADS: Ad[] = [
  {
    id: 1,
    title: {
        it: 'iPhone 15 Pro',
        en: 'iPhone 15 Pro',
        es: 'iPhone 15 Pro'
    },
    description: {
        it: 'Come nuovo, usato pochissimo. Colore titanio naturale.',
        en: 'Like new, barely used. Natural titanium color.',
        es: 'Como nuevo, muy poco uso. Color titanio natural.'
    },
    price: 950,
    category: 'electronics',
    userId: 2,
    status: 'approved',
    images: ['/images/iphone-15-pro.png'],
    watermarkedImages: ['/images/iphone-15-pro.png'],
  },
  {
    id: 2,
    title: {
        it: 'Divano in pelle vintage',
        en: 'Vintage leather sofa',
        es: 'Sofá de cuero vintage'
    },
    description: {
        it: 'Bellissimo divano chesterfield, perfetto per un salotto di design. Vendo per cambio arredamento.',
        en: 'Beautiful Chesterfield sofa, perfect for a designer living room. Selling due to redecorating.',
        es: 'Hermoso sofá Chesterfield, perfecto para una sala de estar de diseño. Vendo por cambio de decoración.'
    },
    price: 1200,
    category: 'furniture',
    userId: 1,
    status: 'approved',
    images: ['/images/vintage-sofa.png'],
     watermarkedImages: ['/images/vintage-sofa.png'],
  },
  {
    id: 3,
    title: {
        it: 'Giacca di jeans Levi\'s',
        en: 'Levi\'s denim jacket',
        es: 'Chaqueta vaquera Levi\'s'
    },
    description: {
        it: 'Taglia M, modello trucker. Un classico intramontabile.',
        en: 'Size M, trucker model. A timeless classic.',
        es: 'Talla M, modelo trucker. Un clásico atemporal.'
    },
    price: 45,
    category: 'clothing',
    userId: 4,
    status: 'pending',
    images: [placeholderPath],
  },
    {
    id: 4,
    title: {
        it: 'Fiat 500 Elettrica',
        en: 'Electric Fiat 500',
        es: 'Fiat 500 Eléctrico'
    },
    description: {
        it: 'Modello Icon, 300km di autonomia, perfetta per la città.',
        en: 'Icon model, 300km range, perfect for the city.',
        es: 'Modelo Icon, 300km de autonomía, perfecto para la ciudad.'
    },
    price: 22000,
    category: 'motors',
    userId: 1,
    status: 'approved',
    images: ['/images/fiat500.png'],
     watermarkedImages: ['/images/fiat500.png'],
  },
  {
    id: 5,
    title: { it: 'Collezione Manga Dragon Ball', en: 'Dragon Ball Manga Collection', es: 'Colección Manga Dragon Ball' },
    description: { it: 'Serie completa di Dragon Ball, prima edizione. Condizioni da collezionista.', en: 'Complete Dragon Ball series, first edition. Collector\'s condition.', es: 'Serie completa de Dragon Ball, primera edición. Estado de coleccionista.' },
    price: 300,
    category: 'collectibles',
    userId: 5,
    status: 'approved',
    images: ['/images/dragonball.png'],
    watermarkedImages: ['/images/dragonball.png'],
  },
  {
    id: 6,
    title: { it: 'Tapis Roulant Technogym', en: 'Technogym Treadmill', es: 'Cinta de correr Technogym' },
    description: { it: 'Professionale, usato in palestra. Perfettamente funzionante.', en: 'Professional, used in a gym. Perfectly functional.', es: 'Profesional, usada en gimnasio. Perfectamente funcional.' },
    price: 1500,
    category: 'sports',
    userId: 4,
    status: 'approved',
    images: ['/images/tapisroulant.png'],
    watermarkedImages: ['/images/tapisroulant.png'],
  },
  {
    id: 7,
    title: { it: 'Offerta Sviluppatore Web', en: 'Web Developer Offer', es: 'Oferta Desarrollador Web' },
    description: { it: 'Cercasi sviluppatore frontend con 3+ anni di esperienza in React. Lavoro da remoto.', en: 'Seeking a frontend developer with 3+ years of experience in React. Remote work.', es: 'Se busca desarrollador frontend con más de 3 años de experiencia en React. Trabajo remoto.' },
    price: 1300,
    category: 'jobs',
    userId: 2,
    status: 'approved',
    images: ['/images/web-developer.png'],
    watermarkedImages: ['/images/web-developer.png'],
  },
  {
    id: 8,
    title: { it: 'Monolocale in centro', en: 'Studio apartment in the center', es: 'Estudio en el centro' },
    description: { it: 'Affittasi monolocale arredato, zona servita dai mezzi. Solo referenziati.', en: 'Furnished studio for rent, area served by public transport. Only referenced people.', es: 'Se alquila estudio amueblado, zona con transporte público. Solo personas con referencias.' },
    price: 700,
    category: 'real_estate',
    userId: 1,
    status: 'pending',
    images: [placeholderPath],
  },
  {
    id: 9,
    title: { it: 'Vinile "The Dark Side of the Moon"', en: 'Vinyl "The Dark Side of the Moon"', es: 'Vinilo "The Dark Side of the Moon"' },
    description: { it: 'Stampa originale del 1973 dei Pink Floyd. In ottime condizioni.', en: 'Original 1973 Pink Floyd pressing. In excellent condition.', es: 'Prensado original de 1973 de Pink Floyd. En excelente estado.' },
    price: 150,
    category: 'music_movies',
    userId: 5,
    status: 'approved',
    images: ['/images/darkside.png'],
    watermarkedImages: ['/images/darkside.png'],
  },
  {
    id: 10,
    title: { it: 'Set completo Harry Potter', en: 'Complete Harry Potter Set', es: 'Set completo de Harry Potter' },
    description: { it: 'Tutti e 7 i libri della saga, edizione Salani. Come nuovi.', en: 'All 7 books of the saga, Salani edition. Like new.', es: 'Los 7 libros de la saga, edición Salani. Como nuevos.' },
    price: 80,
    category: 'books_magazines',
    userId: 1,
    status: 'approved',
    images: ['/images/Harrypotter.png'],
    watermarkedImages: ['/images/Harrypotter.png'],
  },
  // Additional Electronics
  {
    id: 11,
    title: { it: 'MacBook Pro M2 14"', en: 'MacBook Pro M2 14"', es: 'MacBook Pro M2 14"' },
    description: { it: 'MacBook Pro con chip M2, 16GB RAM, 512GB SSD. In perfette condizioni, ancora in garanzia.', en: 'MacBook Pro with M2 chip, 16GB RAM, 512GB SSD. In perfect condition, still under warranty.', es: 'MacBook Pro con chip M2, 16GB RAM, 512GB SSD. En perfecto estado, aún en garantía.' },
    price: 1800,
    category: 'electronics',
    userId: 2,
    status: 'approved',
    images: ['https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 12,
    title: { it: 'Sony WH-1000XM5 Cuffie', en: 'Sony WH-1000XM5 Headphones', es: 'Auriculares Sony WH-1000XM5' },
    description: { it: 'Cuffie wireless con cancellazione attiva del rumore. Usate pochissimo, come nuove.', en: 'Wireless headphones with active noise cancellation. Barely used, like new.', es: 'Auriculares inalámbricos con cancelación activa de ruido. Muy poco uso, como nuevos.' },
    price: 280,
    category: 'electronics',
    userId: 4,
    status: 'approved',
    images: ['https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 13,
    title: { it: 'iPad Air 5a Generazione', en: 'iPad Air 5th Generation', es: 'iPad Air 5ta Generación' },
    description: { it: 'iPad Air 64GB, Wi-Fi, colore rosa. Con custodia e Apple Pencil incluso.', en: 'iPad Air 64GB, Wi-Fi, pink color. With case and Apple Pencil included.', es: 'iPad Air 64GB, Wi-Fi, color rosa. Con funda y Apple Pencil incluidos.' },
    price: 550,
    category: 'electronics',
    userId: 1,
    status: 'pending',
    images: ['https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  // Additional Furniture
  {
    id: 14,
    title: { it: 'Tavolo da pranzo in legno massello', en: 'Solid wood dining table', es: 'Mesa de comedor de madera maciza' },
    description: { it: 'Tavolo rettangolare per 6 persone, in rovere. Dimensioni 200x100cm. Ottime condizioni.', en: 'Rectangular table for 6 people, in oak. Dimensions 200x100cm. Excellent condition.', es: 'Mesa rectangular para 6 personas, en roble. Dimensiones 200x100cm. Excelente estado.' },
    price: 450,
    category: 'furniture',
    userId: 1,
    status: 'approved',
    images: ['https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 15,
    title: { it: 'Sedia ergonomica da ufficio', en: 'Ergonomic office chair', es: 'Silla ergonómica de oficina' },
    description: { it: 'Sedia ergonomica con supporto lombare, braccioli regolabili. Colore nero.', en: 'Ergonomic chair with lumbar support, adjustable armrests. Black color.', es: 'Silla ergonómica con soporte lumbar, reposabrazos ajustables. Color negro.' },
    price: 180,
    category: 'furniture',
    userId: 2,
    status: 'approved',
    images: ['https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 16,
    title: { it: 'Libreria a muro moderna', en: 'Modern wall bookshelf', es: 'Estantería de pared moderna' },
    description: { it: 'Libreria sospesa in metallo e legno, 5 ripiani. Design moderno e minimalista.', en: 'Suspended bookshelf in metal and wood, 5 shelves. Modern and minimalist design.', es: 'Estantería suspendida en metal y madera, 5 estantes. Diseño moderno y minimalista.' },
    price: 220,
    category: 'furniture',
    userId: 4,
    status: 'pending',
    images: ['https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  // Additional Clothing
  {
    id: 17,
    title: { it: 'Cappotto invernale The North Face', en: 'The North Face winter coat', es: 'Abrigo de invierno The North Face' },
    description: { it: 'Cappotto impermeabile taglia L, colore nero. Perfetto per montagna e città.', en: 'Waterproof coat size L, black color. Perfect for mountain and city.', es: 'Abrigo impermeable talla L, color negro. Perfecto para montaña y ciudad.' },
    price: 120,
    category: 'clothing',
    userId: 4,
    status: 'approved',
    images: ['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 18,
    title: { it: 'Scarpe Nike Air Max 270', en: 'Nike Air Max 270 Shoes', es: 'Zapatillas Nike Air Max 270' },
    description: { it: 'Taglia 42, colore bianco e nero. Usate poche volte, ottime condizioni.', en: 'Size 42, white and black color. Worn a few times, excellent condition.', es: 'Talla 42, color blanco y negro. Usadas pocas veces, excelente estado.' },
    price: 85,
    category: 'clothing',
    userId: 5,
    status: 'approved',
    images: ['https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 19,
    title: { it: 'Borsa Gucci vintage', en: 'Vintage Gucci bag', es: 'Bolso Gucci vintage' },
    description: { it: 'Borsa a tracolla autentica degli anni 90. Colore marrone, ottime condizioni.', en: 'Authentic crossbody bag from the 90s. Brown color, excellent condition.', es: 'Bolso bandolera auténtico de los años 90. Color marrón, excelente estado.' },
    price: 450,
    category: 'clothing',
    userId: 1,
    status: 'pending',
    images: ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  // Additional Motors
  {
    id: 20,
    title: { it: 'Vespa 125 Primavera', en: 'Vespa 125 Primavera', es: 'Vespa 125 Primavera' },
    description: { it: 'Vespa 2018, 15.000 km, revisionata. Colore bianco, perfette condizioni.', en: 'Vespa 2018, 15,000 km, serviced. White color, perfect condition.', es: 'Vespa 2018, 15.000 km, revisada. Color blanco, perfecto estado.' },
    price: 3200,
    category: 'motors',
    userId: 1,
    status: 'approved',
    images: ['https://images.pexels.com/photos/163236/luxury-car-speed-vehicle-163236.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 21,
    title: { it: 'Bicicletta elettrica E-Bike', en: 'Electric bike E-Bike', es: 'Bicicleta eléctrica E-Bike' },
    description: { it: 'Bici elettrica con batteria 500Wh, autonomia 80km. Modello 2023, poco usata.', en: 'Electric bike with 500Wh battery, 80km range. 2023 model, barely used.', es: 'Bicicleta eléctrica con batería 500Wh, autonomía 80km. Modelo 2023, poco usada.' },
    price: 1200,
    category: 'motors',
    userId: 2,
    status: 'approved',
    images: ['https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 22,
    title: { it: 'Scooter Yamaha NMAX 155', en: 'Yamaha NMAX 155 Scooter', es: 'Scooter Yamaha NMAX 155' },
    description: { it: 'Scooter 2022, 8.000 km, sempre in garage. Colore blu, perfette condizioni.', en: 'Scooter 2022, 8,000 km, always in garage. Blue color, perfect condition.', es: 'Scooter 2022, 8.000 km, siempre en garaje. Color azul, perfecto estado.' },
    price: 2800,
    category: 'motors',
    userId: 4,
    status: 'pending',
    images: ['https://images.pexels.com/photos/163236/luxury-car-speed-vehicle-163236.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  // Additional Sports
  {
    id: 23,
    title: { it: 'Set completo da golf', en: 'Complete golf set', es: 'Set completo de golf' },
    description: { it: 'Mazze da golf, borsa e accessori. Marca Callaway, ottime condizioni.', en: 'Golf clubs, bag and accessories. Callaway brand, excellent condition.', es: 'Palos de golf, bolsa y accesorios. Marca Callaway, excelente estado.' },
    price: 350,
    category: 'sports',
    userId: 5,
    status: 'approved',
    images: ['https://images.pexels.com/photos/163140/athlete-golf-sport-golfer-163140.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 24,
    title: { it: 'Bicicletta da corsa Specialized', en: 'Specialized racing bike', es: 'Bicicleta de carreras Specialized' },
    description: { it: 'Bici da corsa carbonio, taglia 54. Componenti Shimano 105, ottime condizioni.', en: 'Carbon racing bike, size 54. Shimano 105 components, excellent condition.', es: 'Bicicleta de carreras de carbono, talla 54. Componentes Shimano 105, excelente estado.' },
    price: 1800,
    category: 'sports',
    userId: 2,
    status: 'approved',
    images: ['https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 25,
    title: { it: 'Pesi e bilanciere per palestra', en: 'Weights and barbell for gym', es: 'Pesas y barra para gimnasio' },
    description: { it: 'Set completo pesi da 2kg a 20kg, bilanciere olimpico. Perfetto per home gym.', en: 'Complete set of weights from 2kg to 20kg, Olympic barbell. Perfect for home gym.', es: 'Set completo de pesas de 2kg a 20kg, barra olímpica. Perfecto para gimnasio en casa.' },
    price: 280,
    category: 'sports',
    userId: 4,
    status: 'pending',
    images: ['https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  // Additional Real Estate
  {
    id: 26,
    title: { it: 'Appartamento 2 camere zona universitaria', en: '2 bedroom apartment university area', es: 'Apartamento 2 habitaciones zona universitaria' },
    description: { it: 'Appartamento luminoso, 70mq, zona servita. Ideale per studenti o giovani coppie.', en: 'Bright apartment, 70sqm, well-served area. Ideal for students or young couples.', es: 'Apartamento luminoso, 70m², zona bien comunicada. Ideal para estudiantes o parejas jóvenes.' },
    price: 850,
    category: 'real_estate',
    userId: 1,
    status: 'approved',
    images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 27,
    title: { it: 'Villa con giardino in periferia', en: 'Villa with garden in suburbs', es: 'Villa con jardín en las afueras' },
    description: { it: 'Villa indipendente, 150mq, 3 camere, giardino 200mq. Zona tranquilla e residenziale.', en: 'Independent villa, 150sqm, 3 bedrooms, 200sqm garden. Quiet and residential area.', es: 'Villa independiente, 150m², 3 habitaciones, jardín 200m². Zona tranquila y residencial.' },
    price: 1800,
    category: 'real_estate',
    userId: 2,
    status: 'pending',
    images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 28,
    title: { it: 'Ufficio in centro città', en: 'Office in city center', es: 'Oficina en el centro de la ciudad' },
    description: { it: 'Ufficio 40mq, zona centrale, perfetto per professionisti. Affitto mensile.', en: '40sqm office, central area, perfect for professionals. Monthly rent.', es: 'Oficina 40m², zona central, perfecta para profesionales. Alquiler mensual.' },
    price: 1200,
    category: 'real_estate',
    userId: 4,
    status: 'approved',
    images: ['https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  // Additional Collectibles
  {
    id: 29,
    title: { it: 'Action Figure Funko Pop rari', en: 'Rare Funko Pop action figures', es: 'Figuras Funko Pop raras' },
    description: { it: 'Collezione di 15 Funko Pop rari, alcuni ancora sigillati. Serie limitate.', en: 'Collection of 15 rare Funko Pops, some still sealed. Limited series.', es: 'Colección de 15 Funko Pops raros, algunos aún sellados. Series limitadas.' },
    price: 450,
    category: 'collectibles',
    userId: 5,
    status: 'approved',
    images: ['https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 30,
    title: { it: 'Moneta d\'oro antica', en: 'Ancient gold coin', es: 'Moneda de oro antigua' },
    description: { it: 'Moneta d\'oro del 1800, autenticata. Perfetta per collezionisti numismatici.', en: 'Gold coin from 1800, authenticated. Perfect for numismatic collectors.', es: 'Moneda de oro del 1800, autenticada. Perfecta para coleccionistas numismáticos.' },
    price: 850,
    category: 'collectibles',
    userId: 1,
    status: 'pending',
    images: ['https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 31,
    title: { it: 'Vintage Rolex Submariner', en: 'Vintage Rolex Submariner', es: 'Rolex Submariner vintage' },
    description: { it: 'Orologio Rolex Submariner anni 80, autentico, con scatola e certificati.', en: 'Rolex Submariner watch from the 80s, authentic, with box and certificates.', es: 'Reloj Rolex Submariner de los años 80, auténtico, con caja y certificados.' },
    price: 8500,
    category: 'collectibles',
    userId: 2,
    status: 'approved',
    images: ['https://images.pexels.com/photos/997910/pexels-photo-997910.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  // Additional Music & Movies
  {
    id: 32,
    title: { it: 'Collezione CD anni 90', en: '90s CD collection', es: 'Colección de CD de los 90' },
    description: { it: 'Oltre 200 CD originali degli anni 90, rock e pop. Tutti in ottime condizioni.', en: 'Over 200 original CDs from the 90s, rock and pop. All in excellent condition.', es: 'Más de 200 CD originales de los 90, rock y pop. Todos en excelente estado.' },
    price: 180,
    category: 'music_movies',
    userId: 5,
    status: 'approved',
    images: ['https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 33,
    title: { it: 'Giradischi vintage Technics', en: 'Vintage Technics turntable', es: 'Tocadiscos vintage Technics' },
    description: { it: 'Giradischi Technics SL-1200, anni 80, perfettamente funzionante. Con braccio e testina.', en: 'Technics SL-1200 turntable, 80s, perfectly functional. With arm and cartridge.', es: 'Tocadiscos Technics SL-1200, años 80, perfectamente funcional. Con brazo y cápsula.' },
    price: 450,
    category: 'music_movies',
    userId: 1,
    status: 'approved',
    images: ['https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 34,
    title: { it: 'Collezione Blu-ray film cult', en: 'Cult film Blu-ray collection', es: 'Colección Blu-ray de películas de culto' },
    description: { it: '50+ film in Blu-ray, edizioni speciali e limitate. Film cult e classici.', en: '50+ films on Blu-ray, special and limited editions. Cult and classic films.', es: 'Más de 50 películas en Blu-ray, ediciones especiales y limitadas. Películas de culto y clásicas.' },
    price: 220,
    category: 'music_movies',
    userId: 4,
    status: 'pending',
    images: ['https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  // Additional Books & Magazines
  {
    id: 35,
    title: { it: 'Enciclopedia Treccani completa', en: 'Complete Treccani encyclopedia', es: 'Enciclopedia Treccani completa' },
    description: { it: 'Enciclopedia Treccani in 30 volumi, edizione completa. Ottime condizioni.', en: 'Treccani encyclopedia in 30 volumes, complete edition. Excellent condition.', es: 'Enciclopedia Treccani en 30 volúmenes, edición completa. Excelente estado.' },
    price: 350,
    category: 'books_magazines',
    userId: 2,
    status: 'approved',
    images: ['https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 36,
    title: { it: 'Riviste National Geographic anni 80-90', en: 'National Geographic magazines 80s-90s', es: 'Revistas National Geographic años 80-90' },
    description: { it: 'Collezione di oltre 100 numeri di National Geographic, perfettamente conservati.', en: 'Collection of over 100 National Geographic issues, perfectly preserved.', es: 'Colección de más de 100 números de National Geographic, perfectamente conservados.' },
    price: 280,
    category: 'books_magazines',
    userId: 5,
    status: 'approved',
    images: ['https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 37,
    title: { it: 'Libri di cucina italiani autentici', en: 'Authentic Italian cookbooks', es: 'Libros de cocina italiana auténticos' },
    description: { it: 'Collezione di 20 libri di cucina italiana, ricette tradizionali e regionali.', en: 'Collection of 20 Italian cookbooks, traditional and regional recipes.', es: 'Colección de 20 libros de cocina italiana, recetas tradicionales y regionales.' },
    price: 120,
    category: 'books_magazines',
    userId: 1,
    status: 'pending',
    images: ['https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  // Additional Jobs
  {
    id: 38,
    title: { it: 'Cercasi Graphic Designer', en: 'Seeking Graphic Designer', es: 'Se busca Diseñador Gráfico' },
    description: { it: 'Cercasi graphic designer con esperienza in branding e social media. Lavoro ibrido.', en: 'Seeking graphic designer with experience in branding and social media. Hybrid work.', es: 'Se busca diseñador gráfico con experiencia en branding y redes sociales. Trabajo híbrido.' },
    price: 2500,
    category: 'jobs',
    userId: 4,
    status: 'approved',
    images: ['https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 39,
    title: { it: 'Offerta Marketing Manager', en: 'Marketing Manager Offer', es: 'Oferta Gerente de Marketing' },
    description: { it: 'Cercasi marketing manager con 5+ anni di esperienza. Lavoro da remoto, full-time.', en: 'Seeking marketing manager with 5+ years of experience. Remote work, full-time.', es: 'Se busca gerente de marketing con más de 5 años de experiencia. Trabajo remoto, tiempo completo.' },
    price: 3500,
    category: 'jobs',
    userId: 2,
    status: 'approved',
    images: ['https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
  {
    id: 40,
    title: { it: 'Cercasi Chef per ristorante', en: 'Seeking Chef for restaurant', es: 'Se busca Chef para restaurante' },
    description: { it: 'Cercasi chef esperto in cucina italiana tradizionale. Contratto a tempo indeterminato.', en: 'Seeking chef expert in traditional Italian cuisine. Permanent contract.', es: 'Se busca chef experto en cocina italiana tradicional. Contrato indefinido.' },
    price: 2800,
    category: 'jobs',
    userId: 1,
    status: 'pending',
    images: ['https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'],
  },
];

// Apply ensureAdImage to all ads after the array is defined
// This is the processed version that should be used in the app
export const INITIAL_ADS_PROCESSED: Ad[] = INITIAL_ADS.map((ad) => {
  try {
    return ensureAdImage({ ...ad }); // Create a copy to avoid mutating the original
  } catch (error) {
    console.error('Error ensuring image for ad:', ad.id, error);
    return ad;
  }
});

export const LANGUAGES: Language[] = [
  { code: 'it', name: 'Italiano', flag: '🇮🇹', locale: 'it-IT' },
  { code: 'en', name: 'English', flag: '🇬🇧', locale: 'en-GB' },
  { code: 'es', name: 'Español', flag: '🇪🇸', locale: 'es-ES' },
];

export const I18N: Record<string, Record<Language['code'], string>> = {
  // General
  all_categories: { it: 'Tutte le categorie', en: 'All categories', es: 'Todas las categorías' },
  search_placeholder: { it: 'Cerca prodotti...', en: 'Search products...', es: 'Buscar productos...' },
  price: { it: 'Prezzo', en: 'Price', es: 'Precio' },
  category: { it: 'Categoria', en: 'Category', es: 'Categoría' },
  description: { it: 'Descrizione', en: 'Description', es: 'Descripción' },
  title: { it: 'Titolo', en: 'Title', es: 'Título' },
  name: { it: 'Nome', en: 'Name', es: 'Nombre' },
  email: { it: 'Email', en: 'Email', es: 'Correo electrónico' },
  register: { it: 'Registrati', en: 'Register', es: 'Registrarse' },
  cancel: { it: 'Annulla', en: 'Cancel', es: 'Cancelar' },
  password: { it: 'Password', en: 'Password', es: 'Contraseña' },
  // Header
  home: { it: 'Home', en: 'Home', es: 'Inicio' },
  post_ad: { it: 'Vendi un articolo', en: 'Sell an Item', es: 'Vender un Artículo' },
  revisor_dashboard: { it: 'Dashboard Revisore', en: 'Revisor Dashboard', es: 'Panel de Revisor' },
  work_with_us: { it: 'Lavora con noi', en: 'Work with us', es: 'Trabaja con nosotros' },
  login: { it: 'Accedi', en: 'Login', es: 'Acceder' },
  login_register: { it: 'Accedi / Registrati', en: 'Login / Register', es: 'Iniciar Sesión / Registrarse' },
  logout: { it: 'Esci', en: 'Logout', es: 'Cerrar Sesión' },
  become_seller: { it: 'Diventa un venditore', en: 'Become a seller', es: 'Conviértete en vendedor' },
  // Home
  recent_ads: { it: 'Prodotti Recenti', en: 'Recent Products', es: 'Productos Recientes' },
  no_ads_found: { it: 'Nessun prodotto trovato.', en: 'No products found.', es: 'No se encontraron productos.' },
  hero_subtitle: { it: 'Il marketplace per acquisti veloci, sicuri e intelligenti.', en: 'The marketplace for fast, safe, and smart shopping.', es: 'El marketplace para compras rápidas, seguras e inteligentes.' },
  // Ad Detail
  posted_by: { it: 'Venduto da', en: 'Sold by', es: 'Vendido por' },
  back_to_home: { it: 'Torna alla home', en: 'Back to home', es: 'Volver al inicio' },
  ad_not_found: { it: 'Prodotto non trovato', en: 'Product not found', es: 'Producto no encontrado' },
  visit_store: { it: 'Visita il Negozio', en: 'Visit Store', es: 'Visitar Tienda' },
  seller_info: { it: 'Informazioni sul venditore', en: 'Seller Information', es: 'Información del vendedor' },
  // Create Ad
  ad_created_success: { it: 'Prodotto inviato con successo! Sarà revisionato a breve.', en: 'Product submitted successfully! It will be reviewed shortly.', es: '¡Producto enviado con éxito! Se revisará en breve.' },
  fill_all_fields: { it: 'Per favore, compila tutti i campi.', en: 'Please fill in all fields.', es: 'Por favor, rellene todos los campos.' },
  ad_processing_error: { it: 'C\'è stato un errore durante l\'elaborazione del prodotto. Riprova.', en: 'There was an error processing the product. Please try again.', es: 'Hubo un error al procesar el producto. Por favor, inténtelo de nuevo.' },
  create_new_ad: { it: 'Vendi un nuovo articolo', en: 'Sell a new item', es: 'Vender un artículo nuevo' },
  ad_details: { it: 'Dettagli articolo', en: 'Item details', es: 'Detalles del artículo' },
  upload_images: { it: 'Carica Immagini', en: 'Upload Images', es: 'Subir Imágenes' },
  anonymize_faces: { it: 'Anonimizza i volti nelle foto (privacy)', en: 'Anonymize faces in photos (privacy)', es: 'Anonimizar rostros en fotos (privacidad)' },
  submit_ad: { it: 'Metti in vendita', en: 'List Item', es: 'Poner a la venta' },
  must_be_logged_in_to_post: { it: 'Devi effettuare l\'accesso per inserire un annuncio.', en: 'You must be logged in to post an ad.', es: 'Debes iniciar sesión para publicar un anuncio.' },
  upload_a_file: { it: 'Carica un file', en: 'Upload a file', es: 'Subir un archivo' },
  or_drag_and_drop: { it: 'o trascina', en: 'or drag and drop', es: 'o arrastrar y soltar' },
  file_types_and_size: { it: 'PNG, JPG fino a 10MB', en: 'PNG, JPG up to 10MB', es: 'PNG, JPG hasta 10MB' },
  // Revisor Dashboard
  ads_to_review: { it: 'Articoli da Revisionare', en: 'Items to Review', es: 'Artículos para Revisar' },
  no_ads_to_review: { it: 'Nessun articolo da revisionare.', en: 'No items to review.', es: 'No hay artículos para revisar.' },
  approve: { it: 'Approva', en: 'Approve', es: 'Aprobar' },
  reject: { it: 'Rifiuta', en: 'Reject', es: 'Rechazar' },
  analyze_image: { it: 'Analizza Immagine', en: 'Analyze Image', es: 'Analizar Imagen' },
  watermark_preview_error: { it: 'Errore durante la generazione dell\'anteprima del watermark. Riprova.', en: 'Error generating watermark preview. Please try again.', es: 'Error al generar la vista previa de la marca de agua. Por favor, inténtelo de nuevo.' },
  by_user: { it: 'di {user}', en: 'by {user}', es: 'de {user}' },
  unknown_user: { it: 'Sconosciuto', en: 'Unknown', es: 'Desconocido' },
  confirm_approval: { it: 'Conferma Approvazione', en: 'Confirm Approval', es: 'Confirmar Aprobación' },
  image_comparison: { it: 'Confronto Immagini: Originale vs Watermark', en: 'Image Comparison: Original vs Watermarked', es: 'Comparación de Imágenes: Original vs con Marca de Agua' },
  original: { it: 'Originale', en: 'Original', es: 'Original' },
  with_watermark: { it: 'Con Watermark', en: 'With Watermark', es: 'Con Marca de Agua' },
  analysis_failed: { it: 'Analisi fallita', en: 'Analysis failed', es: 'Análisis fallido' },
  tags: { it: 'Tags:', en: 'Tags:', es: 'Etiquetas:' },
  not_available: { it: 'N/A', en: 'N/A', es: 'N/D' },
  safe: { it: 'Safe', en: 'Safe', es: 'Seguro' },
  not_safe: { it: 'Not Safe', en: 'Not Safe', es: 'No Seguro' },
  access_denied: { it: 'Accesso negato.', en: 'Access denied.', es: 'Acceso denegado.' },
  revisor_only_section: { it: 'Questa sezione è riservata ai revisori.', en: 'This section is for revisors only.', es: 'Esta sección es solo para revisores.' },
  analyze_text: { it: 'Analizza Testo', en: 'Analyze Text', es: 'Analizar Texto' },
  text_analysis: { it: 'Analisi Testo', en: 'Text Analysis', es: 'Análisis de Texto' },
  content_analysis: { it: 'Analisi Contenuto', en: 'Content Analysis', es: 'Análisis de Contenido' },
  // Work With Us
  become_a_revisor: { it: 'Diventa un revisore', en: 'Become a revisor', es: 'Conviértete en revisor' },
  revisor_description: { it: 'Guadagna un extra aiutando la nostra community a rimanere sicura. Invia la tua candidatura per diventare revisore.', en: 'Earn extra income by helping our community stay safe. Apply to become a revisor.', es: 'Gana un ingreso extra ayudando a nuestra comunidad a mantenerse segura. Postula para convertirte en revisor.' },
  your_name: { it: 'Il tuo nome', en: 'Your name', es: 'Tu nombre' },
  your_email: { it: 'La tua email', en: 'Your email', es: 'Tu correo electrónico' },
  why_revisor: { it: 'Perché vuoi diventare revisore?', en: 'Why do you want to become a revisor?', es: '¿Por qué quieres ser revisor?' },
  send_request: { it: 'Invia Richiesta', en: 'Send Request', es: 'Enviar Solicitud' },
  thank_you: { it: 'Grazie!', en: 'Thank you!', es: '¡Gracias!' },
  request_sent: { it: 'La tua richiesta è stata inviata. Ti contatteremo al più presto.', en: 'Your request has been sent. We will contact you soon.', es: 'Tu solicitud ha sido enviada. Nos pondremos en contacto contigo pronto.' },
  revisor_application_approved: { it: 'Congratulazioni! Sei ora un revisore. Puoi iniziare a guadagnare denaro revisionando gli articoli.', en: 'Congratulations! You are now a revisor. You can start earning money by reviewing articles.', es: '¡Felicidades! Ahora eres un revisor. Puedes empezar a ganar dinero revisando artículos.' },
  go_to_revisor_dashboard: { it: 'Vai alla Dashboard Revisore', en: 'Go to Revisor Dashboard', es: 'Ir al Panel de Revisor' },
  total_earnings: { it: 'Guadagni Totali', en: 'Total Earnings', es: 'Ganancias Totales' },
  earnings_per_review: { it: 'Guadagni per revisione', en: 'Earnings per review', es: 'Ganancias por revisión' },
  total_reviews: { it: 'Revisioni Totali', en: 'Total Reviews', es: 'Revisiones Totales' },
  ads_reviewed: { it: 'Articoli revisionati', en: 'Ads reviewed', es: 'Anuncios revisados' },
  earnings_added: { it: 'Guadagni aggiunti!', en: 'Earnings added!', es: '¡Ganancias añadidas!' },
  earned_review: { it: 'Hai guadagnato €0.50 per questa revisione.', en: 'You earned €0.50 for this review.', es: 'Has ganado €0.50 por esta revisión.' },
  how_to_earn_money: { it: 'Come Guadagnare Denaro', en: 'How to Earn Money', es: 'Cómo Ganar Dinero' },
  step_1: { it: 'Passo 1', en: 'Step 1', es: 'Paso 1' },
  step_1_desc: { it: 'Diventa revisore compilando il modulo', en: 'Become a revisor by filling the form', es: 'Conviértete en revisor completando el formulario' },
  step_2: { it: 'Passo 2', en: 'Step 2', es: 'Paso 2' },
  step_2_desc: { it: 'Revisiona gli articoli in attesa', en: 'Review pending articles', es: 'Revisa los artículos pendientes' },
  step_3: { it: 'Passo 3', en: 'Step 3', es: 'Paso 3' },
  step_3_desc: { it: 'Guadagna €0.50 per ogni revisione', en: 'Earn €0.50 for each review', es: 'Gana €0.50 por cada revisión' },
  earn_per_review: { it: '€0.50 per revisione', en: '€0.50 per review', es: '€0.50 por revisión' },
  instant_payment: { it: 'Pagamento istantaneo', en: 'Instant payment', es: 'Pago instantáneo' },
  per_review: { it: 'per revisione', en: 'per review', es: 'por revisión' },
  earnings_progress: { it: 'Progresso guadagni', en: 'Earnings progress', es: 'Progreso de ganancias' },
  completed: { it: 'Completate', en: 'Completed', es: 'Completadas' },
  potential_earnings: { it: 'Guadagni potenziali', en: 'Potential earnings', es: 'Ganancias potenciales' },
  earning_tip: { it: 'Suggerimento per Guadagnare', en: 'Earning Tip', es: 'Consejo para Ganar' },
  earning_tip_desc: { it: 'Più articoli revisioni, più guadagni! Ogni approvazione o rifiuto ti fa guadagnare €0.50 istantaneamente.', en: 'The more articles you review, the more you earn! Each approval or rejection earns you €0.50 instantly.', es: '¡Cuántos más artículos revises, más ganarás! Cada aprobación o rechazo te hace ganar €0.50 al instante.' },
  earn_reviewing: { it: 'Guadagna revisionando', en: 'Earn by reviewing', es: 'Gana revisando' },
  // Login
  login_failed: { it: 'Email o password non validi.', en: 'Invalid email or password.', es: 'Correo electrónico o contraseña no válidos.' },
  email_exists: { it: 'Un utente con questa email esiste già.', en: 'A user with this email already exists.', es: 'Ya existe un usuario con este correo electrónico.' },
  create_account: { it: 'Crea un Account', en: 'Create an Account', es: 'Crear una Cuenta' },
  login_to_presto: { it: 'Accedi a Presto.it', en: 'Login to Presto.it', es: 'Acceder a Presto.it' },
  already_have_account: { it: 'Hai già un account?', en: 'Already have an account?', es: '¿Ya tienes una cuenta?' },
  no_account: { it: 'Non hai un account?', en: 'Don\'t have an account?', es: '¿No tienes una cuenta?' },
  confirm_password: { it: 'Conferma Password', en: 'Confirm Password', es: 'Confirmar Contraseña' },
  passwords_no_match: { it: 'Le password non coincidono.', en: 'Passwords do not match.', es: 'Las contraseñas no coinciden.' },
  // Seller
  open_your_store: { it: 'Apri il tuo negozio', en: 'Open your store', es: 'Abre tu tienda' },
  store_description_long: { it: 'Crea il tuo spazio su Presto.it. Vendi i tuoi prodotti, costruisci il tuo brand e raggiungi migliaia di clienti.', en: 'Create your space on Presto.it. Sell your products, build your brand, and reach thousands of customers.', es: 'Crea tu espacio en Presto.it. Vende tus productos, construye tu marca y llega a miles de clientes.' },
  store_name: { it: 'Nome del negozio', en: 'Store name', es: 'Nombre de la tienda' },
  store_description: { it: 'Descrizione del negozio', en: 'Store description', es: 'Descripción de la tienda' },
  create_store: { it: 'Crea Negozio', en: 'Create Store', es: 'Crear Tienda' },
  store_created: { it: 'Il tuo negozio è pronto!', en: 'Your store is ready!', es: '¡Tu tienda está lista!' },
  store_created_desc: { it: 'Congratulazioni! Ora puoi iniziare a vendere i tuoi articoli.', en: 'Congratulations! You can now start selling your items.', es: '¡Felicidades! Ahora puedes empezar a vender tus artículos.' },
  products_from: { it: 'Prodotti da {storeName}', en: 'Products from {storeName}', es: 'Productos de {storeName}' },
  login_to_open_store: { it: 'Accedi per aprire un negozio.', en: 'Please login to open a store.', es: 'Inicia sesión para abrir una tienda.' },
  already_have_store: { it: 'Hai già un negozio!', en: 'You already have a store!', es: '¡Ya tienes una tienda!' },
  store_not_found: { it: 'Negozio non trovato', en: 'Store not found', es: 'Tienda no encontrada' },
  // Footer
  platform_description: { it: 'La tua piattaforma e-commerce preferita.', en: 'Your favorite e-commerce platform.', es: 'Tu plataforma de e-commerce favorita.' },
  quick_links: { it: 'Link Rapidi', en: 'Quick Links', es: 'Enlaces Rápidos' },
  about_us: { it: 'Chi Siamo', en: 'About Us', es: 'Sobre Nosotros' },
  follow_us: { it: 'Seguici', en: 'Follow Us', es: 'Síguenos' },
  all_rights_reserved: { it: '© 2025 Presto.it. Tutti i diritti riservati.', en: '© 2025 Presto.it. All rights reserved.', es: '© 2025 Presto.it. Todos los derechos reservados.' },
  instagram_aria: { it: 'Vai a Instagram', en: 'Go to Instagram', es: 'Ir a Instagram' },
  facebook_aria: { it: 'Vai a Facebook', en: 'Go to Facebook', es: 'Ir a Facebook' },
  // Profile
  my_profile: { it: 'Il Mio Profilo', en: 'My Profile', es: 'Mi Perfil' },
  personal_information: { it: 'Informazioni Personali', en: 'Personal Information', es: 'Información Personal' },
  account_type: { it: 'Tipo di Account', en: 'Account Type', es: 'Tipo de Cuenta' },
  revisor: { it: 'Revisore', en: 'Revisor', es: 'Revisor' },
  seller: { it: 'Venditore', en: 'Seller', es: 'Vendedor' },
  regular_user: { it: 'Utente Regolare', en: 'Regular User', es: 'Usuario Regular' },
  statistics: { it: 'Statistiche', en: 'Statistics', es: 'Estadísticas' },
  total_ads: { it: 'Totale Annunci', en: 'Total Ads', es: 'Total Anuncios' },
  approved_ads: { it: 'Annunci Approvati', en: 'Approved Ads', es: 'Anuncios Aprobados' },
  pending_ads: { it: 'Annunci in Attesa', en: 'Pending Ads', es: 'Anuncios Pendientes' },
  store: { it: 'Negozio', en: 'Store', es: 'Tienda' },
  danger_zone: { it: 'Zona Pericolosa', en: 'Danger Zone', es: 'Zona Peligrosa' },
  delete_account_warning: { it: 'Eliminando il tuo account, eliminerai permanentemente tutti i tuoi dati, annunci e negozio. Questa azione non può essere annullata.', en: 'By deleting your account, you will permanently delete all your data, ads, and store. This action cannot be undone.', es: 'Al eliminar tu cuenta, eliminarás permanentemente todos tus datos, anuncios y tienda. Esta acción no se puede deshacer.' },
  delete_account: { it: 'Elimina Account', en: 'Delete Account', es: 'Eliminar Cuenta' },
  confirm_delete_account: { it: 'Sei sicuro di voler eliminare il tuo account? Questa azione è permanente e non può essere annullata.', en: 'Are you sure you want to delete your account? This action is permanent and cannot be undone.', es: '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es permanente y no se puede deshacer.' },
  login_required: { it: 'Accesso Richiesto', en: 'Login Required', es: 'Inicio de Sesión Requerido' },
  please_login_to_view_profile: { it: 'Effettua il login per visualizzare il tuo profilo.', en: 'Please login to view your profile.', es: 'Por favor inicia sesión para ver tu perfil.' },
  // My Listings
  my_listings: { it: 'I Miei Annunci', en: 'My Listings', es: 'Mis Anuncios' },
  view_my_listings: { it: 'Visualizza I Miei Annunci', en: 'View My Listings', es: 'Ver Mis Anuncios' },
  no_listings_yet: { it: 'Nessun Annuncio Ancora', en: 'No Listings Yet', es: 'Aún No Hay Anuncios' },
  create_your_first_listing: { it: 'Crea il tuo primo annuncio per iniziare a vendere.', en: 'Create your first listing to start selling.', es: 'Crea tu primer anuncio para empezar a vender.' },
  rejected_ads: { it: 'Annunci Rifiutati', en: 'Rejected Ads', es: 'Anuncios Rechazados' },
  view: { it: 'Visualizza', en: 'View', es: 'Ver' },
  confirm_delete_ad: { it: 'Sei sicuro di voler eliminare questo annuncio?', en: 'Are you sure you want to delete this ad?', es: '¿Estás seguro de que deseas eliminar este anuncio?' },
  status_approved: { it: 'Approvato', en: 'Approved', es: 'Aprobado' },
  status_pending: { it: 'In Attesa', en: 'Pending', es: 'Pendiente' },
  status_rejected: { it: 'Rifiutato', en: 'Rejected', es: 'Rechazado' },
  please_login_to_view_listings: { it: 'Effettua il login per visualizzare i tuoi annunci.', en: 'Please login to view your listings.', es: 'Por favor inicia sesión para ver tus anuncios.' },
  add_to_store: { it: 'Aggiungi al negozio', en: 'Add to store', es: 'Añadir a la tienda' },
  my_store: { it: 'Il Mio Negozio', en: 'My Store', es: 'Mi Tienda' },
  view_my_store: { it: 'Visualizza Il Mio Negozio', en: 'View My Store', es: 'Ver Mi Tienda' },
  manage_store: { it: 'Gestisci Negozio', en: 'Manage Store', es: 'Gestionar Tienda' },
  total_products: { it: 'Prodotti Totali', en: 'Total Products', es: 'Productos Totales' },
  // Basket & Checkout
  shopping_basket: { it: 'Carrello', en: 'Shopping Basket', es: 'Cesta de Compra' },
  basket: { it: 'Carrello', en: 'Basket', es: 'Cesta' },
  add_to_basket: { it: 'Aggiungi al Carrello', en: 'Add to Basket', es: 'Añadir a la Cesta' },
  remove_from_basket: { it: 'Rimuovi dal Carrello', en: 'Remove from Basket', es: 'Quitar de la Cesta' },
  basket_empty: { it: 'Il carrello è vuoto', en: 'Your basket is empty', es: 'Tu cesta está vacía' },
  basket_empty_title: { it: 'Carrello Vuoto', en: 'Empty Basket', es: 'Cesta Vacía' },
  basket_empty_message: { it: 'Non ci sono articoli nel tuo carrello. Inizia ad aggiungere prodotti!', en: 'There are no items in your basket. Start adding products!', es: 'No hay artículos en tu cesta. ¡Empieza a añadir productos!' },
  continue_shopping: { it: 'Continua gli Acquisti', en: 'Continue Shopping', es: 'Continuar Comprando' },
  order_summary: { it: 'Riepilogo Ordine', en: 'Order Summary', es: 'Resumen del Pedido' },
  subtotal: { it: 'Subtotale', en: 'Subtotal', es: 'Subtotal' },
  total: { it: 'Totale', en: 'Total', es: 'Total' },
  total_items: { it: 'Articoli Totali', en: 'Total Items', es: 'Artículos Totales' },
  quantity: { it: 'Quantità', en: 'Quantity', es: 'Cantidad' },
  each: { it: 'ciascuno', en: 'each', es: 'cada uno' },
  remove: { it: 'Rimuovi', en: 'Remove', es: 'Quitar' },
  confirm_remove_item: { it: 'Sei sicuro di voler rimuovere questo articolo dal carrello?', en: 'Are you sure you want to remove this item from the basket?', es: '¿Estás seguro de que deseas quitar este artículo de la cesta?' },
  clear_basket: { it: 'Svuota Carrello', en: 'Clear Basket', es: 'Vaciar Cesta' },
  confirm_clear_basket: { it: 'Sei sicuro di voler svuotare il carrello?', en: 'Are you sure you want to clear the basket?', es: '¿Estás seguro de que deseas vaciar la cesta?' },
  proceed_to_checkout: { it: 'Procedi al Checkout', en: 'Proceed to Checkout', es: 'Proceder al Pago' },
  checkout: { it: 'Checkout', en: 'Checkout', es: 'Pago' },
  customer_information: { it: 'Informazioni Cliente', en: 'Customer Information', es: 'Información del Cliente' },
  payment_method: { it: 'Metodo di Pagamento', en: 'Payment Method', es: 'Método de Pago' },
  credit_debit_card: { it: 'Carta di Credito/Debito', en: 'Credit/Debit Card', es: 'Tarjeta de Crédito/Débito' },
  bank_transfer: { it: 'Bonifico Bancario', en: 'Bank Transfer', es: 'Transferencia Bancaria' },
  cash_on_delivery: { it: 'Contrassegno', en: 'Cash on Delivery', es: 'Pago Contra Reembolso' },
  order_items: { it: 'Articoli dell\'Ordine', en: 'Order Items', es: 'Artículos del Pedido' },
  shipping: { it: 'Spedizione', en: 'Shipping', es: 'Envío' },
  free: { it: 'Gratuita', en: 'Free', es: 'Gratis' },
  complete_order: { it: 'Completa Ordine', en: 'Complete Order', es: 'Completar Pedido' },
  back_to_basket: { it: 'Torna al Carrello', en: 'Back to Basket', es: 'Volver a la Cesta' },
  login_required_for_checkout: { it: 'Devi effettuare il login per completare l\'ordine.', en: 'You must be logged in to complete the order.', es: 'Debes iniciar sesión para completar el pedido.' },
  order_success: { it: 'Ordine completato con successo! Totale pagato: {total}', en: 'Order completed successfully! Total paid: {total}', es: '¡Pedido completado con éxito! Total pagado: {total}' },
  basket_count: { it: '{count} articoli', en: '{count} items', es: '{count} artículos' },
  added: { it: 'Aggiunto!', en: 'Added!', es: '¡Añadido!' },
  store_information: { it: 'Informazioni Negozio', en: 'Store Information', es: 'Información de la Tienda' },
  store_statistics: { it: 'Statistiche Negozio', en: 'Store Statistics', es: 'Estadísticas de la Tienda' },
  save_changes: { it: 'Salva Modifiche', en: 'Save Changes', es: 'Guardar Cambios' },
  store_updated_success: { it: 'Negozio aggiornato con successo!', en: 'Store updated successfully!', es: '¡Tienda actualizada con éxito!' },
  manage_products: { it: 'Gestisci Prodotti', en: 'Manage Products', es: 'Gestionar Productos' },
  store_products: { it: 'Prodotti del Negozio', en: 'Store Products', es: 'Productos de la Tienda' },
  no_products_in_store: { it: 'Nessun prodotto nel negozio ancora.', en: 'No products in store yet.', es: 'Aún no hay productos en la tienda.' },
  add_product: { it: 'Aggiungi Prodotto', en: 'Add Product', es: 'Añadir Producto' },
  view_store: { it: 'Visualizza Negozio', en: 'View Store', es: 'Ver Tienda' },
  no_store_to_manage: { it: 'Nessun Negozio da Gestire', en: 'No Store to Manage', es: 'No Hay Tienda para Gestionar' },
  create_store_first: { it: 'Crea un negozio per iniziare a gestirlo.', en: 'Create a store first to manage it.', es: 'Crea una tienda primero para gestionarla.' },
};