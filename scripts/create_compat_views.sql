-- Create compatibility views so legacy code expecting `Artist` and `ArtistMedia`
-- tables can continue to run against a cPanel schema using `public_artists`.
--
-- Usage (on the target MySQL server):
-- mysql -u <user> -p <database> < create_compat_views.sql
-- OR run the statements in your preferred DB client.

/*
  NOTES:
  - This file creates two views:
    1) `Artist` maps columns from `public_artists` to the shape expected by the
       existing application code. Field names are adapted but may need tuning
       for your environment (email/phone/socialLinks are set to NULL here).
    2) `ArtistMedia` is created as an empty-rows view with the expected columns
       so queries like `SELECT ... FROM ArtistMedia WHERE artistId = ?` return
       zero rows instead of failing when there is no corresponding table.

  - If you have a real media table mapping artists -> media, replace the
    `ArtistMedia` view's SELECT with the real table mapping.
*/

CREATE OR REPLACE VIEW `Artist` AS
SELECT
  -- Create a reproducible string id from numeric id to satisfy callers expecting strings
  CONCAT('artist_', CAST(`id` AS CHAR)) AS `id`,
  `slug` AS `slug`,
  `name` AS `name`,
  -- keep `specialization` as `disciplines` (string). App code can split/parse.
  `specialization` AS `disciplines`,
  `biography` AS `bio`,
  `image_url` AS `profileImage`,
  NULL AS `email`,
  NULL AS `phone`,
  NULL AS `socialLinks`,
  `is_visible` AS `publicProfile`,
  0 AS `featured`,
  'PUBLISHED' AS `status`,
  `created_at` AS `createdAt`,
  `updated_at` AS `updatedAt`
FROM `public_artists`;

-- Minimal empty-view for ArtistMedia so legacy SELECTs succeed but return no rows
CREATE OR REPLACE VIEW `ArtistMedia` AS
SELECT
  CAST(NULL AS CHAR) AS `id`,
  CAST(NULL AS CHAR) AS `artistId`,
  '' AS `type`,
  '' AS `title`,
  '' AS `description`,
  '' AS `url`,
  0 AS `order`,
  0 AS `isPublic`,
  NULL AS `createdAt`,
  NULL AS `updatedAt`
WHERE 0;

-- End of file
