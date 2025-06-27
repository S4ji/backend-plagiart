/*
  Warnings:

  - You are about to alter the column `roleId` on the `Utilisateur` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.

*/
-- DropForeignKey
ALTER TABLE `Utilisateur` DROP FOREIGN KEY `Utilisateur_roleId_fkey`;

-- DropIndex
DROP INDEX `Utilisateur_roleId_fkey` ON `Utilisateur`;

-- AlterTable
ALTER TABLE `Artiste` ADD COLUMN `image` VARCHAR(200) NULL;

-- AlterTable
ALTER TABLE `Collection` ADD COLUMN `image` VARCHAR(200) NULL;

-- AlterTable
ALTER TABLE `Oeuvre` ADD COLUMN `image` VARCHAR(200) NULL;

-- AlterTable
ALTER TABLE `Utilisateur` ADD COLUMN `image` VARCHAR(200) NULL,
    MODIFY `roleId` VARCHAR(36) NOT NULL;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
