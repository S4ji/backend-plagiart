/*
  Warnings:

  - You are about to drop the column `id_artiste` on the `Oeuvre` table. All the data in the column will be lost.
  - You are about to drop the `Artiste` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_utilisateur` to the `Oeuvre` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Oeuvre` DROP FOREIGN KEY `Oeuvre_id_artiste_fkey`;

-- DropIndex
DROP INDEX `Oeuvre_id_artiste_fkey` ON `Oeuvre`;

-- AlterTable
ALTER TABLE `Oeuvre` DROP COLUMN `id_artiste`,
    ADD COLUMN `id_utilisateur` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Utilisateur` ADD COLUMN `biographie` TEXT NULL,
    ADD COLUMN `style_artistique` VARCHAR(128) NULL;

-- DropTable
DROP TABLE `Artiste`;

-- AddForeignKey
ALTER TABLE `Oeuvre` ADD CONSTRAINT `Oeuvre_id_utilisateur_fkey` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateur`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;
