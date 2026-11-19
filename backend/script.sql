CREATE DATABASE db_estante_viva;

Use db_estante_viva;

CREATE TABLE IF NOT EXISTS tb_livro (
id_livro INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
titulo VARCHAR(150) NOT NULL,
autor VARCHAR(120) NOT NULL, 
preco decimal (10,2) NOT NULL,
quantidade_estoque INT NOT NULL
);

SELECT * FROM;