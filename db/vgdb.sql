-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Jun 27, 2019 at 01:14 AM
-- Server version: 5.7.26
-- PHP Version: 7.2.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vgdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `username` varchar(100) NOT NULL,
  `email` varchar(320) NOT NULL,
  `password` varchar(320) NOT NULL,
  `age` int(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `gameCompany` (
  `id` int NOT NULL,
  `name` varchar(320) NOT NULL,
  `founded` date NOT NULL,
  `parentCompanyId` int
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `following` (
  `userId` varchar(100) NOT NULL,
  `companyId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `employee` (
  `id` int NOT NULL,
  `firstName` varchar(320) NOT NULL,
  `lastName` varchar(320) NOT NULL,
  `position` varchar(320),
  `birthdate` date,
  `companyId` int
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `videogame` (
  `id` int NOT NULL,
  `name` varchar(320) NOT NULL,
  `releaseDate` date,
  `platform` varchar(320),
  `genre` varchar(320),
  `image` int,
  `summary` mediumtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `developers` (
  `gameId` int  NOT NULL,
  `companyId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `review` (
  `gameId` int  NOT NULL,
  `userId` varchar(100) NOT NULL,
  `rating` int(100) NOT NULL,
  `text` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `award` (
  `id` int NOT NULL,
  `name` varchar(320) NOT NULL,
  `year` int,
  `category` varchar(320),
  `gameId` int,
  `companyId` int
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `gameCompany` (`id`, `name`, `founded`) VALUES
(1, 'Activision', '1979-10-1'),
(3, 'Microsoft', '1976-11-26'),
(4, 'Nintendo', '1889-9-23'),
(6, 'Rockstar Games', '1998-12-1');

INSERT INTO `gameCompany` (`id`, `name`, `founded`, `parentCompanyId`) VALUES
(2, 'Infinity Ward', '2002-5-01', 1),
(5, '343industries', '2007-10-6', 3);

INSERT INTO `videogame` (`id`, `name`, `releaseDate`, `platform`, `genre`, `image`, `summary`) VALUES
(1, 'HALO Infinite', '2020-12-1', 'Xbox Series X, Xbox One, PC', 'First-Person Shooter', 1,
 'The storyline of Halo Infinite will be "much more human", with Master Chief playing a more central role than in Halo 5: Guardians.'),
(2, 'Red Dead Redemption 2', '2018-10-26', 'Xbox One, Playstation 4, PC', 'Action-Adventure, Third-person', 2,
 'After a botched ferry heist in 1899, the Van der Linde gang is forced to leave its substantial money stash and flee Blackwater.
 The gang realizes that the progress of civilization is ending the time of outlaws, and so decide to gain enough money to escape the law and retire.
 The gang members rob a train owned by Leviticus Cornwall, who responds by hiring the Pinkertons to apprehend them.
 Dutch continually promises that the next heist will be their last.'),
 (3, 'Call of Duty Modern Warfare', '2019-10-25', 'Xbox One, Playstation 4, PC', 'First-Person Shooter', 3,
 'The game takes place in a realistic and modern setting. The campaign follows a CIA officer and British SAS forces as they team up with rebels from
  the fictional country of Urzikstan, combating together against Russian forces who have invaded the country. The games Special Ops mode features
  cooperative play missions that follow up the campaigns story.'),
 (4, 'The Legend of Zelda: Skyward Sword', '2011-11-18', 'Nintendo Wii', 'Action-Adventure', 4,
 'Skyward Sword takes place at the beginning of the Zelda continuity: according to legend, three ancient Goddesses bestowed a great wish-granting
  power: the Triforce. The Demon King Demise sought the Triforce, and he laid waste to much of the land in his quest for it. The Goddess Hylia gathered
  the survivors and sent them into the sky, allowing her to launch a full-scale offensive against Demise. She was victorious, but the land was severely
  damaged. Uncounted years later, the outcrop is known as Skyloft, and its people believe the "Surface" below the clouds is a myth.'),
 (5, 'Minecraft', '2011-11-18', 'Xbox One, Playstation 4, PC, Android, iOS, Linux, MacOs', 'Sandbox, Survival', 5,
 'In Minecraft, players explore a blocky, procedurally-generated 3D world, and may discover and extract raw materials, craft tools,
 build structures or earthworks, and depending on game mode, can fight computer-controlled "mobs", as well as either cooperate with or
 compete against other players in the same world. These modes include a survival mode, in which players must acquire resources to build
 the world and maintain health, and a creative mode, where players have unlimited resources. Players can modify the game to create new gameplay
  mechanics, items, and assets.');

INSERT INTO `developers` (`gameId`, `companyId`) VALUES
(1, 3),
(1, 5),
(2, 6),
(3, 1),
(3, 2),
(4, 4),
(5, 3);

INSERT INTO `user` (`username`, `email`, `password`, `age`) VALUES
('proGamer', 'gamer@gmail.com', 'qwerty1', 20),
('minecrafter1337', 'minecrafter1337@gmail.com', 'qwerty1', 21),
('PhilSpencer', 'phil@microsoft.com', 'qwerty1', 51),
('gamer-girl', 'girlygamer@gmail.com', 'qwerty1', 23),
('nonameuser', 'nnm-user@gmail.com', 'qwerty1', 71);

INSERT INTO `award` (`id`, `name`, `year`, `category`, `gameId`, `companyId`) VALUES
(1, 'The Game Awards', 2018, 'Best Storytelling', 2, 6),
(2, 'Golden Reel Award', 2020, 'Outstanding Achievement in Sound Editing', 3, 1);

INSERT INTO `award` (`id`, `name`, `year`, `category`, `companyId`) VALUES
(3, 'MCV/Develop', 2020, 'Publisher and Platform of the Year', 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`username`);

ALTER TABLE `gameCompany`
ADD PRIMARY KEY (`id`);

ALTER TABLE `employee`
ADD PRIMARY KEY (`id`);

ALTER TABLE `videogame`
ADD PRIMARY KEY (`id`);

ALTER TABLE `award`
ADD PRIMARY KEY (`id`);


--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sample`
--
ALTER TABLE `gameCompany`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

ALTER TABLE `employee`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

ALTER TABLE `videogame`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

ALTER TABLE `award`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
