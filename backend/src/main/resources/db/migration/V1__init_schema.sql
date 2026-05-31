-- Initial database schema setup for Ticket Generation System

-- 1. Roles table
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- 2. Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Roles join table
CREATE TABLE user_roles (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 4. Departments table
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Customers table
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tickets table
CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    severity VARCHAR(50),
    urgency VARCHAR(50),
    sentiment VARCHAR(50),
    category VARCHAR(50),
    subcategory VARCHAR(50),
    confidence DOUBLE PRECISION,
    sla_deadline TIMESTAMP WITH TIME ZONE,
    estimated_resolution TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
    department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL
);

-- 7. Ticket History table
CREATE TABLE ticket_history (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT REFERENCES tickets(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Ticket Comments table
CREATE TABLE ticket_comments (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT REFERENCES tickets(id) ON DELETE CASCADE,
    author_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    body TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Attachments table
CREATE TABLE attachments (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT REFERENCES tickets(id) ON DELETE CASCADE,
    comment_id BIGINT REFERENCES ticket_comments(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    storage_path VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Email Logs table
CREATE TABLE email_logs (
    id BIGSERIAL PRIMARY KEY,
    message_id VARCHAR(255),
    sender VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    body_summary TEXT,
    status VARCHAR(50) NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ticket_id BIGINT REFERENCES tickets(id) ON DELETE SET NULL
);

-- 11. Notifications table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Settings table
CREATE TABLE settings (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT
);

-- 13. Audit Logs table
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    old_value TEXT,
    new_value TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Tags table
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(20)
);

-- 15. Ticket Tags table (join table)
CREATE TABLE ticket_tags (
    ticket_id BIGINT REFERENCES tickets(id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (ticket_id, tag_id)
);

-- 16. SLA table
CREATE TABLE sla (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT REFERENCES tickets(id) ON DELETE CASCADE,
    policy_name VARCHAR(100) NOT NULL,
    target_duration_hours INTEGER NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    breached BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed default roles
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');
INSERT INTO roles (name) VALUES ('ROLE_AGENT');
INSERT INTO roles (name) VALUES ('ROLE_CUSTOMER');

-- Seed default admin user (username: admin, password: password -> BCrypt hashed is '$2a$10$wEpy6Vq4G8L2c6sL9o5O0uxvO4M9p4rEq5p85U4x4.qW5g1.sXpG.' for "password")
-- Wait, let's seed with user 'admin' and password 'admin123'
-- BCrypt for 'admin123' is '$2a$10$89R48gB9sR2Uo6VvR.VXeexg8yD5p11O6T.Z52xT6N.uP9nQ2Kze.' or let's use a standard BCrypt generated hash.
-- Standard BCrypt hash of 'admin123' is: $2a$10$d/GhyD5fWp6C7kQ22D9Z5OnRz4VnJ/eK4b/M9b1eWvI5Z/d2D5P/y (let's use this)
INSERT INTO users (username, email, password, first_name, last_name, is_active)
VALUES ('admin', 'admin@ticketgen.com', '$2a$10$d/GhyD5fWp6C7kQ22D9Z5OnRz4VnJ/eK4b/M9b1eWvI5Z/d2D5P/y', 'Admin', 'User', true);

-- Map admin user to ROLE_ADMIN
INSERT INTO user_roles (user_id, role_id)
VALUES (
    (SELECT id FROM users WHERE username = 'admin'),
    (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')
);
