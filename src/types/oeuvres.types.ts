export type TypeUtilisateur = {
  id_utilisateur: string;
  nom: string;
  email: string;
  mot_de_passe: string;
  role: "ADMIN" | "UTILISATEUR";
  rgpd: Date;
  token: string;
  isActive: boolean;
  collections: TypeCollection[];
  likes: TypeLike[];
  signalements: TypeSignalement[];
};



export type TypeArtiste = {
  id_artiste: number;
  nom: string;
  biographie: string;
  style_artistique: string;
  oeuvres: TypeOeuvre[];
};

export type TypeCategorie = {
  id_categorie: number;
  nom: string;
  id_parent?: number;  // Nullable pour les catégories parent
  path?: string;
  parent?: TypeCategorie;  // Relation avec la catégorie parent
  children: TypeCategorie[];  // Relation avec les sous-catégories
  oeuvres: TypeOeuvre[];  // Les œuvres associées à cette catégorie
};

export type TypeOeuvre = {
  id_oeuvre: number;
  titre: string;
  description: string;
  annee_creation: number;
  valeur_estimee: number;
  id_artiste: number;
  artiste: TypeArtiste;  // Relation avec l'artiste
  likes: TypeLike[];
  signalements: TypeSignalement[];
  categories: TypeCategorie[];
  collections: TypeCollection[];
};

export type TypeCollection = {
  id_collection: number;
  nom: string;
  description: string;
  id_utilisateur: number;
  utilisateur: TypeUtilisateur;  // Relation avec l'utilisateur qui possède la collection
  oeuvres: TypeOeuvre[];  // Les œuvres associées à cette collection
};

export type TypeLike = {
  id_like: number;
  id_utilisateur: number;
  id_oeuvre: number;
  utilisateur: TypeUtilisateur;  // Relation avec l'utilisateur qui a aimé l'œuvre
  oeuvre: TypeOeuvre;  // Relation avec l'œuvre qui a été aimée
};

export type TypeSignalement = {
  id_signalement: number;
  id_utilisateur: number;
  id_oeuvre: number;
  raison: string;
  date_signalement: Date;
  statut: "EN_ATTENTE" | "TRAITE" | "REJETTE";  // En fonction de l'énumération "StatutSignalement"
  utilisateur: TypeUtilisateur;  // Relation avec l'utilisateur qui a fait le signalement
  oeuvre: TypeOeuvre;  // Relation avec l'œuvre qui a été signalée
};

