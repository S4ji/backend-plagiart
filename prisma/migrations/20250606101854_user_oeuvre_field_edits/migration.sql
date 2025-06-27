/*
  Warnings:

  - You are about to drop the column `annee_creation` on the `Oeuvre` table. All the data in the column will be lost.
  - You are about to drop the column `valeur_estimee` on the `Oeuvre` table. All the data in the column will be lost.
  - Added the required column `ai_prompt` to the `Oeuvre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Oeuvre` DROP COLUMN `annee_creation`,
    DROP COLUMN `valeur_estimee`,
    ADD COLUMN `ai_prompt` TEXT NOT NULL;
