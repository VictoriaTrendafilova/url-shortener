SET @@character_set_client='utf8mb4';
SET @@collation_connection='utf8mb4_unicode_ci';

CREATE DATABASE IF NOT EXISTS urls_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON urls_db.* TO 'admin'@'localhost';

USE urls_db;

DROP TABLE IF EXISTS opr_urls;
CREATE TABLE opr_urls (
	url_id INT(11) NOT NULL AUTO_INCREMENT,
	long_url VARCHAR(50) COLLATE utf8mb4_unicode_ci NOT NULL,
	short_url CHAR(8) COLLATE utf8mb4_unicode_ci NOT NULL,
	PRIMARY KEY (url_id),
	UNIQUE KEY UQ_long_url (long_url),
	UNIQUE KEY UQ_short_url (short_url)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;