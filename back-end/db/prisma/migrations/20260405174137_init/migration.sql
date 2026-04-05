/*
  Warnings:

  - You are about to drop the column `is_archived` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `entries` DROP FOREIGN KEY `entries_challenge_id_fkey`;

-- DropForeignKey
ALTER TABLE `entries` DROP FOREIGN KEY `entries_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `votes` DROP FOREIGN KEY `votes_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `votes` DROP FOREIGN KEY `votes_user_id_fkey`;

-- AlterTable
ALTER TABLE `challenges` MODIFY `start_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `is_archived` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `entries` MODIFY `submit_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `users` DROP COLUMN `is_archived`,
    ADD COLUMN `is_activated` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `is_admin` BOOLEAN NULL,
    MODIFY `inscription_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `votes` MODIFY `vote_date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0);

-- CreateTable
CREATE TABLE `comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `content` VARCHAR(255) NOT NULL,
    `date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `entry_id`(`entry_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `entries` ADD CONSTRAINT `1` FOREIGN KEY (`challenge_id`) REFERENCES `challenges`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `entries` ADD CONSTRAINT `2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `3` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `4` FOREIGN KEY (`entry_id`) REFERENCES `entries`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `5` FOREIGN KEY (`entry_id`) REFERENCES `entries`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `6` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
