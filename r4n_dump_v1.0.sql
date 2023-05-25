-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           8.0.32 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour r4n_db
CREATE DATABASE IF NOT EXISTS `r4n_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `r4n_db`;

-- Listage de la structure de table r4n_db. addresses
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `street` varchar(255) DEFAULT NULL COMMENT 'Nom de la rue',
  `house_number` int DEFAULT NULL COMMENT 'Numéro de maison',
  `additional_info` varchar(255) DEFAULT NULL COMMENT 'Numéro de boîte aux lettres, etc...',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `cityId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cityId` (`cityId`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`cityId`) REFERENCES `cities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.addresses : ~0 rows (environ)

-- Listage de la structure de table r4n_db. bills
CREATE TABLE IF NOT EXISTS `bills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bill_number` varchar(255) DEFAULT NULL COMMENT 'Numéro de la facture',
  `total_amount` float DEFAULT NULL COMMENT 'Montant total de la facture',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `orderId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `userId` (`userId`),
  CONSTRAINT `bills_ibfk_5` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bills_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.bills : ~0 rows (environ)

-- Listage de la structure de table r4n_db. billstatuses
CREATE TABLE IF NOT EXISTS `billstatuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL COMMENT 'Nom du statut',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.billstatuses : ~0 rows (environ)

-- Listage de la structure de table r4n_db. bills_billstatuses
CREATE TABLE IF NOT EXISTS `bills_billstatuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `billId` int DEFAULT NULL,
  `billStatusId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `billId` (`billId`),
  KEY `billStatusId` (`billStatusId`),
  CONSTRAINT `bills_billstatuses_ibfk_2` FOREIGN KEY (`billStatusId`) REFERENCES `billstatuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bills_billstatuses_ibfk_4` FOREIGN KEY (`billStatusId`) REFERENCES `billstatuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bills_billstatuses_ibfk_6` FOREIGN KEY (`billStatusId`) REFERENCES `billstatuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bills_billstatuses_ibfk_7` FOREIGN KEY (`billId`) REFERENCES `bills` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bills_billstatuses_ibfk_8` FOREIGN KEY (`billStatusId`) REFERENCES `billstatuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.bills_billstatuses : ~0 rows (environ)

-- Listage de la structure de table r4n_db. cities
CREATE TABLE IF NOT EXISTS `cities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT 'Nom de la ville',
  `zip_code` int DEFAULT NULL COMMENT 'Code postal de la ville',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `countryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `countryId` (`countryId`),
  CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`countryId`) REFERENCES `countries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.cities : ~0 rows (environ)

-- Listage de la structure de table r4n_db. comments
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text COMMENT 'Contenu du commentaire de l''actualité',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `newsId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `newsId` (`newsId`),
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_4` FOREIGN KEY (`newsId`) REFERENCES `news` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.comments : ~0 rows (environ)

-- Listage de la structure de table r4n_db. countries
CREATE TABLE IF NOT EXISTS `countries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT 'Nom du pays',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.countries : ~0 rows (environ)

-- Listage de la structure de table r4n_db. membershiprequests
CREATE TABLE IF NOT EXISTS `membershiprequests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(255) DEFAULT NULL COMMENT 'Message de la demande d''affiliation',
  `status` varchar(255) DEFAULT NULL COMMENT 'Statut de la demande d''affiliation',
  `accepted_by` varchar(255) DEFAULT NULL COMMENT 'Personne qui a accepté la demande',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `membershiprequests_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.membershiprequests : ~0 rows (environ)

-- Listage de la structure de table r4n_db. news
CREATE TABLE IF NOT EXISTS `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL COMMENT 'Titre de l''actualité',
  `content` text COMMENT 'Contenu de l''actualité',
  `image_url` varchar(255) DEFAULT NULL COMMENT 'Bannière de l''actualité',
  `category` varchar(255) DEFAULT NULL COMMENT 'Catégorie de l''actualité',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `news_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.news : ~0 rows (environ)

-- Listage de la structure de table r4n_db. notes
CREATE TABLE IF NOT EXISTS `notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL COMMENT 'Titre de la note',
  `content` int DEFAULT NULL COMMENT 'Contenu de la note',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `teamId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teamId` (`teamId`),
  CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.notes : ~0 rows (environ)

-- Listage de la structure de table r4n_db. orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.orders : ~0 rows (environ)

-- Listage de la structure de table r4n_db. payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `method` varchar(255) DEFAULT NULL COMMENT 'Méthode de payement',
  `amount` int DEFAULT NULL COMMENT 'Montant total du payement',
  `details` text COMMENT 'Détails du payement',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `orderId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.payments : ~0 rows (environ)

-- Listage de la structure de table r4n_db. paymentstatuses
CREATE TABLE IF NOT EXISTS `paymentstatuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL COMMENT 'Nom du statut',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.paymentstatuses : ~0 rows (environ)

-- Listage de la structure de table r4n_db. payments_paymentstatuses
CREATE TABLE IF NOT EXISTS `payments_paymentstatuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `paymentId` int DEFAULT NULL,
  `paymentStatusId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `paymentStatusId` (`paymentStatusId`),
  KEY `paymentId` (`paymentId`),
  CONSTRAINT `payments_paymentstatuses_ibfk_2` FOREIGN KEY (`paymentStatusId`) REFERENCES `paymentstatuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payments_paymentstatuses_ibfk_3` FOREIGN KEY (`paymentId`) REFERENCES `payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.payments_paymentstatuses : ~0 rows (environ)

-- Listage de la structure de table r4n_db. players
CREATE TABLE IF NOT EXISTS `players` (
  `id` int NOT NULL AUTO_INCREMENT,
  `game` varchar(255) DEFAULT NULL COMMENT 'Jeu auxquels le joueur joue',
  `rank` varchar(255) DEFAULT NULL COMMENT 'Classement du joueur sur le jeu',
  `role` varchar(255) DEFAULT NULL COMMENT 'Rôle de joueur dans le jeu',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `teamId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `teamId` (`teamId`),
  CONSTRAINT `players_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `players_ibfk_2` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.players : ~0 rows (environ)

-- Listage de la structure de table r4n_db. products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL COMMENT 'Nom du produit',
  `description` varchar(255) DEFAULT NULL COMMENT 'Description du produit',
  `price` float DEFAULT NULL COMMENT 'Prix du produit',
  `stock` int DEFAULT NULL COMMENT 'Stock restant du produit',
  `category` varchar(255) DEFAULT NULL COMMENT 'Catégorie du produit',
  `image_url` text COMMENT 'Image du produit',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.products : ~0 rows (environ)

-- Listage de la structure de table r4n_db. roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL COMMENT 'Nom du rôle',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.roles : ~0 rows (environ)

-- Listage de la structure de table r4n_db. sponsors
CREATE TABLE IF NOT EXISTS `sponsors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT 'Nom du sponsor',
  `logo` text COMMENT 'Logo du sponsor',
  `description` varchar(255) DEFAULT NULL COMMENT 'Description du sponsor',
  `website` varchar(255) DEFAULT NULL COMMENT 'Site web du sponsor',
  `email` varchar(255) DEFAULT NULL COMMENT 'Adresse mail du sponsor',
  `phone` varchar(255) DEFAULT NULL COMMENT 'Numéro de téléphone du sponsor',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.sponsors : ~1 rows (environ)
INSERT INTO `sponsors` (`id`, `name`, `logo`, `description`, `website`, `email`, `phone`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
	(1, 'Electronic Arts', '../../assets/img/ea_logo.png', '', 'https://www.ea.com/fr-fr', NULL, NULL, '2023-05-20 15:58:11', '2023-05-20 15:58:16', NULL);

-- Listage de la structure de table r4n_db. sponsors_teams
CREATE TABLE IF NOT EXISTS `sponsors_teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `money` int DEFAULT NULL COMMENT 'Argent apporté du sponsor',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `sponsorId` int DEFAULT NULL,
  `teamId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sponsorId` (`sponsorId`),
  KEY `teamId` (`teamId`),
  CONSTRAINT `sponsors_teams_ibfk_1` FOREIGN KEY (`sponsorId`) REFERENCES `sponsors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sponsors_teams_ibfk_2` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.sponsors_teams : ~0 rows (environ)

-- Listage de la structure de table r4n_db. sponsors_tournaments
CREATE TABLE IF NOT EXISTS `sponsors_tournaments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `money` int DEFAULT NULL COMMENT 'Argent apporté du sponsor',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `sponsorId` int DEFAULT NULL,
  `tournamentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sponsorId` (`sponsorId`),
  KEY `tournamentId` (`tournamentId`),
  CONSTRAINT `sponsors_tournaments_ibfk_1` FOREIGN KEY (`sponsorId`) REFERENCES `sponsors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sponsors_tournaments_ibfk_2` FOREIGN KEY (`tournamentId`) REFERENCES `tournaments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.sponsors_tournaments : ~0 rows (environ)

-- Listage de la structure de table r4n_db. teams
CREATE TABLE IF NOT EXISTS `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT 'Nom de la team',
  `logo` text COMMENT 'Logo de la team',
  `description` varchar(255) DEFAULT NULL COMMENT 'Description de la team',
  `captain` varchar(255) DEFAULT NULL COMMENT 'Capitaine actuel de la team',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.teams : ~3 rows (environ)
INSERT INTO `teams` (`id`, `name`, `logo`, `description`, `captain`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
	(1, 'ERROR 404', './../assets/img/team1.png', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deseruntquisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!', 'Mbappe', '2023-05-03 20:40:08', '2023-05-03 20:40:10', NULL),
	(2, 'BROKEN ARMS', '/../assets/img/team2.png', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deseruntquisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!', 'Messi', '2023-05-03 20:41:09', '2023-05-03 20:41:13', NULL),
	(3, 'SHITORI', './../assets/img/team3.png', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deseruntquisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!', 'Lukaku', '2023-05-03 20:41:33', '2023-05-03 20:41:36', NULL);

-- Listage de la structure de table r4n_db. teams_tournaments
CREATE TABLE IF NOT EXISTS `teams_tournaments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rank` varchar(255) DEFAULT NULL COMMENT 'Classement de la team au tournoi',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `tournamentId` int DEFAULT NULL,
  `teamId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tournamentId` (`tournamentId`),
  KEY `teamId` (`teamId`),
  CONSTRAINT `teams_tournaments_ibfk_1` FOREIGN KEY (`tournamentId`) REFERENCES `tournaments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `teams_tournaments_ibfk_2` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.teams_tournaments : ~0 rows (environ)

-- Listage de la structure de table r4n_db. tournaments
CREATE TABLE IF NOT EXISTS `tournaments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT 'Nom du tournoi',
  `description` varchar(255) DEFAULT NULL COMMENT 'Description du tournoi',
  `start_date` datetime DEFAULT NULL COMMENT 'Date de commencement du tournoi',
  `end_date` datetime DEFAULT NULL COMMENT 'Date de fin du tournoi',
  `format` varchar(255) DEFAULT NULL COMMENT 'Format du tournoi',
  `game` varchar(255) DEFAULT NULL COMMENT 'Jeu du tournoi',
  `prize` int DEFAULT NULL COMMENT 'Prix du tournoi',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `tournaments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.tournaments : ~0 rows (environ)

-- Listage de la structure de table r4n_db. trainings
CREATE TABLE IF NOT EXISTS `trainings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL COMMENT 'Description de l''entraînement',
  `start_date` datetime DEFAULT NULL COMMENT 'Date de début de l''entraînement',
  `duration` varchar(255) DEFAULT NULL COMMENT 'Durée de l''entraînement',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `teamId` int DEFAULT NULL,
  `playerId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teamId` (`teamId`),
  KEY `playerId` (`playerId`),
  KEY `userId` (`userId`),
  CONSTRAINT `trainings_ibfk_1` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trainings_ibfk_2` FOREIGN KEY (`playerId`) REFERENCES `players` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trainings_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.trainings : ~0 rows (environ)

-- Listage de la structure de table r4n_db. users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL COMMENT 'Monsieur ou madame',
  `firstname` varchar(255) DEFAULT NULL COMMENT 'Prénom de la personne',
  `lastname` varchar(255) DEFAULT NULL COMMENT 'Prénom de la personne',
  `email` varchar(255) DEFAULT NULL COMMENT 'Adresse mail de la personne',
  `username` varchar(255) DEFAULT NULL COMMENT 'Pseudo de la personne',
  `password` varchar(255) DEFAULT NULL COMMENT 'Mot de passe de la personne',
  `phone` varchar(255) DEFAULT NULL COMMENT 'Numéro de téléphone de la personne',
  `birthdate` datetime DEFAULT NULL COMMENT 'Date d''anniversaire de la personne',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `addressId` int DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `addressId` (`addressId`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table r4n_db.users : ~0 rows (environ)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
