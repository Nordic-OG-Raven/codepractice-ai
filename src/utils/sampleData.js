/**
 * Sample data for SQL exercises
 * This will be loaded into sql.js
 */

export const sampleDataSQL = `
-- Create tables
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  country TEXT,
  signup_date DATE
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price REAL,
  stock INTEGER
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  order_date DATE,
  total_amount REAL,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert sample customers
INSERT INTO customers (id, name, email, country, signup_date) VALUES
(1, 'Alice Johnson', 'alice@email.com', 'USA', '2024-01-15'),
(2, 'Bob Smith', 'bob@email.com', 'Canada', '2024-02-20'),
(3, 'Carol White', 'carol@email.com', 'UK', '2024-03-10'),
(4, 'David Lee', 'david@email.com', 'USA', '2024-04-05'),
(5, 'Emma Davis', 'emma@email.com', 'Australia', '2024-05-12'),
(6, 'Frank Miller', 'frank@email.com', 'USA', '2024-06-08'),
(7, 'Grace Wilson', 'grace@email.com', 'Canada', '2024-07-15'),
(8, 'Henry Brown', 'henry@email.com', 'UK', '2024-08-20');

-- Insert sample products
INSERT INTO products (id, name, category, price, stock) VALUES
(1, 'Laptop', 'Electronics', 999.99, 50),
(2, 'Mouse', 'Electronics', 29.99, 200),
(3, 'Keyboard', 'Electronics', 79.99, 150),
(4, 'Monitor', 'Electronics', 299.99, 75),
(5, 'Desk Chair', 'Furniture', 199.99, 100),
(6, 'Desk Lamp', 'Furniture', 49.99, 120),
(7, 'Notebook', 'Stationery', 9.99, 500),
(8, 'Pen Set', 'Stationery', 14.99, 300);

-- Insert sample orders
INSERT INTO orders (id, customer_id, product_id, quantity, order_date, total_amount) VALUES
(1, 1, 1, 1, '2024-01-20', 999.99),
(2, 1, 2, 2, '2024-01-20', 59.98),
(3, 2, 3, 1, '2024-02-25', 79.99),
(4, 3, 4, 1, '2024-03-15', 299.99),
(5, 4, 5, 1, '2024-04-10', 199.99),
(6, 4, 6, 2, '2024-04-10', 99.98),
(7, 5, 7, 5, '2024-05-20', 49.95),
(8, 6, 1, 1, '2024-06-12', 999.99),
(9, 7, 2, 3, '2024-07-18', 89.97),
(10, 8, 8, 2, '2024-08-25', 29.98),
(11, 1, 7, 3, '2024-09-01', 29.97),
(12, 2, 5, 1, '2024-09-05', 199.99),
(13, 3, 2, 1, '2024-09-10', 29.99),
(14, 4, 4, 2, '2024-09-15', 599.98),
(15, 5, 3, 1, '2024-09-20', 79.99);
`

