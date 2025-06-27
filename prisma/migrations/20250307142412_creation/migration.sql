-- CreateTable
CREATE TABLE `Utilisateur` (
    `id_utilisateur` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `mot_de_passe` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'UTILISATEUR') NOT NULL,
    `rgpd` DATETIME(3) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL,

    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    PRIMARY KEY (`id_utilisateur`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Oeuvre` (
    `id_oeuvre` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `annee_creation` INTEGER NOT NULL,
    `valeur_estimee` INTEGER NOT NULL,
    `id_artiste` INTEGER NOT NULL,

    PRIMARY KEY (`id_oeuvre`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Artiste` (
    `id_artiste` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `biographie` VARCHAR(191) NOT NULL,
    `style_artistique` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_artiste`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categorie` (
    `id_categorie` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `id_parent` INTEGER NULL,
    `path` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_categorie`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Collection` (
    `id_collection` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `id_utilisateur` INTEGER NOT NULL,

    PRIMARY KEY (`id_collection`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Likes` (
    `id_like` INTEGER NOT NULL AUTO_INCREMENT,
    `id_utilisateur` INTEGER NOT NULL,
    `id_oeuvre` INTEGER NOT NULL,

    PRIMARY KEY (`id_like`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id_transaction` INTEGER NOT NULL AUTO_INCREMENT,
    `id_oeuvre` INTEGER NOT NULL,
    `type_transaction` ENUM('achat', 'vente', 'echange') NOT NULL,
    `prix` INTEGER NOT NULL,
    `date_transaction` DATETIME(3) NOT NULL,
    `id_ancien_proprietaire` INTEGER NOT NULL,
    `id_nouveau_proprietaire` INTEGER NOT NULL,

    PRIMARY KEY (`id_transaction`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Signalement` (
    `id_signalement` INTEGER NOT NULL AUTO_INCREMENT,
    `id_utilisateur` INTEGER NOT NULL,
    `id_oeuvre` INTEGER NOT NULL,
    `raison` VARCHAR(191) NOT NULL,
    `date_signalement` DATETIME(3) NOT NULL,
    `statut` ENUM('EN_ATTENTE', 'TRAITE', 'REJETTE') NOT NULL,

    PRIMARY KEY (`id_signalement`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Oeuvres_Collections` (
    `id_oeuvre` INTEGER NOT NULL,
    `id_collection` INTEGER NOT NULL,

    PRIMARY KEY (`id_oeuvre`, `id_collection`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Oeuvres_Categories` (
    `id_oeuvre` INTEGER NOT NULL,
    `id_categorie` INTEGER NOT NULL,

    PRIMARY KEY (`id_oeuvre`, `id_categorie`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Oeuvre` ADD CONSTRAINT `Oeuvre_id_artiste_fkey` FOREIGN KEY (`id_artiste`) REFERENCES `Artiste`(`id_artiste`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Categorie` ADD CONSTRAINT `Categorie_id_parent_fkey` FOREIGN KEY (`id_parent`) REFERENCES `Categorie`(`id_categorie`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collection` ADD CONSTRAINT `Collection_id_utilisateur_fkey` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateur`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_id_utilisateur_fkey` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateur`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_id_oeuvre_fkey` FOREIGN KEY (`id_oeuvre`) REFERENCES `Oeuvre`(`id_oeuvre`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_id_oeuvre_fkey` FOREIGN KEY (`id_oeuvre`) REFERENCES `Oeuvre`(`id_oeuvre`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Signalement` ADD CONSTRAINT `Signalement_id_utilisateur_fkey` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateur`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Signalement` ADD CONSTRAINT `Signalement_id_oeuvre_fkey` FOREIGN KEY (`id_oeuvre`) REFERENCES `Oeuvre`(`id_oeuvre`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Oeuvres_Collections` ADD CONSTRAINT `Oeuvres_Collections_id_oeuvre_fkey` FOREIGN KEY (`id_oeuvre`) REFERENCES `Oeuvre`(`id_oeuvre`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Oeuvres_Collections` ADD CONSTRAINT `Oeuvres_Collections_id_collection_fkey` FOREIGN KEY (`id_collection`) REFERENCES `Collection`(`id_collection`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Oeuvres_Categories` ADD CONSTRAINT `Oeuvres_Categories_id_oeuvre_fkey` FOREIGN KEY (`id_oeuvre`) REFERENCES `Oeuvre`(`id_oeuvre`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Oeuvres_Categories` ADD CONSTRAINT `Oeuvres_Categories_id_categorie_fkey` FOREIGN KEY (`id_categorie`) REFERENCES `Categorie`(`id_categorie`) ON DELETE RESTRICT ON UPDATE CASCADE;
