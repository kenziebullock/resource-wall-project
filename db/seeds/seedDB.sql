\c midterm

-- DELETE FROM likes;
-- DELETE FROM rates;
-- DELETE FROM comments;
-- DELETE FROM resources;
-- DELETE FROM users;

-- ALTER TABLE resources ALTER COLUMN description TYPE TEXT;

-- INSERT INTO users (name, email, password, avatar) VALUES
-- ('Alice', 'alice@gmail.com', 'alice', 'https://cdn.iconscout.com/icon/free/png-256/avatar-369-456321.png');

-- INSERT INTO users (name, email, password, avatar) VALUES
-- ('Bob', 'bob@gmail.com', 'bob', 'https://cdn.iconscout.com/icon/free/png-256/avatar-369-456321.png');

INSERT INTO resources (title, topic, description, url, user_id) VALUES 
('jQuery', 'Web Development', 'A feature-rich JavaScript library. It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API that works across a multitude of browsers. ', 'https://jquery.com/', 3),
('ReactJS', 'Web Development', 'React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.', 'https://reactjs.org/', 3),
('Express', 'Web Development', 'Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.', 'https://expressjs.com/', 3),
('Six Sigma', 'Business Management', 'Six Sigma is a disciplined, data-driven approach and methodology for eliminating defects (driving toward six standard deviations between the mean and the nearest specification limit) in any process – from manufacturing to transactional and from product to service.', 'https://www.isixsigma.com', 4),
('PMP', 'Business Management', 'The Project Management Professional (PMP)® is the most important industry-recognized certification for project managers.', 'https://www.pmi.org/', 4);


