
INSERT INTO users (email, password, last_name, first_name, is_admin) VALUES
('admin@artchallenge.com', '$2b$10$abcdefghijklmnopqrstuv', 'Boss', 'Admin', TRUE),
('alice@test.com', '$2b$10$abcdefghijklmnopqrstuv', 'Smith', 'Alice', FALSE),
('bob@test.com', '$2b$10$abcdefghijklmnopqrstuv', 'Jones', 'Bob', FALSE);


INSERT INTO challenges (theme_title, theme_description, required_picture_url, start_date, end_date, is_archived) VALUES
('Cyberpunk Cityscape', 'Turn a normal city photo into a neon-soaked cyberpunk dystopia.', 'challenges/1/base_city.jpg', '2025-10-01 00:00:00', '2025-10-31 23:59:59', TRUE),
('Enchanted Forest', 'Edit this woods picture to look magical and fairy-tale inspired.', 'challenges/2/base_woods.jpg', '2026-03-01 00:00:00', '2026-03-31 23:59:59', FALSE);


INSERT INTO entries (challenge_id, user_id, edited_picture_url, is_hidden) VALUES
(1, 2, 'entries/1/2/alice_cyberpunk.jpg', FALSE), -- Alice's entry for Cyberpunk
(1, 3, 'entries/1/3/bob_cyberpunk.jpg', FALSE),   -- Bob's entry for Cyberpunk
(2, 2, 'entries/2/2/alice_forest.jpg', FALSE);    -- Alice's entry for Forest

INSERT INTO comments (entry_id, user_id, content) VALUES
(1, 3, 'Wow Alice, the neon reflections in the puddles are incredibly realistic!'),
(1, 1, 'Great use of color grading here. Well done.'),
(2, 2, 'Thanks for the feedback guys! Bob, I loved the gritty texture on yours.'),
(3, 3, 'The lighting rays coming through the trees look completely magical.');


INSERT INTO votes (user_id, entry_id, creativity_rating, technical_rating, theme_respect_rating) VALUES
(3, 1, 4.5, 5.0, 4.0), -- Bob votes on Alice's Cyberpunk entry
(1, 1, 5.0, 4.5, 4.5), -- Admin votes on Alice's Cyberpunk entry
(2, 2, 4.0, 3.5, 5.0), -- Alice votes on Bob's Cyberpunk entry
(3, 3, 5.0, 5.0, 4.5); -- Bob votes on Alice's Forest entry