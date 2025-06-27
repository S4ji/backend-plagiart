/*
  Warnings:

  - You are about to alter the column `nom` on the `Artiste` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(128)`.
  - You are about to alter the column `style_artistique` on the `Artiste` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(128)`.
  - You are about to alter the column `nom` on the `Categorie` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(128)`.
  - You are about to alter the column `path` on the `Categorie` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `nom` on the `Collection` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(128)`.
  - You are about to alter the column `titre` on the `Oeuvre` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(128)`.
  - The primary key for the `Utilisateur` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `nom` on the `Utilisateur` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(128)`.
  - You are about to alter the column `token` on the `Utilisateur` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(128)`.
  - Added the required column `updated_at` to the `Artiste` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Oeuvre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Collection` DROP FOREIGN KEY `Collection_id_utilisateur_fkey`;

-- DropForeignKey
ALTER TABLE `Likes` DROP FOREIGN KEY `Likes_id_utilisateur_fkey`;

-- DropForeignKey
ALTER TABLE `Signalement` DROP FOREIGN KEY `Signalement_id_utilisateur_fkey`;

-- DropIndex
DROP INDEX `Collection_id_utilisateur_fkey` ON `Collection`;

-- DropIndex
DROP INDEX `Likes_id_utilisateur_fkey` ON `Likes`;

-- DropIndex
DROP INDEX `Signalement_id_utilisateur_fkey` ON `Signalement`;

-- AlterTable
ALTER TABLE `Artiste` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `nom` VARCHAR(128) NOT NULL,
    MODIFY `biographie` TEXT NOT NULL,
    MODIFY `style_artistique` VARCHAR(128) NOT NULL;

-- AlterTable
ALTER TABLE `Categorie` MODIFY `nom` VARCHAR(128) NOT NULL,
    MODIFY `path` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `Collection` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `nom` VARCHAR(128) NOT NULL,
    MODIFY `description` TEXT NOT NULL,
    MODIFY `id_utilisateur` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `Likes` MODIFY `id_utilisateur` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Oeuvre` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `titre` VARCHAR(128) NOT NULL,
    MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Signalement` MODIFY `id_utilisateur` VARCHAR(191) NOT NULL,
    MODIFY `raison` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Utilisateur` DROP PRIMARY KEY,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `id_utilisateur` VARCHAR(191) NOT NULL,
    MODIFY `nom` VARCHAR(128) NOT NULL,
    MODIFY `mot_de_passe` VARCHAR(255) NOT NULL,
    MODIFY `token` VARCHAR(128) NOT NULL,
    ADD PRIMARY KEY (`id_utilisateur`);

-- AddForeignKey
ALTER TABLE `Collection` ADD CONSTRAINT `Collection_id_utilisateur_fkey` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateur`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_id_utilisateur_fkey` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateur`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Signalement` ADD CONSTRAINT `Signalement_id_utilisateur_fkey` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateur`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;
