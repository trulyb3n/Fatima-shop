import { Product, DeliveryZone, CustomerReview, ShopSettings, Promotion, AdminUser, AdminNotification, Order } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_fatima_shop_1794063044096.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Diable
  {
    id: 'prod-diable',
    name: 'Diable',
    category: 'parfums_femmes',
    categoryLabel: 'Parfum',
    price: 8000,
    costPrice: 5000,
    image: '/src/assets/images/perfume_diable_1794066654936.jpg',
    images: [
      '/src/assets/images/perfume_diable_1794066654936.jpg'
    ],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Parfum de caractère au sillage captivant et envoûtant.',
    fullDesc: 'Le parfum Diable distille une fragrance intense et magnétique conçue pour sublimer votre présence au quotidien et lors de vos événements.',
    volumeOrWeight: 'Flacon vaporisateur',
    stock: 25,
    isActive: true,
    isBestseller: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 34
  },
  // 2. Si Armani
  {
    id: 'prod-si-armani',
    name: 'Si Armani',
    category: 'parfums_femmes',
    categoryLabel: 'Parfum',
    price: 8000,
    costPrice: 5200,
    image: '/src/assets/images/perfume_si_armani_1794066655373.jpg',
    images: [
      '/src/assets/images/perfume_si_armani_1794066655373.jpg'
    ],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Une élégance féminine intemporelle, chic et lumineuse.',
    fullDesc: 'Si Armani incarne la grâce, la délicatesse et la modernité. Un parfum emblématique très apprécié pour son sillage harmonieux.',
    volumeOrWeight: 'Flacon vaporisateur',
    stock: 20,
    isActive: true,
    isBestseller: true,
    isNew: false,
    rating: 5.0,
    reviewsCount: 48
  },
  // 3. Divine
  {
    id: 'prod-divine',
    name: 'Divine',
    category: 'parfums_femmes',
    categoryLabel: 'Parfum',
    price: 8000,
    costPrice: 4800,
    image: '/src/assets/images/perfume_divine_1794066656258.jpg',
    images: [
      '/src/assets/images/perfume_divine_1794066656258.jpg'
    ],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Une signature olfactive radieuse et séduisante.',
    fullDesc: 'Divine est une fragrance subtile et solaire conçue pour sublimer chaque instant. Idéale pour une touche d’élégance raffinée.',
    volumeOrWeight: 'Flacon vaporisateur',
    stock: 18,
    isActive: true,
    isBestseller: false,
    isNew: true,
    rating: 4.8,
    reviewsCount: 22
  },
  // 4. Mussouf
  {
    id: 'prod-mussouf',
    name: 'Mussouf',
    category: 'parfums_mixtes',
    categoryLabel: 'Parfum',
    price: 8000,
    costPrice: 5000,
    image: '/src/assets/images/perfume_mussouf_1794066657279.jpg',
    images: [
      '/src/assets/images/perfume_mussouf_1794066657279.jpg'
    ],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Fragrance orientale authentique à la tenue prolongée.',
    fullDesc: 'Mussouf offre une senteur riche et chaleureuse dans son habillage en toile de jute emblématique qui reste fidèle tout au long de la journée sur votre peau et vos vêtements.',
    volumeOrWeight: 'Flacon vaporisateur',
    stock: 22,
    isActive: true,
    isBestseller: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 31
  },
  // 5. Waredi
  {
    id: 'prod-waredi',
    name: 'Waredi',
    category: 'parfums_femmes',
    categoryLabel: 'Parfum',
    price: 8000,
    costPrice: 4900,
    image: '/src/assets/images/perfume_waredi_1794066658389.jpg',
    images: [
      '/src/assets/images/perfume_waredi_1794066658389.jpg'
    ],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Un souffle floral doux et rafraîchissant.',
    fullDesc: 'Waredi est une essence florale délicate qui apporte fraîcheur, douceur et sérénité. Un classique incontournable de notre collection.',
    volumeOrWeight: 'Flacon vaporisateur',
    stock: 15,
    isActive: true,
    isBestseller: false,
    isNew: false,
    rating: 4.7,
    reviewsCount: 19
  },
  // 6. Ameer Oud
  {
    id: 'prod-ameer-oud',
    name: 'Ameer Oud',
    category: 'parfums_hommes',
    categoryLabel: 'Parfum',
    price: 8000,
    costPrice: 5100,
    image: '/src/assets/images/perfume_ameer_oud_1794066659513.jpg',
    images: [
      '/src/assets/images/perfume_ameer_oud_1794066659513.jpg'
    ],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'L’élégance majestueuse de l’oud oriental.',
    fullDesc: 'Ameer Oud est un parfum princier d’inspiration orientale. Sa profondeur boisée et noble laisse un souvenir mémorable.',
    volumeOrWeight: 'Flacon vaporisateur',
    stock: 30,
    isActive: true,
    isBestseller: true,
    isNew: false,
    rating: 5.0,
    reviewsCount: 56
  },
  // 7. Le Mâle Élixir
  {
    id: 'prod-le-male-elixir',
    name: 'Le Mâle Élixir',
    category: 'parfums_hommes',
    categoryLabel: 'Parfum',
    price: 8000,
    costPrice: 5300,
    image: '/src/assets/images/perfume_male_elixir_1794066660410.jpg',
    images: [
      '/src/assets/images/perfume_male_elixir_1794066660410.jpg'
    ],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Intensité virile et chaleur envoûtante.',
    fullDesc: 'Le Mâle Élixir se distingue par sa richesse et son magnétisme. Un flacon sculptural doré et ambré taillé pour marquer les esprits.',
    volumeOrWeight: 'Flacon vaporisateur',
    stock: 24,
    isActive: true,
    isBestseller: true,
    isNew: true,
    rating: 4.9,
    reviewsCount: 42
  },
  // 8. Oud Satin Mood
  {
    id: 'prod-oud-satin-mood',
    name: 'Oud Satin Mood',
    category: 'parfums_mixtes',
    categoryLabel: 'Parfum',
    price: 8000,
    costPrice: 5200,
    image: '/src/assets/images/perfume_oud_satin_mood_1794066661284.jpg',
    images: [
      '/src/assets/images/perfume_oud_satin_mood_1794066661284.jpg'
    ],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Un voile précieux de oud soyeux et raffiné.',
    fullDesc: 'Oud Satin Mood est une fragrance d’une rare élégance. Doux et texturé comme une étoffe de soie, il séduit hommes et femmes.',
    volumeOrWeight: 'Flacon vaporisateur',
    stock: 19,
    isActive: true,
    isBestseller: true,
    isNew: false,
    rating: 5.0,
    reviewsCount: 39
  },
  // 9. Moussouf Marron
  {
    id: 'prod-moussouf-marron',
    name: 'Moussouf Marron',
    category: 'parfums_mixtes',
    categoryLabel: 'Parfum',
    price: 8000,
    costPrice: 5000,
    image: '/src/assets/images/perfume_moussouf_marron_1794066662463.jpg',
    images: [
      '/src/assets/images/perfume_moussouf_marron_1794066662463.jpg'
    ],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Le célèbre parfum chocolaté gourmand et boisé.',
    fullDesc: 'Moussouf Marron est une création culte alliant gourmandise chaleureuse, notes de café, bois de cèdre et sillage boisé profond.',
    volumeOrWeight: 'Flacon vaporisateur',
    stock: 28,
    isActive: true,
    isBestseller: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 65
  },
  // 10. Oud Madhila
  {
    id: 'prod-oud-madhila',
    name: 'Oud Madhila',
    category: 'parfums_mixtes',
    categoryLabel: 'Parfum',
    price: 8000,
    costPrice: 5100,
    image: '/src/assets/images/perfume_oud_madhila_1794066662874.jpg',
    images: [
      '/src/assets/images/perfume_oud_madhila_1794066662874.jpg'
    ],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Un oud prestigieux, mystérieux et noble.',
    fullDesc: 'Oud Madhila est une déclinaison orientale précieuse offrant un flacon facetté et un sillage raffiné et persistant, adapté à toutes les occasions.',
    volumeOrWeight: 'Flacon vaporisateur',
    stock: 16,
    isActive: true,
    isBestseller: false,
    isNew: true,
    rating: 4.8,
    reviewsCount: 18
  },
  // 11. Lacoste Noir
  {
    id: 'prod-lacoste-noir',
    name: 'Lacoste Noir',
    category: 'parfums_hommes',
    categoryLabel: 'Parfum',
    price: 8000,
    costPrice: 5000,
    image: '/src/assets/images/perfume_lacoste_noir_1794066663696.jpg',
    images: [
      '/src/assets/images/perfume_lacoste_noir_1794066663696.jpg'
    ],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Fraîcheur intense et élégance masculine moderne.',
    fullDesc: 'Lacoste Noir associe dynamisme et sensualité pour un homme actif, moderne et distingué. Flacon noir mat emblématique.',
    volumeOrWeight: 'Flacon vaporisateur',
    stock: 20,
    isActive: true,
    isBestseller: false,
    isNew: false,
    rating: 4.8,
    reviewsCount: 25
  },
  // 12. Savon Hamam (5 kg)
  {
    id: 'prod-savon-hamam-5kg',
    name: 'Savon Hamam',
    category: 'savons_hamam',
    categoryLabel: 'Savon Hamam',
    price: 8500,
    costPrice: 4500,
    image: '/src/assets/images/savon_hamam_artisanal_1794066664761.jpg',
    images: [
      '/src/assets/images/savon_hamam_artisanal_1794066664761.jpg'
    ],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Savon traditionnel pour rituel de hammam, exfoliation et douceur absolue.',
    fullDesc: 'Véritable savon pour hammam en format généreux de 5 kg. Idéal pour un gommage corporel authentique, il nettoie la peau en profondeur, élimine les impuretés et laisse un toucher soyeux incomparable.',
    volumeOrWeight: 'Lot de 5 kg',
    stock: 40,
    isActive: true,
    isBestseller: true,
    isNew: false,
    rating: 5.0,
    reviewsCount: 74
  },
  // --- NOUVELLE CATÉGORIE : PRODUITS NATURELS & BIEN-ÊTRE ---
  // 13. Épices (Mélange de 7 épices)
  {
    id: 'prod-epices-7',
    name: 'Épices (Mélange de 7 épices)',
    category: 'produits_naturels',
    categoryLabel: 'Produits Naturels',
    price: 1300,
    costPrice: 800,
    image: '/src/assets/images/epices_melange_7_1794130677530.jpg',
    images: ['/src/assets/images/epices_melange_7_1794130677530.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Mélange artisanal de 7 épices nobles sélectionnées pour vos recettes et rituels aromatiques.',
    fullDesc: 'Composé selon la tradition orientale et sénégalaise, ce mélange d\'épices d\'exception offre un équilibre aromatique chaleureux et subtil pour sublimer toutes vos préparations.',
    volumeOrWeight: 'Mélange de 7 épices',
    stock: 35,
    isActive: true,
    isBestseller: false,
    isNew: true,
    rating: 4.9,
    reviewsCount: 16
  },
  // 14. Huile d’Aloe Vera
  {
    id: 'prod-huile-aloe-vera',
    name: 'Huile d’Aloe Vera',
    category: 'produits_naturels',
    categoryLabel: 'Produits Naturels',
    price: 3000,
    costPrice: 1800,
    image: '/src/assets/images/huile_aloe_vera_1794130679179.jpg',
    images: ['/src/assets/images/huile_aloe_vera_1794130679179.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Soin hydratant, régénérant et apaisant pour le visage, le corps et les cheveux.',
    fullDesc: 'Pure et bienfaisante, l\'huile d\'Aloe Vera restaure l\'hydratation naturelle, répare les pointes sèches et apaise les épidermes sensibles.',
    volumeOrWeight: '100 ml',
    stock: 25,
    isActive: true,
    isBestseller: false,
    isNew: true,
    rating: 4.8,
    reviewsCount: 19
  },
  // 15. Argile Ghassoul
  {
    id: 'prod-argile-ghassoul',
    name: 'Argile Ghassoul',
    category: 'produits_naturels',
    categoryLabel: 'Produits Naturels',
    price: 2500,
    costPrice: 1500,
    image: '/src/assets/images/argile_ghassoul_1794130679104.jpg',
    images: ['/src/assets/images/argile_ghassoul_1794130679104.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Argile volcanique purifiante et lavante ancestrale pour peau et cuir chevelu.',
    fullDesc: 'Trésor séculaire du rituel hammam, le Ghassoul absorbe les impuretés et l\'excès de sébum sans altérer le film hydrolipidique protecteur.',
    volumeOrWeight: '200 g',
    stock: 30,
    isActive: true,
    isBestseller: true,
    isNew: true,
    rating: 5.0,
    reviewsCount: 28
  },
  // 16. Eau de rose
  {
    id: 'prod-eau-de-rose',
    name: 'Eau de rose',
    category: 'produits_naturels',
    categoryLabel: 'Produits Naturels',
    price: 1000,
    costPrice: 600,
    image: '/src/assets/images/eau_de_rose_pure_1794130679455.jpg',
    images: ['/src/assets/images/eau_de_rose_pure_1794130679455.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Hydrolat pur de pétales de rose pour tonifier et illuminer le teint.',
    fullDesc: 'Fraîche et délicatement parfumée, l\'eau de rose resserre les pores, réveille l\'éclat du teint et apporte un confort immédiat matin et soir.',
    volumeOrWeight: '100 ml',
    stock: 40,
    isActive: true,
    isBestseller: false,
    isNew: true,
    rating: 4.9,
    reviewsCount: 35
  },
  // 17. Graines de lin
  {
    id: 'prod-graines-de-lin',
    name: 'Graines de lin',
    category: 'produits_naturels',
    categoryLabel: 'Produits Naturels',
    price: 1250,
    costPrice: 750,
    image: '/src/assets/images/graines_de_lin_1794130681420.jpg',
    images: ['/src/assets/images/graines_de_lin_1794130681420.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Graines dorées riches en oméga-3 et mucilage hydratant pour soin capillaire.',
    fullDesc: 'Idéales pour préparer votre gel capillaire maison bouclant et fortifiant, ou à intégrer dans une alimentation bien-être saine.',
    volumeOrWeight: '100 g',
    stock: 30,
    isActive: true,
    isBestseller: false,
    isNew: true,
    rating: 4.7,
    reviewsCount: 14
  },
  // 18. Graines de nigelle
  {
    id: 'prod-graines-de-nigelle',
    name: 'Graines de nigelle',
    category: 'produits_naturels',
    categoryLabel: 'Produits Naturels',
    price: 2000,
    costPrice: 1200,
    image: '/src/assets/images/graines_de_nigelle_1794130680415.jpg',
    images: ['/src/assets/images/graines_de_nigelle_1794130680415.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Graines de cumin noir (Habba Sawda) aux vertus bienfaisantes millénaires.',
    fullDesc: 'La graine de nigelle pure fortifie l\'organisme, renforce l\'immunité et s\'utilise en infusions tonifiantes ou soins traditionnels.',
    volumeOrWeight: '100 g',
    stock: 28,
    isActive: true,
    isBestseller: true,
    isNew: true,
    rating: 5.0,
    reviewsCount: 31
  },
  // 19. Huile d’avocat
  {
    id: 'prod-huile-avocat',
    name: 'Huile d’avocat',
    category: 'produits_naturels',
    categoryLabel: 'Produits Naturels',
    price: 3000,
    costPrice: 1800,
    image: '/src/assets/images/huile_avocat_pure_1794130682466.jpg',
    images: ['/src/assets/images/huile_avocat_pure_1794130682466.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Huile végétale ultra-nourrissante pour peaux sèches et pointes dévitalisées.',
    fullDesc: 'Pressée avec soin, l\'huile d\'avocat riche en vitamines A, D et E assouplit l\'épiderme et nourrit en profondeur les cheveux texturés.',
    volumeOrWeight: '100 ml',
    stock: 22,
    isActive: true,
    isBestseller: false,
    isNew: true,
    rating: 4.8,
    reviewsCount: 20
  },
  // 20. Huile de chanvre
  {
    id: 'prod-huile-chanvre',
    name: 'Huile de chanvre',
    category: 'produits_naturels',
    categoryLabel: 'Produits Naturels',
    price: 6000,
    costPrice: 3800,
    image: '/src/assets/images/huile_de_chanvre_1794130681744.jpg',
    images: ['/src/assets/images/huile_de_chanvre_1794130681744.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Élixir végétal apaisant et régénérant cutané anti-rougeurs.',
    fullDesc: 'Huile sèche prestigieuse gorgée d\'acides gras essentiels qui revitalise les peaux matures et apaise les tiraillements instantanément.',
    volumeOrWeight: '100 ml',
    stock: 15,
    isActive: true,
    isBestseller: false,
    isNew: true,
    rating: 4.9,
    reviewsCount: 18
  },
  // 21. Huile de nigelle
  {
    id: 'prod-huile-nigelle',
    name: 'Huile de nigelle',
    category: 'produits_naturels',
    categoryLabel: 'Produits Naturels',
    price: 5000,
    costPrice: 3200,
    image: '/src/assets/images/huile_de_nigelle_1794130683161.jpg',
    images: ['/src/assets/images/huile_de_nigelle_1794130683161.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Huile pure de cumin noir d\'Égypte pressée à froid, purifiante et fortifiante.',
    fullDesc: 'Trésor ancestral de beauté, l\'huile de nigelle assainit les peaux sujettes aux imperfections, régule le sébum et redonne vigueur aux cheveux.',
    volumeOrWeight: '100 ml',
    stock: 26,
    isActive: true,
    isBestseller: true,
    isNew: true,
    rating: 5.0,
    reviewsCount: 42
  },
  // 22. Musk en poudre
  {
    id: 'prod-musk-poudre',
    name: 'Musk en poudre',
    category: 'produits_naturels',
    categoryLabel: 'Produits Naturels',
    price: 1000,
    costPrice: 600,
    image: '/src/assets/images/musk_en_poudre_1794130684385.jpg',
    images: ['/src/assets/images/musk_en_poudre_1794130684385.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Poudre parfumée fine de musc blanc soyeux pour linge, armoires et soins.',
    fullDesc: 'Un sillage de pureté et de fraîcheur incomparable à saupoudrer délicatement sur vos linges précieux ou à intégrer dans vos rituels corporels.',
    volumeOrWeight: '50 g',
    stock: 35,
    isActive: true,
    isBestseller: false,
    isNew: true,
    rating: 4.9,
    reviewsCount: 27
  },
  // 23. Musk solide
  {
    id: 'prod-musk-solide',
    name: 'Musk solide',
    category: 'produits_naturels',
    categoryLabel: 'Produits Naturels',
    price: 2000,
    costPrice: 1200,
    image: '/src/assets/images/musk_solide_carre_1794130684392.jpg',
    images: ['/src/assets/images/musk_solide_carre_1794130684392.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Pain de musc ambré traditionnel à frotter sur les points de pulsation.',
    fullDesc: 'Ce carré de musc oriental authentique diffuse une fragrance sensuelle et propre durant des semaines. S\'utilise sur le corps ou dans vos dressings.',
    volumeOrWeight: 'À l’unité',
    stock: 40,
    isActive: true,
    isBestseller: true,
    isNew: true,
    rating: 5.0,
    reviewsCount: 39
  },
  // 24. Poudre de Nila bleu
  {
    id: 'prod-nila-bleu',
    name: 'Poudre de Nila bleu',
    category: 'produits_naturels',
    categoryLabel: 'Produits Naturels',
    price: 2250,
    costPrice: 1400,
    image: '/src/assets/images/poudre_nila_bleu_1794130684722.jpg',
    images: ['/src/assets/images/poudre_nila_bleu_1794130684722.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Pigment minéral saharien purifiant et unifiant pour masque éclat.',
    fullDesc: 'Secret de beauté saharien ancestral réputé pour estomper les taches pigmentaires, éclaircir les zones sombres (coudes, genoux) et uniformiser le teint.',
    volumeOrWeight: '200 g',
    stock: 24,
    isActive: true,
    isBestseller: true,
    isNew: true,
    rating: 4.9,
    reviewsCount: 33
  },
  // 25. Gant de crin
  {
    id: 'prod-gant-de-crin',
    name: 'Gant de crin',
    category: 'produits_naturels',
    categoryLabel: 'Produits Naturels',
    price: 1000,
    costPrice: 500,
    image: '/src/assets/images/gant_de_crin_kessa_1794130686883.jpg',
    images: ['/src/assets/images/gant_de_crin_kessa_1794130686883.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Gant kessa de gommage traditionnel pour hammam et rituel savon noir.',
    fullDesc: 'Indispensable compagnon de notre Savon Hamam, ce gant exfolie en douceur, débarrasse la peau des cellules mortes et stimule la circulation sanguine.',
    volumeOrWeight: 'À l’unité',
    stock: 50,
    isActive: true,
    isBestseller: true,
    isNew: true,
    rating: 4.9,
    reviewsCount: 46
  },
  // 26. Noix de cerneaux
  {
    id: 'prod-noix-cerneaux',
    name: 'Noix de cerneaux',
    category: 'produits_naturels',
    categoryLabel: 'Produits Naturels',
    price: 2000,
    costPrice: 1300,
    image: '/src/assets/images/noix_de_cerneaux_1794130687448.jpg',
    images: ['/src/assets/images/noix_de_cerneaux_1794130687448.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Cerneaux de noix croquants haut de gamme, énergisants et riches en nutriments.',
    fullDesc: 'Sélection rigoureuse de cerneaux de noix entiers et dorés, parfaits pour une collation saine et bienfaisante au quotidien.',
    volumeOrWeight: '100 g',
    stock: 25,
    isActive: true,
    isBestseller: false,
    isNew: true,
    rating: 4.8,
    reviewsCount: 15
  },
  // --- CATÉGORIE : ÉPICERIE & GOURMANDISES ---
  // 27. Pistaches
  {
    id: 'prod-pistaches',
    name: 'Pistaches',
    category: 'epicerie_gourmandises',
    categoryLabel: 'Épicerie & Gourmandises',
    price: 2500,
    costPrice: 1600,
    image: '/src/assets/images/pistaches_grillees_1794130688357.jpg',
    images: ['/src/assets/images/pistaches_grillees_1794130688357.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Pistaches grillées délicatement salées de première qualité, fraîches et savoureuses.',
    fullDesc: 'Pistaches d\'exception croquantes et goûteuses, idéales pour vos pauses gourmandes raffinées et réceptions élégantes.',
    volumeOrWeight: '100 g',
    stock: 30,
    isActive: true,
    isBestseller: true,
    isNew: true,
    rating: 5.0,
    reviewsCount: 38
  },
  // 28. Fruits séchés
  {
    id: 'prod-fruits-seches',
    name: 'Fruits séchés',
    category: 'epicerie_gourmandises',
    categoryLabel: 'Épicerie & Gourmandises',
    price: 3500,
    costPrice: 2200,
    image: '/src/assets/images/fruits_seches_mix_1794130688096.jpg',
    images: ['/src/assets/images/fruits_seches_mix_1794130688096.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Mélange savoureux de fruits séchés premium (abricots, dattes, figues et raisins).',
    fullDesc: 'Une sélection moelleuse et naturelle sans sucre ajouté pour faire le plein de vitalité et d\'énergie saine au quotidien.',
    volumeOrWeight: '250 g',
    stock: 22,
    isActive: true,
    isBestseller: false,
    isNew: true,
    rating: 4.9,
    reviewsCount: 24
  },
  // 29. Fruits confits
  {
    id: 'prod-fruits-confits',
    name: 'Fruits confits',
    category: 'epicerie_gourmandises',
    categoryLabel: 'Épicerie & Gourmandises',
    price: 2000,
    costPrice: 1250,
    image: '/src/assets/images/fruits_confits_dakar_1794130690082.jpg',
    images: ['/src/assets/images/fruits_confits_dakar_1794130690082.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Délices de fruits confits traditionnels aux arômes gourmands et sucrés.',
    fullDesc: 'Bouchées colorées et fondantes confectionnées selon le savoir-faire confiseur pour accompagner le thé à la menthe et vos réceptions.',
    volumeOrWeight: '100 g',
    stock: 20,
    isActive: true,
    isBestseller: false,
    isNew: true,
    rating: 4.7,
    reviewsCount: 16
  },
  // 30. Cannelle
  {
    id: 'prod-cannelle',
    name: 'Cannelle',
    category: 'epicerie_gourmandises',
    categoryLabel: 'Épicerie & Gourmandises',
    price: 2000,
    costPrice: 1200,
    image: '/src/assets/images/cannelle_batons_1794130689867.jpg',
    images: ['/src/assets/images/cannelle_batons_1794130689867.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Véritables bâtons de cannelle parfumée aux notes chaudes et boisées.',
    fullDesc: 'Écorce de cannelle d\'une intensité aromatique remarquable pour parfumer vos thés, cafés, desserts et préparations traditionnelles.',
    volumeOrWeight: '200 g',
    stock: 28,
    isActive: true,
    isBestseller: false,
    isNew: true,
    rating: 5.0,
    reviewsCount: 22
  },
  // 31. Encens Oud
  {
    id: 'prod-encens-oud',
    name: 'Encens Oud',
    category: 'epicerie_gourmandises',
    categoryLabel: 'Épicerie & Gourmandises',
    price: 4000,
    costPrice: 2500,
    image: '/src/assets/images/encens_oud_bakhoor_1794130690394.jpg',
    images: ['/src/assets/images/encens_oud_bakhoor_1794130690394.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Bakhoor traditionnel de copeaux d\'oud enrichis d\'essences aromatiques nobles.',
    fullDesc: 'À consumer sur charbon ardent pour embaumer votre demeure d\'un voile prestigieux, chaleureux et accueillant selon la tradition du thiouraye sénégalais.',
    volumeOrWeight: 'À l’unité',
    stock: 35,
    isActive: true,
    isBestseller: true,
    isNew: true,
    rating: 5.0,
    reviewsCount: 47
  },
  // --- CATÉGORIE : COFFRETS & PARFUMERIE ---
  // 32. Pack Musc + Oud
  {
    id: 'prod-pack-musc-oud',
    name: 'Pack Musc + Oud',
    category: 'coffrets_parfumerie',
    categoryLabel: 'Coffrets & Parfumerie',
    price: 10000,
    costPrice: 6200,
    image: '/src/assets/images/pack_coffret_musc_oud_1794130690302.jpg',
    images: ['/src/assets/images/pack_coffret_musc_oud_1794130690302.jpg'],
    isVerifiedPhoto: true,
    photoVerificationStatus: 'verified',
    shortDesc: 'Coffret d’exception réunissant trois créations harmonieuses de musc pur et d\'oud royal.',
    fullDesc: 'Le cadeau idéal ou le rituel ultime de raffinement : comprend 3 essences et soins complémentaires de musc délicat et oud noble présentés dans un coffret de prestige.',
    volumeOrWeight: 'Coffret de 3',
    stock: 25,
    isActive: true,
    isBestseller: true,
    isNew: true,
    rating: 5.0,
    reviewsCount: 36
  }
];


export const DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'dk-centre', name: 'Dakar Centre / Plateau / Fann / Point E / Médina', fee: 2000, delay: 'Livraison express (2h à 4h)' },
  { id: 'dk-almadies', name: 'Dakar Almadies / Ngor / Ouakam / Yoff / Mermoz', fee: 2500, delay: 'Livraison express (2h à 4h)' },
  { id: 'dk-banlieue', name: 'Banlieue Dakar (Pikine, Guédiawaye, Keur Massar, Rufisque)', fee: 3000, delay: 'Livraison sous 24h ouvrées' },
  { id: 'thies-mbour', name: 'Thiès / Mbour / Saly / Somone', fee: 4000, delay: 'Livraison sous 24h à 48h' },
  { id: 'saint-louis', name: 'Saint-Louis / Touba / Kaolack', fee: 5000, delay: 'Livraison sous 48h' },
  { id: 'autres-regions', name: 'Autres Régions (Ziguinchor, Kolda, Tambacounda, etc.)', fee: 6000, delay: 'Expédition sécurisée sous 72h' }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Aïssatou Diop',
    city: 'Dakar (Almadies)',
    rating: 5,
    date: 'Hier',
    productName: 'Si Armani',
    comment: 'Parfum d’une tenue incroyable à seulement 8 000 FCFA ! Commandé le matin sur WhatsApp au 76 140 34 64 et reçu en début d’après-midi à Almadies.'
  },
  {
    id: 'rev-2',
    author: 'Mariama Sow',
    city: 'Dakar (Point E)',
    rating: 5,
    date: 'Il y a 2 jours',
    productName: 'Savon Hamam (5 kg)',
    comment: 'Le lot de 5 kg de Savon Hamam à 8 500 FCFA est une excellente affaire ! Très bonne qualité, ma peau est douce et propre après le gommage.'
  },
  {
    id: 'rev-3',
    author: 'Cheikh Tidiane Ndiaye',
    city: 'Thiès',
    rating: 5,
    date: 'Il y a 4 jours',
    productName: 'Ameer Oud & Moussouf Marron',
    comment: 'J’ai pris 2 parfums (16 000 FCFA au total). Le contact WhatsApp est très réactif et le paiement Wave a été immédiat. Je recommande Fatima Shop.'
  },
  {
    id: 'rev-4',
    author: 'Fatou Bintou Cissé',
    city: 'Dakar (Mermoz)',
    rating: 5,
    date: 'Il y a 1 semaine',
    productName: 'Oud Satin Mood',
    comment: 'Rapport qualité-prix imbattable. 8 000 FCFA pour une telle senteur, c’est parfait. Service au top.'
  }
];

export const INITIAL_SETTINGS: ShopSettings = {
  shopName: 'FATIMA SHOP',
  slogan: 'Votre beauté, notre passion',
  whatsappNumber: '221761403464', // Official WhatsApp number: +221 76 140 34 64
  displayPhone: '+221 76 140 34 64',
  emailContact: 'contact@fatimashop.sn',
  instagramHandle: '@fatimashop.sn',
  tiktokHandle: '@fatimashop_officiel',
  address: 'Boutique FATIMA SHOP, Dakar, Sénégal',
  freeDeliveryThreshold: 60000,
  deliveryZones: DELIVERY_ZONES,
  termsAndConditions: 'Paiement à la livraison ou par Wave / Orange Money après confirmation. Retours acceptés sous 48h si flacon non entamé.'
};

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-fatima10',
    code: 'FATIMA10',
    type: 'percentage',
    value: 10,
    minPurchase: 16000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 100,
    timesUsed: 14,
    isActive: true
  },
  {
    id: 'promo-bienvenue',
    code: 'BIENVENUE',
    type: 'fixed',
    value: 1000,
    minPurchase: 8000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 50,
    timesUsed: 23,
    isActive: true
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-admin-1',
    username: 'admin',
    fullName: 'Fatima Ndiaye (Propriétaire)',
    role: 'super_admin',
    email: 'direction@fatimashop.sn',
    passwordHash: 'fatima2026', // Plain/hash match
    lastLogin: new Date().toISOString()
  },
  {
    id: 'usr-admin-2',
    username: 'gerante',
    fullName: 'Aïda Diallo (Gérante Boutique)',
    role: 'gerante',
    email: 'aida@fatimashop.sn',
    passwordHash: 'admin123',
    lastLogin: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
  }
];

// Rich set of real store orders across current day, past week, past month
const now = Date.now();
const oneHour = 3600 * 1000;
const oneDay = 24 * oneHour;

export const INITIAL_STORE_ORDERS: Order[] = [
  {
    id: 'FS-9842',
    createdAt: new Date(now - 45 * 60 * 1000).toISOString(), // 45 mins ago today
    customer: {
      fullName: 'Aïssatou Diop',
      phone: '+221 77 450 12 34',
      email: 'aissatou.diop@gmail.com',
      region: 'Dakar',
      cityOrArea: 'Dakar Almadies',
      address: 'Route des Almadies, Immeuble Horizon',
      notes: 'Appeler avant de monter svp'
    },
    items: [
      {
        productId: 'prod-si-armani',
        name: 'Si Armani',
        price: 8000,
        costPrice: 5200,
        quantity: 2,
        image: '/src/assets/images/hero_fatima_shop_1794063044096.jpg'
      },
      {
        productId: 'prod-savon-hamam-5kg',
        name: 'Savon Hamam',
        price: 8500,
        costPrice: 4500,
        quantity: 1,
        image: '/src/assets/images/soap_hammam_noir_1794063045937.jpg'
      }
    ],
    subtotal: 24500,
    deliveryFee: 2500,
    total: 27000,
    paymentMethod: 'wave',
    paymentStatus: 'confirme',
    paymentConfirmedAt: new Date(now - 30 * 60 * 1000).toISOString(),
    status: 'en_preparation',
    deliveryZoneId: 'dk-almadies',
    deliveryDate: new Date(now + 2 * oneHour).toISOString()
  },
  {
    id: 'FS-9831',
    createdAt: new Date(now - 3 * oneHour).toISOString(), // Today
    customer: {
      fullName: 'Mouhamed Fall',
      phone: '+221 78 890 12 34',
      region: 'Thiès',
      cityOrArea: 'Thiès Ville',
      address: 'Quartier Randoulène Sud',
      notes: 'Livraison l’après-midi'
    },
    items: [
      {
        productId: 'prod-ameer-oud',
        name: 'Ameer Oud',
        price: 8000,
        costPrice: 5100,
        quantity: 2,
        image: '/src/assets/images/perfume_oriental_gold_1794063044566.jpg'
      },
      {
        productId: 'prod-mussouf-marron',
        name: 'Moussouf Marron',
        price: 8000,
        costPrice: 5000,
        quantity: 1,
        image: '/src/assets/images/perfume_oriental_gold_1794063044566.jpg'
      }
    ],
    subtotal: 24000,
    deliveryFee: 4000,
    total: 28000,
    paymentMethod: 'cod',
    paymentStatus: 'en_attente',
    status: 'confirmee',
    deliveryZoneId: 'thies-mbour',
    deliveryDate: new Date(now + oneDay).toISOString()
  },
  {
    id: 'FS-9810',
    createdAt: new Date(now - oneDay * 2).toISOString(), // 2 days ago (this week)
    customer: {
      fullName: 'Mariama Sow',
      phone: '+221 76 654 98 70',
      email: 'mariama.sow@yahoo.fr',
      region: 'Dakar',
      cityOrArea: 'Dakar Centre / Point E',
      address: 'Rue 7, Point E',
      notes: 'À laisser à la réception'
    },
    items: [
      {
        productId: 'prod-savon-hamam-5kg',
        name: 'Savon Hamam',
        price: 8500,
        costPrice: 4500,
        quantity: 2,
        image: '/src/assets/images/soap_hammam_noir_1794063045937.jpg'
      }
    ],
    subtotal: 17000,
    deliveryFee: 2000,
    total: 19000,
    paymentMethod: 'orange_money',
    paymentStatus: 'confirme',
    paymentConfirmedAt: new Date(now - oneDay * 2).toISOString(),
    status: 'livree',
    deliveryZoneId: 'dk-centre',
    deliveryDate: new Date(now - oneDay * 2).toISOString()
  },
  {
    id: 'FS-9792',
    createdAt: new Date(now - oneDay * 4).toISOString(), // This week
    customer: {
      fullName: 'Cheikh Tidiane Ndiaye',
      phone: '+221 77 333 44 55',
      region: 'Dakar',
      cityOrArea: 'Dakar Plateau',
      address: 'Avenue Pompidou, Immeuble Régal'
    },
    items: [
      {
        productId: 'prod-le-male-elixir',
        name: 'Le Mâle Élixir',
        price: 8000,
        costPrice: 5300,
        quantity: 3,
        image: '/src/assets/images/perfume_oriental_gold_1794063044566.jpg'
      },
      {
        productId: 'prod-lacoste-noir',
        name: 'Lacoste Noir',
        price: 8000,
        costPrice: 5000,
        quantity: 1,
        image: '/src/assets/images/perfume_oriental_gold_1794063044566.jpg'
      }
    ],
    subtotal: 32000,
    deliveryFee: 2000,
    total: 34000,
    paymentMethod: 'wave',
    paymentStatus: 'confirme',
    paymentConfirmedAt: new Date(now - oneDay * 4).toISOString(),
    status: 'livree',
    deliveryZoneId: 'dk-centre',
    deliveryDate: new Date(now - oneDay * 3).toISOString()
  },
  {
    id: 'FS-9750',
    createdAt: new Date(now - oneDay * 10).toISOString(), // This month
    customer: {
      fullName: 'Fatou Bintou Cissé',
      phone: '+221 77 123 78 90',
      region: 'Dakar',
      cityOrArea: 'Mermoz',
      address: 'Cité Keur Gorgui, Immeuble Mariama'
    },
    items: [
      {
        productId: 'prod-oud-satin-mood',
        name: 'Oud Satin Mood',
        price: 8000,
        costPrice: 5200,
        quantity: 1,
        image: '/src/assets/images/hero_fatima_shop_1794063044096.jpg'
      },
      {
        productId: 'prod-diable',
        name: 'Diable',
        price: 8000,
        costPrice: 5000,
        quantity: 1,
        image: '/src/assets/images/perfume_rose_oud_1794063045805.jpg'
      }
    ],
    subtotal: 16000,
    deliveryFee: 2500,
    total: 18500,
    paymentMethod: 'cod',
    paymentStatus: 'confirme',
    status: 'livree',
    deliveryZoneId: 'dk-almadies'
  },
  {
    id: 'FS-9705',
    createdAt: new Date(now - oneDay * 15).toISOString(), // This month
    customer: {
      fullName: 'Ousmane Ba',
      phone: '+221 70 888 99 00',
      region: 'Saint-Louis',
      cityOrArea: 'Saint-Louis Île',
      address: 'Rue Blanchot'
    },
    items: [
      {
        productId: 'prod-oud-madhila',
        name: 'Oud Madhila',
        price: 8000,
        costPrice: 5100,
        quantity: 2,
        image: '/src/assets/images/perfume_rose_oud_1794063045805.jpg'
      }
    ],
    subtotal: 16000,
    deliveryFee: 5000,
    total: 21000,
    paymentMethod: 'wave',
    paymentStatus: 'echoue',
    status: 'annulee',
    deliveryZoneId: 'saint-louis',
    deliveryNotes: 'Paiement Wave non reçu après 48h'
  }
];

export const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-savon-hamam-tarif',
    type: 'new_order',
    title: 'Tarif Officiel Savon Hamam 5 kg : 8 500 FCFA',
    message: 'Le nouveau tarif officiel de 8 500 FCFA pour 5 kg est appliqué sur l’ensemble de la boutique et du catalogue.',
    timestamp: new Date(now - 10 * 60 * 1000).toISOString(),
    read: true,
    productId: 'prod-savon-hamam-5kg'
  },
  {
    id: 'notif-1',
    type: 'new_order',
    title: 'Nouvelle commande #FS-9842',
    message: 'Aïssatou Diop a commandé 2x Si Armani et 1x Savon Hamam (27 000 FCFA).',
    timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
    read: false,
    orderId: 'FS-9842'
  },
  {
    id: 'notif-2',
    type: 'payment_confirmed',
    title: 'Paiement Wave Confirmé',
    message: 'Paiement de 27 000 FCFA confirmé pour la commande #FS-9842.',
    timestamp: new Date(now - 30 * 60 * 1000).toISOString(),
    read: false,
    orderId: 'FS-9842'
  },
  {
    id: 'notif-3',
    type: 'low_stock',
    title: 'Alerte stock : Waredi',
    message: 'Il ne reste plus que 15 unités de Waredi en réserve.',
    timestamp: new Date(now - 6 * oneHour).toISOString(),
    read: true,
    productId: 'prod-waredi'
  }
];
