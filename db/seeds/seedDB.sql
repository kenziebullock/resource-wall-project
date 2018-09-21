\c midterm

DELETE FROM likes;
DELETE FROM rates;
DELETE FROM comments;
DELETE FROM resources;
DELETE FROM users;

INSERT INTO users (name, email, password, avatar) VALUES
('Alice', 'alice@gmail.com', 'alice', 'https://cdn.iconscout.com/icon/free/png-256/avatar-369-456321.png');

INSERT INTO users (name, email, password, avatar) VALUES
('Bob', 'bob@gmail.com', 'bob', 'https://cdn.iconscout.com/icon/free/png-256/avatar-369-456321.png');


