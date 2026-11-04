INSERT INTO roles(name) VALUES ('ROLE_ADMIN'), ('ROLE_MANAGER'), ('ROLE_USER');

INSERT INTO categories(name, description) VALUES
('Laptop','Portable computers'),
('Desktop','Desktop computers'),
('Monitor','Display screens'),
('Printer','Printing devices'),
('Networking','Routers, switches, modems'),
('Accessory','Keyboards, mice, cables, etc.');

INSERT INTO inventory_items(sku, name, category, quantity, reorder_level, supplier, unit_price) VALUES
('INV-KB-001','USB Keyboard','Accessory',25,10,'Logitech',800.00),
('INV-MS-002','Wireless Mouse','Accessory',8,10,'Logitech',1200.00),
('INV-CB-003','HDMI Cable 2m','Accessory',4,15,'Amazon Basics',300.00);