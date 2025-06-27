/*
  Warnings:

  - You are about to drop the column `role` on the `Utilisateur` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Utilisateur` DROP COLUMN `role`,
    ADD COLUMN `roleId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(64) NOT NULL,

    UNIQUE INDEX `Role_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
