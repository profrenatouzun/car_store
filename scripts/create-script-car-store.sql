
CREATE TABLE brand (
    brand_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE model (
    model_id SERIAL PRIMARY KEY,
    brand_id INT NOT NULL REFERENCES brand(brand_id),
    name VARCHAR(100) NOT NULL,
    UNIQUE (brand_id, name)
);

CREATE TABLE fuel_type (
    fuel_type CHAR(1) PRIMARY KEY CHECK (fuel_type IN ('G','A','D','F')),
    description VARCHAR(50) NOT NULL
);

CREATE TABLE vehicles (
    vehicle_id SERIAL PRIMARY KEY,
    brand_id INT NOT NULL REFERENCES brand(brand_id),
    model_id INT NOT NULL REFERENCES model(model_id),
    year_manufacture INT NOT NULL,
    fuel_type CHAR(1) NOT NULL REFERENCES fuel_type(fuel_type),
    simple_description TEXT,
    mileage INT,
    ad_price NUMERIC(12,2),
    fipe_price NUMERIC(12,2),
    created_at TIMESTAMP DEFAULT NOW(),
    CHECK (year_manufacture >= 1900 AND year_manufacture <= EXTRACT(YEAR FROM NOW()) + 1)
);

CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE vehicle_items (
    vehicle_id INT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES items(item_id),
    PRIMARY KEY (vehicle_id, item_id)
);

CREATE TABLE vehicle_photos (
    photo_id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL
);

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(120),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL REFERENCES vehicles(vehicle_id),
    customer_id INT NOT NULL REFERENCES customers(customer_id),
    sale_price NUMERIC(12,2) NOT NULL,
    sale_date DATE NOT NULL DEFAULT CURRENT_DATE
);

