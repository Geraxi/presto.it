

import type { User, Ad, Language, CategoryKey, Store } from './types';

const placeholderPath = '/public/images/placeholder.svg';

export const USERS: User[] = [
  { id: 1, name: 'Linda', email: 'linda@example.com', isRevisor: false, password: 'password', storeId: 1 },
  { id: 2, name: 'Pino', email: 'pino@example.com', isRevisor: false, password: 'password', storeId: 2 },
  { id: 3, name: 'Pablo', email: 'pablo@example.com', isRevisor: true, password: 'password' },
  { id: 4, name: 'Arnold', email: 'arnold@example.com', isRevisor: false, password: 'password' },
  { id: 5, name: 'Guohua', email: 'guohua@example.com', isRevisor: false, password: 'password' },
];

export const STORES: Store[] = [
    { id: 1, name: "Linda's Luxuries", description: "High-quality vintage furniture and decor that brings elegance to any home.", logo: '/public/images/linda-luxuries.png', ownerId: 1 },
    { id: 2, name: "Pino's Tech Hub", description: "The latest and greatest in personal electronics, gadgets, and accessories.", logo: '/public/images/pino-tech.png', ownerId: 2 },
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
    images: ['/public/images/iphone-15-pro.png'],
    watermarkedImages: ['/public/images/iphone-15-pro.png'],
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
    images: ['/public/images/vintage-sofa.png'],
     watermarkedImages: ['/public/images/vintage-sofa.png'],
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
    images: ['/public/images/levis-jacket.png'],
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
    images: ['/public/images/fiat-500e.png'],
     watermarkedImages: ['/public/images/fiat-500e.png'],
  },
  {
    id: 5,
    title: { it: 'Collezione Manga Dragon Ball', en: 'Dragon Ball Manga Collection', es: 'Colección Manga Dragon Ball' },
    description: { it: 'Serie completa di Dragon Ball, prima edizione. Condizioni da collezionista.', en: 'Complete Dragon Ball series, first edition. Collector\'s condition.', es: 'Serie completa de Dragon Ball, primera edición. Estado de coleccionista.' },
    price: 300,
    category: 'collectibles',
    userId: 5,
    status: 'approved',
    images: ['/public/images/dragon-ball.png'],
    watermarkedImages: ['/public/images/dragon-ball.png'],
  },
  {
    id: 6,
    title: { it: 'Tapis Roulant Technogym', en: 'Technogym Treadmill', es: 'Cinta de correr Technogym' },
    description: { it: 'Professionale, usato in palestra. Perfettamente funzionante.', en: 'Professional, used in a gym. Perfectly functional.', es: 'Profesional, usada en gimnasio. Perfectamente funcional.' },
    price: 1500,
    category: 'sports',
    userId: 4,
    status: 'approved',
    images: ['/public/images/technogym-treadmill.png'],
    watermarkedImages: ['/public/images/technogym-treadmill.png'],
  },
  {
    id: 7,
    title: { it: 'Offerta Sviluppatore Web', en: 'Web Developer Offer', es: 'Oferta Desarrollador Web' },
    description: { it: 'Cercasi sviluppatore frontend con 3+ anni di esperienza in React. Lavoro da remoto.', en: 'Seeking a frontend developer with 3+ years of experience in React. Remote work.', es: 'Se busca desarrollador frontend con más de 3 años de experiencia en React. Trabajo remoto.' },
    price: 50000,
    category: 'jobs',
    userId: 2,
    status: 'approved',
    images: [placeholderPath],
    watermarkedImages: [placeholderPath],
  },
  {
    id: 8,
    title: { it: 'Monolocale in centro', en: 'Studio apartment in the center', es: 'Estudio en el centro' },
    description: { it: 'Affittasi monolocale arredato, zona servita dai mezzi. Solo referenziati.', en: 'Furnished studio for rent, area served by public transport. Only referenced people.', es: 'Se alquila estudio amueblado, zona con transporte público. Solo personas con referencias.' },
    price: 700,
    category: 'real_estate',
    userId: 1,
    status: 'pending',
    images: ['/public/images/studio-apartment.png'],
  },
  {
    id: 9,
    title: { it: 'Vinile "The Dark Side of the Moon"', en: 'Vinyl "The Dark Side of the Moon"', es: 'Vinilo "The Dark Side of the Moon"' },
    description: { it: 'Stampa originale del 1973 dei Pink Floyd. In ottime condizioni.', en: 'Original 1973 Pink Floyd pressing. In excellent condition.', es: 'Prensado original de 1973 de Pink Floyd. En excelente estado.' },
    price: 150,
    category: 'music_movies',
    userId: 5,
    status: 'approved',
    images: ['/public/images/pink-floyd-vinyl.png'],
    watermarkedImages: ['/public/images/pink-floyd-vinyl.png'],
  },
  {
    id: 10,
    title: { it: 'Set completo Harry Potter', en: 'Complete Harry Potter Set', es: 'Set completo de Harry Potter' },
    description: { it: 'Tutti e 7 i libri della saga, edizione Salani. Come nuovi.', en: 'All 7 books of the saga, Salani edition. Like new.', es: 'Los 7 libros de la saga, edición Salani. Como nuevos.' },
    price: 80,
    category: 'books_magazines',
    userId: 1,
    status: 'approved',
    images: ['/public/images/harry-potter-books.png'],
    watermarkedImages: ['/public/images/harry-potter-books.png'],
  },
];

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
  hero_subtitle: { it: 'Il marketplace basato sull\'IA per acquisti veloci, sicuri e intelligenti.', en: 'The AI-powered marketplace for fast, safe, and smart shopping.', es: 'El marketplace impulsado por IA para compras rápidas, seguras e inteligentes.' },
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
  all_rights_reserved: { it: '© 2024 Presto.it. Tutti i diritti riservati.', en: '© 2024 Presto.it. All rights reserved.', es: '© 2024 Presto.it. Todos los derechos reservados.' },
  instagram_aria: { it: 'Vai a Instagram', en: 'Go to Instagram', es: 'Ir a Instagram' },
  facebook_aria: { it: 'Vai a Facebook', en: 'Go to Facebook', es: 'Ir a Facebook' },
};