// /src/data/cities.ts
// Liste complète des villes de la République Démocratique du Congo par province - SANS DOUBLONS

export const citiesRDC = {
  // Kinshasa
  kinshasa: [
    'Kinshasa', 'Kalamu', 'Kasa-Vubu', 'Makala', 'Ngiri-Ngiri', 'Kintambo', 
    'Lingwala', 'Barumbu', 'Gombe', 'Bandalungwa', 'Bumbu', 'Matete', 
    'Ngaba', 'Lemba', 'Limete', 'Kisenso', 'Masina', 'Ndjili', 'Kimbanseke', 
    'Maluku', 'Nsele', 'Mont Ngafula', 'Selembao'
  ],

  // Kongo Central
  kongoCentral: [
    'Matadi', 'Boma', 'Muanda', 'Banana', 'Kasangulu', 'Kimpese', 'Lukula', 
    'Mbanza-Ngungu', 'Moanda', 'Seke-Banza', 'Songololo', 'Tshiembe'
  ],

  // Kwango
  kwango: [
    'Kenge', 'Kasongo-Lunda', 'Feshi', 'Kahemba', 'Kimbongo'
  ],

  // Kwilu
  kwilu: [
    'Kikwit', 'Bagata', 'Gungu', 'Idiofa', 'Mangai'
  ],

  // Mai-Ndombe
  maiNdombe: [
    'Inongo', 'Kiri', 'Kutu', 'Oshwe', 'Bolobo', 'Yumbi'
  ],

  // Équateur
  equateur: [
    'Mbandaka', 'Bikoro', 'Lukolela', 'Boende', 'Djolu'
  ],

  // Mongala
  mongala: [
    'Lisala', 'Bumba'
  ],

  // Nord-Ubangi
  nordUbangi: [
    'Gbadolite', 'Bosobolo', 'Mobayi-Mbongo'
  ],

  // Sud-Ubangi
  sudUbangi: [
    'Gemena', 'Budjala', 'Zongo'
  ],

  // Tshuapa
  tshuapa: [
    'Befale', 'Bokungu', 'Ikela', 'Monkoto'
  ],

  // Tshopo
  tshopo: [
    'Kisangani', 'Bafwasende', 'Banalia', 'Basoko', 'Isangi', 'Opala', 
    'Ubundu', 'Yahuma'
  ],

  // Bas-Uele
  basUele: [
    'Buta', 'Aketi', 'Bondo', 'Ango', 'Bambesa', 'Poko'
  ],

  // Haut-Uele
  hautUele: [
    'Isiro', 'Dungu', 'Faradje', 'Niangara', 'Rungu', 'Wamba', 'Watsa'
  ],

  // Ituri
  ituri: [
    'Bunia', 'Aru', 'Mahagi', 'Djugu', 'Irumu', 'Mambasa', 'Kambala'
  ],

  // Nord-Kivu
  nordKivu: [
    'Goma', 'Beni', 'Butembo', 'Kyangwali', 'Lubero', 'Manguredjipa', 
    'Masisi', 'Nyiragongo', 'Rutshuru', 'Walikale', 'Karisimbi'
  ],

  // Sud-Kivu
  sudKivu: [
    'Bukavu', 'Uvira', 'Baraka', 'Fizi', 'Kabare', 'Kalehe', 'Mwenga', 
    'Shabunda', 'Walungu'
  ],

  // Maniema
  maniema: [
    'Kindu', 'Kabambare', 'Kailo', 'Kasongo', 'Kibombo', 'Lubutu', 'Pangi', 'Punia'
  ],

  // Haut-Katanga
  hautKatanga: [
    'Lubumbashi', 'Kipushi', 'Kambove', 'Kasumbalesa', 'Likasi', 'Mutoshi', 
    'Panda', 'Ruwe', 'Sakania', 'Kakanda', 'Shinkolobwe'
  ],

  // Haut-Lomami
  hautLomami: [
    'Kamina', 'Bukama', 'Kabongo', 'Kaniama', 'Malemba Nkulu', 'Nyunzu'
  ],

  // Lualaba
  lualaba: [
    'Kolwezi', 'Dilala', 'Mutshatsha', 'Lubudi', 'Kapanga', 'Sandoa'
  ],

  // Tanganyika
  tanganyika: [
    'Kalemie', 'Kabalo', 'Kongolo', 'Manono', 'Ankoro', 'Kabondo Dianda', 
    'Kazembe', 'Mwana Muyombo', 'Pweto'
  ],

  // Sankuru
  sankuru: [
    'Lodja', 'Katako-Kombe', 'Kole', 'Lomela', 'Lubefu', 'Lusambo'
  ],

  // Kasaï
  kasai: [
    'Tshikapa', 'Ilebo', 'Kamonia', 'Luebo', 'Mweka'
  ],

  // Kasaï Central
  kasaiCentral: [
    'Kananga', 'Demba', 'Dibaya', 'Dimbelenge', 'Kazumba', 'Luiza'
  ],

  // Kasaï Oriental
  kasaiOriental: [
    'Mbuji-Mayi', 'Kabeya-Kamwanga', 'Katanda', 'Lupatapata', 'Miabi', 'Tshilenge'
  ],

  // Lomami
  lomami: [
    'Kabinda', 'Kamiji', 'Lubao', 'Luilu', 'Mwene-Ditu'
  ]
};

// VILLES PARTAGÉES (apparaissent dans plusieurs provinces)
export const sharedCities = {
  bandundu: ['Bandundu'], // Kwango & Kwilu
  bulungu: ['Bulungu'], // Kwango & Kwilu
  masiManimba: ['Masi-Manimba'], // Kwango & Kwilu
  mushie: ['Mushie'], // Kwango & Mai-Ndombe
  bongandanga: ['Bongandanga'], // Équateur & Mongala
  basankusu: ['Basankusu'], // Équateur & Mongala
  businga: ['Businga'], // Équateur & Nord-Ubangi
  yakoma: ['Yakoma'], // Équateur & Nord-Ubangi
  libenge: ['Libenge'], // Équateur & Sud-Ubangi
  moba: ['Moba'], // Tanganyika uniquement (supprimé du doublon)
  nyunzu: ['Nyunzu'] // Haut-Lomami & Tanganyika
};

// Liste plate de toutes les villes UNIQUES (pour la recherche)
export const allCities = Array.from(new Set([
  ...Object.values(citiesRDC).flat(),
  ...Object.values(sharedCities).flat()
]));

// Villes principales/majeures (pour les suggestions)
export const majorCities = [
  'Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Kananga', 'Kisangani', 
  'Bukavu', 'Goma', 'Kolwezi', 'Likasi', 'Matadi', 'Kikwit', 'Boma', 
  'Butembo', 'Mbandaka', 'Uvira', 'Kamina', 'Kindu', 'Isiro', 'Bunia', 'Gemena'
];

// Villes populaires du Haut-Katanga (pour compatibilité)
export const hautKatangaCities = citiesRDC.hautKatanga;