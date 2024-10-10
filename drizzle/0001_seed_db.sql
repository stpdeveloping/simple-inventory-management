-- Custom SQL migration file, put you code below! --
INSERT INTO Products([name], [description], price, stock) VALUES
    ('GeForce RTX 4060', 'Mid-end GPU', 1299, 100),
    ('GeForce RTX 4070', 'Mid-end GPU', 2598, 76),
    ('GeForce RTX 4080 Super', 'High-end GPU', 4599, 133),
    ('GeForce RTX 4090', 'High-end GPU', 8999.99, 113);