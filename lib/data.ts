export type Player = {
  id: number;
  numero: number;
  prenom: string;
  nom: string;
  dateNaissance: string;
  poste: string;
  taille: string;
  photo?: string;
};

export type TeamCategory = "Cadets" | "Juniors" | "Seniors";

export type Club = {
  id: string;
  nom: string;
  acronyme: string;
  fondation: string;
  ville: string;
  description: string;
  logo: string;
  hero: string;
  couleurPrimaire: string;
  couleurSecondaire: string;
  equipes: Record<TeamCategory, Player[]>;
  stats: { label: string; value: string }[];
  social?: { facebook?: string; youtube?: string };
};

// ─── Jaguar Académie Guinée ──────────────────────────────────────────────────
const jagCadets: Player[] = [
  { id: 1,  numero: 1,  prenom: "Mamadou",     nom: "Diallo",       dateNaissance: "2009-03-14", poste: "Gardien",   taille: "1.78 m" },
  { id: 2,  numero: 2,  prenom: "Ibrahima",    nom: "Bah",          dateNaissance: "2009-07-22", poste: "Défenseur", taille: "1.72 m" },
  { id: 3,  numero: 3,  prenom: "Sekou",       nom: "Camara",       dateNaissance: "2010-01-05", poste: "Défenseur", taille: "1.70 m" },
  { id: 4,  numero: 4,  prenom: "Abdoulaye",   nom: "Sylla",        dateNaissance: "2009-11-18", poste: "Défenseur", taille: "1.74 m" },
  { id: 5,  numero: 5,  prenom: "Oumar",       nom: "Touré",        dateNaissance: "2010-04-30", poste: "Défenseur", taille: "1.68 m" },
  { id: 6,  numero: 6,  prenom: "Lansana",     nom: "Kouyaté",      dateNaissance: "2009-08-12", poste: "Milieu",    taille: "1.75 m" },
  { id: 7,  numero: 7,  prenom: "Alpha",       nom: "Barry",        dateNaissance: "2010-02-19", poste: "Milieu",    taille: "1.71 m" },
  { id: 8,  numero: 8,  prenom: "Souleymane",  nom: "Keita",        dateNaissance: "2009-06-03", poste: "Milieu",    taille: "1.73 m" },
  { id: 9,  numero: 9,  prenom: "Mohamed",     nom: "Fofana",       dateNaissance: "2010-09-25", poste: "Attaquant", taille: "1.76 m" },
  { id: 10, numero: 10, prenom: "Thierno",     nom: "Baldé",        dateNaissance: "2009-12-08", poste: "Attaquant", taille: "1.74 m" },
  { id: 11, numero: 11, prenom: "Mamou",       nom: "Sow",          dateNaissance: "2010-05-17", poste: "Attaquant", taille: "1.69 m" },
  { id: 12, numero: 12, prenom: "Abdourahmane",nom: "Diallo",       dateNaissance: "2009-10-22", poste: "Gardien",   taille: "1.80 m" },
  { id: 13, numero: 13, prenom: "Elhadj",      nom: "Barry",        dateNaissance: "2010-03-11", poste: "Défenseur", taille: "1.71 m" },
  { id: 14, numero: 14, prenom: "Naby",        nom: "Soumah",       dateNaissance: "2009-07-04", poste: "Milieu",    taille: "1.72 m" },
  { id: 15, numero: 15, prenom: "Ousmane",     nom: "Bangoura",     dateNaissance: "2010-01-28", poste: "Attaquant", taille: "1.73 m" },
  { id: 16, numero: 16, prenom: "Karamo",      nom: "Condé",        dateNaissance: "2009-08-16", poste: "Défenseur", taille: "1.75 m" },
  { id: 17, numero: 17, prenom: "Moussa",      nom: "Diakité",      dateNaissance: "2010-06-09", poste: "Milieu",    taille: "1.70 m" },
  { id: 18, numero: 18, prenom: "Saliou",      nom: "Bah",          dateNaissance: "2009-11-01", poste: "Attaquant", taille: "1.77 m" },
  { id: 19, numero: 19, prenom: "Tidiane",     nom: "Camara",       dateNaissance: "2010-04-14", poste: "Milieu",    taille: "1.71 m" },
  { id: 20, numero: 20, prenom: "Amadou",      nom: "Bah",          dateNaissance: "2009-09-27", poste: "Défenseur", taille: "1.73 m" },
  { id: 21, numero: 21, prenom: "Ibrahima",    nom: "Kourouma",     dateNaissance: "2010-02-03", poste: "Attaquant", taille: "1.72 m" },
  { id: 22, numero: 22, prenom: "Fode",        nom: "Mansaré",      dateNaissance: "2009-05-20", poste: "Milieu",    taille: "1.74 m" },
  { id: 23, numero: 23, prenom: "Daouda",      nom: "Kouyaté",      dateNaissance: "2010-08-07", poste: "Défenseur", taille: "1.70 m" },
  { id: 24, numero: 24, prenom: "Mamadi",      nom: "Sanoh",        dateNaissance: "2009-03-31", poste: "Gardien",   taille: "1.79 m" },
  { id: 25, numero: 25, prenom: "Boubacar",    nom: "Diallo",       dateNaissance: "2010-07-15", poste: "Milieu",    taille: "1.71 m" },
  { id: 26, numero: 26, prenom: "Yaya",        nom: "Sylla",        dateNaissance: "2009-12-22", poste: "Attaquant", taille: "1.75 m" },
  { id: 27, numero: 27, prenom: "Bangaly",     nom: "Condé",        dateNaissance: "2010-01-11", poste: "Défenseur", taille: "1.72 m" },
  { id: 28, numero: 28, prenom: "Aboubacar",   nom: "Touré",        dateNaissance: "2009-06-29", poste: "Milieu",    taille: "1.73 m" },
  { id: 29, numero: 29, prenom: "Mamadou Lamine",nom: "Diallo",     dateNaissance: "2010-09-18", poste: "Attaquant", taille: "1.74 m" },
  { id: 30, numero: 30, prenom: "Hamidou",     nom: "Barry",        dateNaissance: "2009-04-05", poste: "Défenseur", taille: "1.71 m" },
  { id: 31, numero: 31, prenom: "Sory",        nom: "Bah",          dateNaissance: "2010-11-23", poste: "Milieu",    taille: "1.70 m" },
  { id: 32, numero: 32, prenom: "Dramane",     nom: "Camara",       dateNaissance: "2009-02-14", poste: "Attaquant", taille: "1.76 m" },
  { id: 33, numero: 33, prenom: "Mamadou Oury",nom: "Diallo",       dateNaissance: "2010-05-07", poste: "Défenseur", taille: "1.72 m" },
  { id: 34, numero: 34, prenom: "Siaka",       nom: "Keita",        dateNaissance: "2009-10-10", poste: "Milieu",    taille: "1.73 m" },
  { id: 35, numero: 35, prenom: "Kabine",      nom: "Kouyaté",      dateNaissance: "2010-07-01", poste: "Attaquant", taille: "1.71 m" },
  { id: 36, numero: 36, prenom: "Ibrahima Sory",nom: "Diallo",      dateNaissance: "2009-08-19", poste: "Gardien",   taille: "1.80 m" },
  { id: 37, numero: 37, prenom: "Seydouba",    nom: "Camara",       dateNaissance: "2010-03-28", poste: "Milieu",    taille: "1.72 m" },
];

const jagJuniors: Player[] = [
  { id: 101, numero: 1,  prenom: "Oumar",        nom: "Kouyaté",    dateNaissance: "2007-02-10", poste: "Gardien",   taille: "1.83 m" },
  { id: 102, numero: 2,  prenom: "Mamadou",      nom: "Camara",     dateNaissance: "2006-08-25", poste: "Défenseur", taille: "1.76 m" },
  { id: 103, numero: 3,  prenom: "Alpha Oumar",  nom: "Diallo",     dateNaissance: "2007-04-13", poste: "Défenseur", taille: "1.74 m" },
  { id: 104, numero: 4,  prenom: "Ibrahima",     nom: "Sylla",      dateNaissance: "2006-11-07", poste: "Défenseur", taille: "1.78 m" },
  { id: 105, numero: 5,  prenom: "Mohamed",      nom: "Bah",        dateNaissance: "2007-06-19", poste: "Défenseur", taille: "1.75 m" },
  { id: 106, numero: 6,  prenom: "Sekou",        nom: "Bangoura",   dateNaissance: "2006-03-28", poste: "Milieu",    taille: "1.77 m" },
  { id: 107, numero: 7,  prenom: "Abdoulaye",    nom: "Barry",      dateNaissance: "2007-09-04", poste: "Milieu",    taille: "1.73 m" },
  { id: 108, numero: 8,  prenom: "Lansana",      nom: "Condé",      dateNaissance: "2006-12-16", poste: "Milieu",    taille: "1.76 m" },
  { id: 109, numero: 9,  prenom: "Thierno",      nom: "Diallo",     dateNaissance: "2007-01-22", poste: "Attaquant", taille: "1.79 m" },
  { id: 110, numero: 10, prenom: "Naby",         nom: "Touré",      dateNaissance: "2006-07-11", poste: "Attaquant", taille: "1.76 m" },
  { id: 111, numero: 11, prenom: "Moussa",       nom: "Keita",      dateNaissance: "2007-03-05", poste: "Attaquant", taille: "1.74 m" },
  { id: 112, numero: 12, prenom: "Fode",         nom: "Camara",     dateNaissance: "2006-10-30", poste: "Gardien",   taille: "1.85 m" },
  { id: 113, numero: 13, prenom: "Saliou",       nom: "Diallo",     dateNaissance: "2007-05-18", poste: "Défenseur", taille: "1.75 m" },
  { id: 114, numero: 14, prenom: "Amadou",       nom: "Kouyaté",    dateNaissance: "2006-09-07", poste: "Milieu",    taille: "1.77 m" },
  { id: 115, numero: 15, prenom: "Elhadj",       nom: "Bah",        dateNaissance: "2007-02-25", poste: "Attaquant", taille: "1.76 m" },
  { id: 116, numero: 16, prenom: "Mamadou Lamine",nom: "Sylla",     dateNaissance: "2006-06-14", poste: "Défenseur", taille: "1.78 m" },
  { id: 117, numero: 17, prenom: "Boubacar",     nom: "Barry",      dateNaissance: "2007-11-02", poste: "Milieu",    taille: "1.74 m" },
  { id: 118, numero: 18, prenom: "Ibrahima Kalil",nom: "Diallo",    dateNaissance: "2006-04-20", poste: "Attaquant", taille: "1.77 m" },
  { id: 119, numero: 19, prenom: "Ousmane",      nom: "Camara",     dateNaissance: "2007-08-09", poste: "Milieu",    taille: "1.73 m" },
  { id: 120, numero: 20, prenom: "Yaya",         nom: "Condé",      dateNaissance: "2006-01-28", poste: "Défenseur", taille: "1.76 m" },
  { id: 121, numero: 21, prenom: "Bangaly",      nom: "Keita",      dateNaissance: "2007-07-16", poste: "Attaquant", taille: "1.75 m" },
  { id: 122, numero: 22, prenom: "Daouda",       nom: "Bah",        dateNaissance: "2006-02-03", poste: "Milieu",    taille: "1.77 m" },
  { id: 123, numero: 23, prenom: "Mamadi",       nom: "Diallo",     dateNaissance: "2007-10-21", poste: "Défenseur", taille: "1.74 m" },
  { id: 124, numero: 24, prenom: "Tidiane",      nom: "Kouyaté",    dateNaissance: "2006-05-09", poste: "Gardien",   taille: "1.82 m" },
  { id: 125, numero: 25, prenom: "Hamidou",      nom: "Camara",     dateNaissance: "2007-12-14", poste: "Milieu",    taille: "1.75 m" },
  { id: 126, numero: 26, prenom: "Sory",         nom: "Diallo",     dateNaissance: "2006-08-31", poste: "Attaquant", taille: "1.78 m" },
  { id: 127, numero: 27, prenom: "Dramane",      nom: "Barry",      dateNaissance: "2007-04-07", poste: "Défenseur", taille: "1.74 m" },
  { id: 128, numero: 28, prenom: "Kabine",       nom: "Sylla",      dateNaissance: "2006-11-25", poste: "Milieu",    taille: "1.76 m" },
  { id: 129, numero: 29, prenom: "Siaka",        nom: "Condé",      dateNaissance: "2007-03-18", poste: "Attaquant", taille: "1.75 m" },
  { id: 130, numero: 30, prenom: "Aboubacar",    nom: "Bah",        dateNaissance: "2006-09-12", poste: "Défenseur", taille: "1.77 m" },
  { id: 131, numero: 31, prenom: "Karamo",       nom: "Camara",     dateNaissance: "2007-06-27", poste: "Milieu",    taille: "1.73 m" },
  { id: 132, numero: 32, prenom: "Souleymane",   nom: "Diallo",     dateNaissance: "2006-02-15", poste: "Attaquant", taille: "1.76 m" },
  { id: 133, numero: 33, prenom: "Mamadou Oury", nom: "Barry",      dateNaissance: "2007-10-03", poste: "Défenseur", taille: "1.75 m" },
  { id: 134, numero: 34, prenom: "Ibrahima Sory",nom: "Keita",      dateNaissance: "2006-07-20", poste: "Milieu",    taille: "1.77 m" },
  { id: 135, numero: 35, prenom: "Alpha",        nom: "Kouyaté",    dateNaissance: "2007-01-08", poste: "Attaquant", taille: "1.74 m" },
  { id: 136, numero: 36, prenom: "Seydouba",     nom: "Diallo",     dateNaissance: "2006-12-29", poste: "Gardien",   taille: "1.81 m" },
  { id: 137, numero: 37, prenom: "Oumar Fanta",  nom: "Bah",        dateNaissance: "2007-08-14", poste: "Milieu",    taille: "1.75 m" },
  { id: 138, numero: 38, prenom: "Mamadou Alpha",nom: "Camara",     dateNaissance: "2006-04-01", poste: "Défenseur", taille: "1.76 m" },
  { id: 139, numero: 39, prenom: "Lamine",       nom: "Condé",      dateNaissance: "2007-09-22", poste: "Attaquant", taille: "1.74 m" },
  { id: 140, numero: 40, prenom: "Cellou",       nom: "Diallo",     dateNaissance: "2006-05-30", poste: "Milieu",    taille: "1.76 m" },
  { id: 141, numero: 41, prenom: "Facine",       nom: "Barry",      dateNaissance: "2007-11-16", poste: "Défenseur", taille: "1.73 m" },
  { id: 142, numero: 42, prenom: "Mamadou Pathé",nom: "Diallo",     dateNaissance: "2006-03-05", poste: "Attaquant", taille: "1.77 m" },
  { id: 143, numero: 43, prenom: "Ibrahima Kalil",nom: "Camara",    dateNaissance: "2007-07-24", poste: "Milieu",    taille: "1.74 m" },
  { id: 144, numero: 44, prenom: "Oumar Balde",  nom: "Keita",      dateNaissance: "2006-01-13", poste: "Défenseur", taille: "1.75 m" },
];

const jagSeniors: Player[] = [
  { id: 201, numero: 1,  prenom: "Aboubacar",    nom: "Sylla",       dateNaissance: "2001-04-15", poste: "Gardien",   taille: "1.88 m", photo: "/images/players/jag/gardien.jpeg" },
  { id: 202, numero: 2,  prenom: "Mamadou",      nom: "Kouyaté",     dateNaissance: "2000-09-22", poste: "Défenseur", taille: "1.80 m", photo: "/images/players/jag/2.jpeg" },
  { id: 203, numero: 3,  prenom: "Ibrahima",     nom: "Diallo",      dateNaissance: "2001-03-08", poste: "Défenseur", taille: "1.78 m", photo: "/images/players/jag/3.jpeg" },
  { id: 204, numero: 4,  prenom: "Lansana",      nom: "Camara",      dateNaissance: "2000-07-17", poste: "Défenseur", taille: "1.82 m", photo: "/images/players/jag/4.jpeg" },
  { id: 205, numero: 5,  prenom: "Mohamed",      nom: "Condé",       dateNaissance: "2001-11-30", poste: "Défenseur", taille: "1.79 m", photo: "/images/players/jag/5.jpeg" },
  { id: 206, numero: 6,  prenom: "Sekou",        nom: "Touré",       dateNaissance: "2000-05-14", poste: "Milieu",    taille: "1.76 m", photo: "/images/players/jag/6.jpeg" },
  { id: 207, numero: 7,  prenom: "Alpha",        nom: "Diallo",      dateNaissance: "2001-01-27", poste: "Milieu",    taille: "1.74 m", photo: "/images/players/jag/7.jpeg" },
  { id: 208, numero: 8,  prenom: "Naby",         nom: "Barry",       dateNaissance: "2000-08-05", poste: "Milieu",    taille: "1.77 m", photo: "/images/players/jag/8.jpeg" },
  { id: 209, numero: 9,  prenom: "Thierno",      nom: "Keita",       dateNaissance: "2001-06-19", poste: "Attaquant", taille: "1.81 m", photo: "/images/players/jag/9.jpeg" },
  { id: 210, numero: 10, prenom: "Moussa",       nom: "Bah",         dateNaissance: "2000-12-03", poste: "Attaquant", taille: "1.79 m", photo: "/images/players/jag/10.jpeg" },
  { id: 211, numero: 11, prenom: "Saliou",       nom: "Bangoura",    dateNaissance: "2001-02-21", poste: "Attaquant", taille: "1.76 m", photo: "/images/players/jag/11.jpeg" },
  { id: 212, numero: 12, prenom: "Ousmane",      nom: "Kouyaté",     dateNaissance: "2000-10-09", poste: "Gardien",   taille: "1.86 m", photo: "/images/players/jag/12.jpeg" },
  { id: 213, numero: 13, prenom: "Fode",         nom: "Sylla",       dateNaissance: "2001-07-28", poste: "Défenseur", taille: "1.80 m", photo: "/images/players/jag/13.jpeg" },
  { id: 214, numero: 14, prenom: "Amadou",       nom: "Diallo",      dateNaissance: "2000-04-16", poste: "Milieu",    taille: "1.77 m", photo: "/images/players/jag/14.jpeg" },
  { id: 215, numero: 15, prenom: "Elhadj",       nom: "Camara",      dateNaissance: "2001-09-04", poste: "Attaquant", taille: "1.78 m", photo: "/images/players/jag/15.jpeg" },
  { id: 216, numero: 16, prenom: "Daouda",       nom: "Barry",       dateNaissance: "2000-03-23", poste: "Défenseur", taille: "1.79 m", photo: "/images/players/jag/16.jpeg" },
  { id: 217, numero: 17, prenom: "Mamadi",       nom: "Condé",       dateNaissance: "2001-08-11", poste: "Milieu",    taille: "1.75 m", photo: "/images/players/jag/17.jpeg" },
  { id: 218, numero: 18, prenom: "Ibrahima Sory",nom: "Bah",         dateNaissance: "2000-06-30", poste: "Attaquant", taille: "1.80 m", photo: "/images/players/jag/18.jpeg" },
];

// ─── Club Atlético de Colèah ─────────────────────────────────────────────────
const atleticoCadets: Player[] = [
  { id: 301, numero: 1,  prenom: "Mamadou",      nom: "Diallo",      dateNaissance: "2009-05-10", poste: "Gardien",   taille: "1.77 m" },
  { id: 302, numero: 2,  prenom: "Ibrahima",     nom: "Sylla",       dateNaissance: "2009-08-23", poste: "Défenseur", taille: "1.73 m" },
  { id: 303, numero: 3,  prenom: "Sekou",        nom: "Barry",       dateNaissance: "2010-02-07", poste: "Défenseur", taille: "1.71 m" },
  { id: 304, numero: 4,  prenom: "Abdoulaye",    nom: "Camara",      dateNaissance: "2009-11-20", poste: "Défenseur", taille: "1.75 m" },
  { id: 305, numero: 5,  prenom: "Oumar",        nom: "Condé",       dateNaissance: "2010-04-14", poste: "Défenseur", taille: "1.69 m" },
  { id: 306, numero: 6,  prenom: "Lansana",      nom: "Bah",         dateNaissance: "2009-09-01", poste: "Milieu",    taille: "1.76 m" },
  { id: 307, numero: 7,  prenom: "Alpha",        nom: "Kouyaté",     dateNaissance: "2010-01-28", poste: "Milieu",    taille: "1.70 m" },
  { id: 308, numero: 8,  prenom: "Souleymane",   nom: "Diallo",      dateNaissance: "2009-07-15", poste: "Milieu",    taille: "1.74 m" },
  { id: 309, numero: 9,  prenom: "Mohamed",      nom: "Touré",       dateNaissance: "2010-10-02", poste: "Attaquant", taille: "1.77 m" },
  { id: 310, numero: 10, prenom: "Thierno",      nom: "Barry",       dateNaissance: "2009-12-19", poste: "Attaquant", taille: "1.75 m" },
  { id: 311, numero: 11, prenom: "Mamou",        nom: "Keita",       dateNaissance: "2010-06-06", poste: "Attaquant", taille: "1.70 m" },
  { id: 312, numero: 12, prenom: "Abdourahmane", nom: "Sylla",       dateNaissance: "2009-10-24", poste: "Gardien",   taille: "1.81 m" },
  { id: 313, numero: 13, prenom: "Elhadj",       nom: "Camara",      dateNaissance: "2010-03-13", poste: "Défenseur", taille: "1.72 m" },
  { id: 314, numero: 14, prenom: "Naby",         nom: "Diallo",      dateNaissance: "2009-07-07", poste: "Milieu",    taille: "1.73 m" },
  { id: 315, numero: 15, prenom: "Ousmane",      nom: "Barry",       dateNaissance: "2010-01-31", poste: "Attaquant", taille: "1.74 m" },
  { id: 316, numero: 16, prenom: "Karamo",       nom: "Bah",         dateNaissance: "2009-08-18", poste: "Défenseur", taille: "1.76 m" },
  { id: 317, numero: 17, prenom: "Moussa",       nom: "Condé",       dateNaissance: "2010-05-22", poste: "Milieu",    taille: "1.71 m" },
  { id: 318, numero: 18, prenom: "Saliou",       nom: "Kouyaté",     dateNaissance: "2009-11-09", poste: "Attaquant", taille: "1.78 m" },
  { id: 319, numero: 19, prenom: "Tidiane",      nom: "Diallo",      dateNaissance: "2010-04-27", poste: "Milieu",    taille: "1.72 m" },
  { id: 320, numero: 20, prenom: "Amadou",       nom: "Sylla",       dateNaissance: "2009-09-15", poste: "Défenseur", taille: "1.74 m" },
  { id: 321, numero: 21, prenom: "Ibrahima",     nom: "Kourouma",    dateNaissance: "2010-02-21", poste: "Attaquant", taille: "1.73 m" },
  { id: 322, numero: 22, prenom: "Fode",         nom: "Barry",       dateNaissance: "2009-06-03", poste: "Milieu",    taille: "1.75 m" },
  { id: 323, numero: 23, prenom: "Daouda",       nom: "Diallo",      dateNaissance: "2010-08-19", poste: "Défenseur", taille: "1.71 m" },
  { id: 324, numero: 24, prenom: "Mamadi",       nom: "Bah",         dateNaissance: "2009-04-08", poste: "Gardien",   taille: "1.80 m" },
  { id: 325, numero: 25, prenom: "Boubacar",     nom: "Keita",       dateNaissance: "2010-07-26", poste: "Milieu",    taille: "1.72 m" },
  { id: 326, numero: 26, prenom: "Yaya",         nom: "Camara",      dateNaissance: "2009-12-14", poste: "Attaquant", taille: "1.76 m" },
  { id: 327, numero: 27, prenom: "Bangaly",      nom: "Diallo",      dateNaissance: "2010-01-02", poste: "Défenseur", taille: "1.73 m" },
  { id: 328, numero: 28, prenom: "Aboubacar",    nom: "Sylla",       dateNaissance: "2009-07-20", poste: "Milieu",    taille: "1.74 m" },
  { id: 329, numero: 29, prenom: "Mamadou Lamine",nom: "Barry",      dateNaissance: "2010-10-07", poste: "Attaquant", taille: "1.75 m" },
  { id: 330, numero: 30, prenom: "Hamidou",      nom: "Condé",       dateNaissance: "2009-05-25", poste: "Défenseur", taille: "1.72 m" },
  { id: 331, numero: 31, prenom: "Sory",         nom: "Kouyaté",     dateNaissance: "2010-11-11", poste: "Milieu",    taille: "1.71 m" },
  { id: 332, numero: 32, prenom: "Dramane",      nom: "Bah",         dateNaissance: "2009-03-04", poste: "Attaquant", taille: "1.77 m" },
  { id: 333, numero: 33, prenom: "Mamadou Oury", nom: "Diallo",      dateNaissance: "2010-06-18", poste: "Défenseur", taille: "1.73 m" },
  { id: 334, numero: 34, prenom: "Siaka",        nom: "Barry",       dateNaissance: "2009-10-31", poste: "Milieu",    taille: "1.74 m" },
  { id: 335, numero: 35, prenom: "Kabine",       nom: "Sylla",       dateNaissance: "2010-07-14", poste: "Attaquant", taille: "1.72 m" },
  { id: 336, numero: 36, prenom: "Ibrahima Sory",nom: "Camara",      dateNaissance: "2009-08-28", poste: "Gardien",   taille: "1.79 m" },
  { id: 337, numero: 37, prenom: "Seydouba",     nom: "Condé",       dateNaissance: "2010-04-06", poste: "Milieu",    taille: "1.73 m" },
  { id: 338, numero: 38, prenom: "Oumar Fanta",  nom: "Diallo",      dateNaissance: "2009-09-17", poste: "Défenseur", taille: "1.74 m" },
  { id: 339, numero: 39, prenom: "Mamadou Alpha",nom: "Barry",       dateNaissance: "2010-02-09", poste: "Attaquant", taille: "1.75 m" },
  { id: 340, numero: 40, prenom: "Lamine",       nom: "Keita",       dateNaissance: "2009-06-22", poste: "Milieu",    taille: "1.73 m" },
  { id: 341, numero: 41, prenom: "Cellou",       nom: "Bah",         dateNaissance: "2010-11-28", poste: "Défenseur", taille: "1.72 m" },
  { id: 342, numero: 42, prenom: "Facine",       nom: "Diallo",      dateNaissance: "2009-04-14", poste: "Attaquant", taille: "1.74 m" },
  { id: 343, numero: 43, prenom: "Mamadou Pathé",nom: "Sylla",       dateNaissance: "2010-08-31", poste: "Milieu",    taille: "1.75 m" },
  { id: 344, numero: 44, prenom: "Ibrahima Kalil",nom: "Barry",      dateNaissance: "2009-01-18", poste: "Défenseur", taille: "1.73 m" },
];

const atleticoJuniors: Player[] = [
  { id: 401, numero: 1,  prenom: "Oumar",        nom: "Bangoura",    dateNaissance: "2007-03-12", poste: "Gardien",   taille: "1.84 m" },
  { id: 402, numero: 2,  prenom: "Mamadou",      nom: "Sylla",       dateNaissance: "2006-09-27", poste: "Défenseur", taille: "1.77 m" },
  { id: 403, numero: 3,  prenom: "Alpha Oumar",  nom: "Barry",       dateNaissance: "2007-05-15", poste: "Défenseur", taille: "1.75 m" },
  { id: 404, numero: 4,  prenom: "Ibrahima",     nom: "Camara",      dateNaissance: "2006-12-04", poste: "Défenseur", taille: "1.79 m" },
  { id: 405, numero: 5,  prenom: "Mohamed",      nom: "Keita",       dateNaissance: "2007-07-23", poste: "Défenseur", taille: "1.76 m" },
  { id: 406, numero: 6,  prenom: "Sekou",        nom: "Diallo",      dateNaissance: "2006-04-09", poste: "Milieu",    taille: "1.78 m" },
  { id: 407, numero: 7,  prenom: "Abdoulaye",    nom: "Condé",       dateNaissance: "2007-10-18", poste: "Milieu",    taille: "1.74 m" },
  { id: 408, numero: 8,  prenom: "Lansana",      nom: "Bah",         dateNaissance: "2006-01-31", poste: "Milieu",    taille: "1.77 m" },
  { id: 409, numero: 9,  prenom: "Thierno",      nom: "Kouyaté",     dateNaissance: "2007-02-19", poste: "Attaquant", taille: "1.80 m" },
  { id: 410, numero: 10, prenom: "Naby",         nom: "Sylla",       dateNaissance: "2006-08-08", poste: "Attaquant", taille: "1.77 m" },
  { id: 411, numero: 11, prenom: "Moussa",       nom: "Diallo",      dateNaissance: "2007-04-26", poste: "Attaquant", taille: "1.75 m" },
  { id: 412, numero: 12, prenom: "Fode",         nom: "Barry",       dateNaissance: "2006-11-14", poste: "Gardien",   taille: "1.86 m" },
  { id: 413, numero: 13, prenom: "Saliou",       nom: "Camara",      dateNaissance: "2007-06-02", poste: "Défenseur", taille: "1.76 m" },
  { id: 414, numero: 14, prenom: "Amadou",       nom: "Bah",         dateNaissance: "2006-10-21", poste: "Milieu",    taille: "1.78 m" },
  { id: 415, numero: 15, prenom: "Elhadj",       nom: "Condé",       dateNaissance: "2007-03-10", poste: "Attaquant", taille: "1.77 m" },
  { id: 416, numero: 16, prenom: "Mamadou Lamine",nom: "Keita",      dateNaissance: "2006-07-29", poste: "Défenseur", taille: "1.79 m" },
  { id: 417, numero: 17, prenom: "Boubacar",     nom: "Diallo",      dateNaissance: "2007-12-17", poste: "Milieu",    taille: "1.75 m" },
  { id: 418, numero: 18, prenom: "Ibrahima Kalil",nom: "Sylla",      dateNaissance: "2006-05-05", poste: "Attaquant", taille: "1.78 m" },
  { id: 419, numero: 19, prenom: "Ousmane",      nom: "Barry",       dateNaissance: "2007-09-24", poste: "Milieu",    taille: "1.74 m" },
  { id: 420, numero: 20, prenom: "Yaya",         nom: "Camara",      dateNaissance: "2006-03-13", poste: "Défenseur", taille: "1.77 m" },
  { id: 421, numero: 21, prenom: "Bangaly",      nom: "Bah",         dateNaissance: "2007-08-01", poste: "Attaquant", taille: "1.76 m" },
  { id: 422, numero: 22, prenom: "Daouda",       nom: "Keita",       dateNaissance: "2006-02-20", poste: "Milieu",    taille: "1.78 m" },
  { id: 423, numero: 23, prenom: "Mamadi",       nom: "Condé",       dateNaissance: "2007-11-08", poste: "Défenseur", taille: "1.75 m" },
  { id: 424, numero: 24, prenom: "Tidiane",      nom: "Diallo",      dateNaissance: "2006-06-17", poste: "Gardien",   taille: "1.83 m" },
  { id: 425, numero: 25, prenom: "Hamidou",      nom: "Barry",       dateNaissance: "2007-01-25", poste: "Milieu",    taille: "1.76 m" },
  { id: 426, numero: 26, prenom: "Sory",         nom: "Sylla",       dateNaissance: "2006-09-06", poste: "Attaquant", taille: "1.79 m" },
  { id: 427, numero: 27, prenom: "Dramane",      nom: "Camara",      dateNaissance: "2007-04-22", poste: "Défenseur", taille: "1.75 m" },
  { id: 428, numero: 28, prenom: "Kabine",       nom: "Bah",         dateNaissance: "2006-12-10", poste: "Milieu",    taille: "1.77 m" },
  { id: 429, numero: 29, prenom: "Siaka",        nom: "Keita",       dateNaissance: "2007-07-29", poste: "Attaquant", taille: "1.76 m" },
  { id: 430, numero: 30, prenom: "Aboubacar",    nom: "Diallo",      dateNaissance: "2006-10-16", poste: "Défenseur", taille: "1.78 m" },
  { id: 431, numero: 31, prenom: "Karamo",       nom: "Condé",       dateNaissance: "2007-08-04", poste: "Milieu",    taille: "1.74 m" },
  { id: 432, numero: 32, prenom: "Souleymane",   nom: "Barry",       dateNaissance: "2006-03-23", poste: "Attaquant", taille: "1.77 m" },
  { id: 433, numero: 33, prenom: "Mamadou Oury", nom: "Sylla",       dateNaissance: "2007-11-11", poste: "Défenseur", taille: "1.76 m" },
  { id: 434, numero: 34, prenom: "Ibrahima Sory",nom: "Diallo",      dateNaissance: "2006-08-30", poste: "Milieu",    taille: "1.78 m" },
  { id: 435, numero: 35, prenom: "Alpha",        nom: "Barry",       dateNaissance: "2007-01-18", poste: "Attaquant", taille: "1.75 m" },
];

const atleticoSeniors: Player[] = [
  { id: 501, numero: 1,  prenom: "Aboubacar",    nom: "Camara",      dateNaissance: "2001-06-17", poste: "Gardien",   taille: "1.89 m", photo: "/images/players/atletico/1.jpeg" },
  { id: 502, numero: 2,  prenom: "Mamadou",      nom: "Barry",       dateNaissance: "2000-10-24", poste: "Défenseur", taille: "1.81 m", photo: "/images/players/atletico/2.jpeg" },
  { id: 503, numero: 3,  prenom: "Ibrahima",     nom: "Kouyaté",     dateNaissance: "2001-04-10", poste: "Défenseur", taille: "1.79 m", photo: "/images/players/atletico/3.jpeg" },
  { id: 504, numero: 4,  prenom: "Lansana",      nom: "Diallo",      dateNaissance: "2000-08-19", poste: "Défenseur", taille: "1.83 m", photo: "/images/players/atletico/4.jpeg" },
  { id: 505, numero: 5,  prenom: "Mohamed",      nom: "Sylla",       dateNaissance: "2001-12-07", poste: "Défenseur", taille: "1.80 m", photo: "/images/players/atletico/5.jpeg" },
  { id: 506, numero: 6,  prenom: "Sekou",        nom: "Camara",      dateNaissance: "2000-06-26", poste: "Milieu",    taille: "1.77 m", photo: "/images/players/atletico/6.jpeg" },
  { id: 507, numero: 7,  prenom: "Alpha",        nom: "Barry",       dateNaissance: "2001-02-13", poste: "Milieu",    taille: "1.75 m", photo: "/images/players/atletico/7.jpeg" },
  { id: 508, numero: 8,  prenom: "Naby",         nom: "Condé",       dateNaissance: "2000-09-01", poste: "Milieu",    taille: "1.78 m", photo: "/images/players/atletico/8.jpeg" },
  { id: 509, numero: 9,  prenom: "Thierno",      nom: "Diallo",      dateNaissance: "2001-07-25", poste: "Attaquant", taille: "1.82 m", photo: "/images/players/atletico/9.jpeg" },
  { id: 510, numero: 10, prenom: "Moussa",       nom: "Keita",       dateNaissance: "2000-01-14", poste: "Attaquant", taille: "1.80 m", photo: "/images/players/atletico/10.jpeg" },
  { id: 511, numero: 11, prenom: "Saliou",       nom: "Touré",       dateNaissance: "2001-03-29", poste: "Attaquant", taille: "1.77 m", photo: "/images/players/atletico/11.jpeg" },
  { id: 512, numero: 12, prenom: "Ousmane",      nom: "Barry",       dateNaissance: "2000-11-17", poste: "Gardien",   taille: "1.87 m", photo: "/images/players/atletico/12.jpeg" },
  { id: 513, numero: 13, prenom: "Fode",         nom: "Diallo",      dateNaissance: "2001-08-06", poste: "Défenseur", taille: "1.81 m", photo: "/images/players/atletico/13.jpeg" },
  { id: 514, numero: 14, prenom: "Amadou",       nom: "Camara",      dateNaissance: "2000-05-23", poste: "Milieu",    taille: "1.78 m", photo: "/images/players/atletico/14.jpeg" },
  { id: 515, numero: 15, prenom: "Elhadj",       nom: "Sylla",       dateNaissance: "2001-10-11", poste: "Attaquant", taille: "1.79 m", photo: "/images/players/atletico/15.jpeg" },
  { id: 516, numero: 16, prenom: "Daouda",       nom: "Kouyaté",     dateNaissance: "2000-04-30", poste: "Défenseur", taille: "1.80 m", photo: "/images/players/atletico/16.jpeg" },
  { id: 517, numero: 17, prenom: "Mamadi",       nom: "Barry",       dateNaissance: "2001-09-18", poste: "Milieu",    taille: "1.76 m", photo: "/images/players/atletico/17.jpeg" },
  { id: 518, numero: 18, prenom: "Ibrahima Sory",nom: "Diallo",      dateNaissance: "2000-07-07", poste: "Attaquant", taille: "1.81 m", photo: "/images/players/atletico/18.jpeg" },
  { id: 519, numero: 19, prenom: "Bangaly",      nom: "Camara",      dateNaissance: "2001-02-28", poste: "Milieu",    taille: "1.77 m", photo: "/images/players/atletico/19.jpeg" },
  { id: 520, numero: 20, prenom: "Hamidou",      nom: "Sylla",       dateNaissance: "2000-12-15", poste: "Défenseur", taille: "1.80 m", photo: "/images/players/atletico/20.jpeg" },
  { id: 521, numero: 21, prenom: "Karamo",       nom: "Diallo",      dateNaissance: "2001-05-04", poste: "Milieu",    taille: "1.76 m", photo: "/images/players/atletico/21.jpeg" },
  { id: 522, numero: 22, prenom: "Souleymane",   nom: "Barry",       dateNaissance: "2000-03-21", poste: "Attaquant", taille: "1.79 m", photo: "/images/players/atletico/22.jpeg" },
  { id: 523, numero: 23, prenom: "Daouda Alpha", nom: "Condé",       dateNaissance: "2001-11-09", poste: "Défenseur", taille: "1.81 m", photo: "/images/players/atletico/23.jpeg" },
  { id: 524, numero: 24, prenom: "Facine",       nom: "Kouyaté",     dateNaissance: "2000-08-27", poste: "Gardien",   taille: "1.85 m", photo: "/images/players/atletico/24.jpeg" },
];

export const clubs: Club[] = [
  {
    id: "jag",
    nom: "Jaguar Académie Guinée",
    acronyme: "JAG",
    fondation: "28 août 2024",
    ville: "Conakry, Guinée",
    description:
      "Fondée le 28 août 2024 à Conakry par Moussa Touré, la Jaguar Académie est une école de sport dédiée à la jeunesse guinéenne. Elle allie excellence académique et performance sportive, formant des joueurs talentueux et des citoyens responsables. En 2025, elle participe pour la première fois à la Ligue Guinéenne des Académies (3ᵉ édition).",
    logo: "/images/jag-logo.png",
    hero: "/images/jag-hero.png",
    couleurPrimaire: "#CC0000",
    couleurSecondaire: "#111111",
    equipes: {
      Cadets: jagCadets,
      Juniors: jagJuniors,
      Seniors: jagSeniors,
    },
    stats: [
      { label: "Cadets", value: "37" },
      { label: "Juniors", value: "44" },
      { label: "Seniors", value: "18" },
      { label: "Staff technique", value: "22" },
    ],
    social: {
      facebook: "https://www.facebook.com/MoussaToureAuteur",
      youtube: "https://youtube.com/@moussatoure-ecrivain?si=vSxbMZqT2F2mJwzc",
    },
  },
  {
    id: "atletico",
    nom: "Club Atlético de Colèah",
    acronyme: "Atlético",
    fondation: "2 octobre 1998",
    ville: "Colèah, Conakry",
    description:
      "Fondé le 2 octobre 1998 à Colèah, l'Atlético de Colèah est l'un des clubs les plus anciens et titrés de Conakry. Vice-champion de Guinée trois fois (2010-2012), vainqueur de la Coupe Rusal 2005, de la 1ʳᵉ édition des Trophées Areeba 2007. Depuis 2025, refondé par le président Touré Moussa, il dispose d'une structure complète hommes et femmes.",
    logo: "/images/atletico-logo.png",
    hero: "/images/atletico-hero.png",
    couleurPrimaire: "#F5B800",
    couleurSecondaire: "#1A1A1A",
    equipes: {
      Cadets: atleticoCadets,
      Juniors: atleticoJuniors,
      Seniors: atleticoSeniors,
    },
    stats: [
      { label: "Cadets", value: "44" },
      { label: "Juniors", value: "35" },
      { label: "Seniors", value: "24" },
      { label: "Fondé en", value: "1998" },
    ],
    social: {
      facebook: "https://www.facebook.com/Atleticodecoleah",
      youtube: "https://youtube.com/@moussatoure-ecrivain?si=vSxbMZqT2F2mJwzc",
    },
  },
];

export function getClub(id: string): Club | undefined {
  return clubs.find((c) => c.id === id);
}

export function calcAge(dateNaissance: string): number {
  const today = new Date();
  const dob = new Date(dateNaissance);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export function formatDate(dateNaissance: string): string {
  const d = new Date(dateNaissance);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}
