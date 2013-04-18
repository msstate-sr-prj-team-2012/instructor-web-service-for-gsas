-- phpMyAdmin SQL Dump
-- version 3.5.3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 18, 2013 at 12:21 PM
-- Server version: 5.5.28
-- PHP Version: 5.4.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `gsas`
--

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE IF NOT EXISTS `course` (
  `courseID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `location` text NOT NULL,
  PRIMARY KEY (`courseID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

-- --------------------------------------------------------

--
-- Table structure for table `hole`
--

CREATE TABLE IF NOT EXISTS `hole` (
  `holeID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `roundID` bigint(20) unsigned NOT NULL,
  `holeNumber` int(11) NOT NULL,
  `holeScore` int(11) DEFAULT NULL,
  `FIR` tinyint(1) DEFAULT NULL,
  `GIR` tinyint(1) DEFAULT NULL,
  `putts` int(11) DEFAULT NULL,
  PRIMARY KEY (`holeID`),
  KEY `roundID` (`roundID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1296 ;

-- --------------------------------------------------------

--
-- Table structure for table `holedefinition`
--

CREATE TABLE IF NOT EXISTS `holedefinition` (
  `courseID` bigint(20) unsigned NOT NULL,
  `holeNumber` int(11) NOT NULL,
  `teeID` int(11) NOT NULL,
  `distance` int(11) NOT NULL,
  PRIMARY KEY (`holeNumber`,`teeID`,`courseID`),
  KEY `courseID` (`courseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `holereference`
--

CREATE TABLE IF NOT EXISTS `holereference` (
  `courseID` bigint(20) unsigned NOT NULL,
  `holeNumber` int(11) NOT NULL,
  `par` int(3) NOT NULL,
  `firstRefLat` double NOT NULL,
  `firstRefLong` double NOT NULL,
  `secondRefLat` double NOT NULL,
  `secondRefLong` double NOT NULL,
  `firstRefX` int(11) NOT NULL,
  `firstRefY` int(11) NOT NULL,
  `secondRefX` int(11) NOT NULL,
  `secondRefY` int(11) NOT NULL,
  PRIMARY KEY (`courseID`,`holeNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `round`
--

CREATE TABLE IF NOT EXISTS `round` (
  `roundID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userID` bigint(20) unsigned NOT NULL,
  `courseID` bigint(20) unsigned NOT NULL,
  `teeID` int(11) unsigned NOT NULL,
  `totalScore` int(11) unsigned DEFAULT NULL,
  `startTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`roundID`),
  KEY `userID` (`userID`),
  KEY `courseID` (`courseID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=183 ;

-- --------------------------------------------------------

--
-- Table structure for table `shot`
--

CREATE TABLE IF NOT EXISTS `shot` (
  `shotID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `holeID` bigint(20) unsigned NOT NULL,
  `club` int(11) NOT NULL,
  `shotNumber` int(11) NOT NULL,
  `aimLatitude` double NOT NULL,
  `aimLongitude` double NOT NULL,
  `startLatitude` double NOT NULL,
  `startLongitude` double NOT NULL,
  `endLatitude` double NOT NULL,
  `endLongitude` double NOT NULL,
  PRIMARY KEY (`shotID`),
  KEY `holeID` (`holeID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1381 ;

-- --------------------------------------------------------

--
-- Table structure for table `stats`
--

CREATE TABLE IF NOT EXISTS `stats` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userID` bigint(20) unsigned NOT NULL,
  `year` int(11) unsigned NOT NULL,
  `drivingDistance` double NOT NULL,
  `GIRPercentage` double NOT NULL,
  `drivingAccuracy` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userID` (`userID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=20 ;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `userID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `memberID` text,
  `nickname` text,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `birthDate` date NOT NULL,
  `gender` text NOT NULL,
  `rightHanded` tinyint(1) NOT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=122 ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `hole`
--
ALTER TABLE `hole`
  ADD CONSTRAINT `hole_ibfk_1` FOREIGN KEY (`roundID`) REFERENCES `round` (`roundID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `holedefinition`
--
ALTER TABLE `holedefinition`
  ADD CONSTRAINT `holeDefinition_ibfk_1` FOREIGN KEY (`courseID`) REFERENCES `course` (`courseID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `holereference`
--
ALTER TABLE `holereference`
  ADD CONSTRAINT `holeReference_ibfk_1` FOREIGN KEY (`courseID`) REFERENCES `course` (`courseID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `round`
--
ALTER TABLE `round`
  ADD CONSTRAINT `round_ibfk_2` FOREIGN KEY (`courseID`) REFERENCES `course` (`courseID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `round_ibfk_3` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `shot`
--
ALTER TABLE `shot`
  ADD CONSTRAINT `shot_ibfk_1` FOREIGN KEY (`holeID`) REFERENCES `hole` (`holeID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `stats`
--
ALTER TABLE `stats`
  ADD CONSTRAINT `stats_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
