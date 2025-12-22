-- CreateTable
CREATE TABLE `challenges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `theme_title` VARCHAR(255) NOT NULL,
    `theme_description` VARCHAR(255) NOT NULL,
    `required_picture_url` VARCHAR(255) NOT NULL,
    `start_date` DATETIME(0) NOT NULL,
    `end_date` DATETIME(0) NOT NULL,
    `is_archived` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `challenge_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `edited_picture_url` VARCHAR(255) NOT NULL,
    `submit_date` DATETIME(0) NOT NULL,
    `is_hidden` BOOLEAN NULL,

    INDEX `challenge_id`(`challenge_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `is_admin` BOOLEAN NULL,
    `inscription_date` DATETIME(0) NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `votes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `entry_id` INTEGER NULL,
    `creativity_rating` FLOAT NOT NULL,
    `technical_rating` FLOAT NOT NULL,
    `theme_respect_rating` FLOAT NOT NULL,
    `vote_date` DATETIME(0) NOT NULL,

    INDEX `entry_id`(`entry_id`),
    UNIQUE INDEX `user_id`(`user_id`, `entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `entries` ADD CONSTRAINT `entries_challenge_id_fkey` FOREIGN KEY (`challenge_id`) REFERENCES `challenges`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `entries` ADD CONSTRAINT `entries_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `entries`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

