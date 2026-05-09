-- =========================================================
-- SaaS Maintenance Platform
-- PostgreSQL 15+
-- Plataforma Multi-Tenant de Mantenimiento/Reparaciones
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- TENANTS
-- =========================================================

CREATE TABLE tenants (
    id BIGSERIAL PRIMARY KEY,

    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    name VARCHAR(200) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,

    email VARCHAR(150),
    phone VARCHAR(50),

    logo_path VARCHAR(500),

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- CATALOG TABLES
-- =========================================================

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE client_types (
    id BIGSERIAL PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE client_statuses (
    id BIGSERIAL PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE request_statuses (
    id BIGSERIAL PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE maintenance_statuses (
    id BIGSERIAL PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE equipment_statuses (
    id BIGSERIAL PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE equipment_types (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(150) NOT NULL,
    description TEXT
);

CREATE TABLE service_catalog (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(150) NOT NULL,
    description TEXT,

    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE product_types (
    id BIGSERIAL PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,

    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    tenant_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,

    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),

    password VARCHAR(255) NOT NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    last_login_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_users_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id),

    CONSTRAINT uq_users_tenant_email
        UNIQUE (tenant_id, email)
);

-- =========================================================
-- CLIENTS
-- =========================================================

CREATE TABLE clients (
    id BIGSERIAL PRIMARY KEY,

    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    tenant_id BIGINT NOT NULL,

    client_type_id BIGINT NOT NULL,
    status_id BIGINT NOT NULL,

    display_name VARCHAR(200) NOT NULL,

    notes TEXT,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_by_user_id BIGINT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_clients_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_clients_type
        FOREIGN KEY (client_type_id)
        REFERENCES client_types(id),

    CONSTRAINT fk_clients_status
        FOREIGN KEY (status_id)
        REFERENCES client_statuses(id),

    CONSTRAINT fk_clients_created_user
        FOREIGN KEY (created_by_user_id)
        REFERENCES users(id)
);

-- =========================================================
-- CLIENT PERSON DETAILS
-- =========================================================

CREATE TABLE client_person_details (
    client_id BIGINT PRIMARY KEY,

    first_names VARCHAR(150) NOT NULL,
    last_names VARCHAR(150) NOT NULL,

    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(100) NOT NULL UNIQUE,

    birth_date DATE,

    CONSTRAINT fk_person_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE
);

-- =========================================================
-- CLIENT COMPANY DETAILS
-- =========================================================

CREATE TABLE client_company_details (
    client_id BIGINT PRIMARY KEY,

    legal_name VARCHAR(200) NOT NULL,
    trade_name VARCHAR(200),

    nit VARCHAR(100) NOT NULL UNIQUE,

    legal_representative VARCHAR(200),

    website VARCHAR(200),

    CONSTRAINT fk_company_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE
);

-- =========================================================
-- CLIENT CONTACTS
-- =========================================================

CREATE TABLE client_contacts (
    id BIGSERIAL PRIMARY KEY,

    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    tenant_id BIGINT NOT NULL,

    client_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,

    phone VARCHAR(50),
    email VARCHAR(150),

    position VARCHAR(100),

    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_contacts_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_contacts_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE
);

-- =========================================================
-- CLIENT ADDRESSES
-- =========================================================

CREATE TABLE client_addresses (
    id BIGSERIAL PRIMARY KEY,

    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    tenant_id BIGINT NOT NULL,

    client_id BIGINT NOT NULL,

    address_line VARCHAR(255) NOT NULL,

    city VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    country VARCHAR(100) NOT NULL DEFAULT 'Colombia',

    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),

    notes TEXT,

    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_addresses_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_addresses_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE
);

-- =========================================================
-- EQUIPMENTS
-- =========================================================

CREATE TABLE equipments (
    id BIGSERIAL PRIMARY KEY,

    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    tenant_id BIGINT NOT NULL,

    client_id BIGINT NOT NULL,

    address_id BIGINT,

    equipment_type_id BIGINT NOT NULL,
    current_status_id BIGINT NOT NULL,

    internal_code VARCHAR(100) NOT NULL,

    brand VARCHAR(100),
    model VARCHAR(100),

    serial_number VARCHAR(150),

    purchase_date DATE,

    warranty_start_date DATE,
    warranty_end_date DATE,

    installation_date DATE,

    technical_details TEXT,

    last_maintenance_at TIMESTAMP,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_equipments_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_equipments_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id),

    CONSTRAINT fk_equipments_address
        FOREIGN KEY (address_id)
        REFERENCES client_addresses(id),

    CONSTRAINT fk_equipments_type
        FOREIGN KEY (equipment_type_id)
        REFERENCES equipment_types(id),

    CONSTRAINT fk_equipments_status
        FOREIGN KEY (current_status_id)
        REFERENCES equipment_statuses(id),

    CONSTRAINT uq_equipment_internal_code
        UNIQUE (tenant_id, internal_code)
);

-- =========================================================
-- EQUIPMENT STATUS HISTORY
-- =========================================================

CREATE TABLE equipment_status_history (
    id BIGSERIAL PRIMARY KEY,

    tenant_id BIGINT NOT NULL,

    equipment_id BIGINT NOT NULL,

    status_id BIGINT NOT NULL,

    changed_by_user_id BIGINT NOT NULL,

    changed_at TIMESTAMP NOT NULL DEFAULT NOW(),

    notes TEXT,

    CONSTRAINT fk_equipment_history_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_equipment_history_equipment
        FOREIGN KEY (equipment_id)
        REFERENCES equipments(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_equipment_history_status
        FOREIGN KEY (status_id)
        REFERENCES equipment_statuses(id),

    CONSTRAINT fk_equipment_history_user
        FOREIGN KEY (changed_by_user_id)
        REFERENCES users(id)
);

-- =========================================================
-- INCOMING REQUESTS
-- =========================================================

CREATE TABLE incoming_requests (
    id BIGSERIAL PRIMARY KEY,

    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    tenant_id BIGINT NOT NULL,

    client_id BIGINT,

    requester_name VARCHAR(150) NOT NULL,

    phone VARCHAR(50),
    email VARCHAR(150),

    service_id BIGINT NOT NULL,

    status_id BIGINT NOT NULL,

    source VARCHAR(100),

    notes TEXT,

    assigned_to_user_id BIGINT,

    discarded_reason TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_requests_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_requests_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id),

    CONSTRAINT fk_requests_service
        FOREIGN KEY (service_id)
        REFERENCES service_catalog(id),

    CONSTRAINT fk_requests_status
        FOREIGN KEY (status_id)
        REFERENCES request_statuses(id),

    CONSTRAINT fk_requests_assigned_user
        FOREIGN KEY (assigned_to_user_id)
        REFERENCES users(id)
);

-- =========================================================
-- REQUEST ACTIONS
-- =========================================================

CREATE TABLE request_actions (
    id BIGSERIAL PRIMARY KEY,

    tenant_id BIGINT NOT NULL,

    request_id BIGINT NOT NULL,

    action_type VARCHAR(50) NOT NULL,

    action_by_user_id BIGINT NOT NULL,

    action_at TIMESTAMP NOT NULL DEFAULT NOW(),

    comment TEXT,

    CONSTRAINT fk_request_actions_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_request_actions_request
        FOREIGN KEY (request_id)
        REFERENCES incoming_requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_request_actions_user
        FOREIGN KEY (action_by_user_id)
        REFERENCES users(id)
);

-- =========================================================
-- MAINTENANCE ORDERS
-- =========================================================

CREATE TABLE maintenance_orders (
    id BIGSERIAL PRIMARY KEY,

    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    tenant_id BIGINT NOT NULL,

    request_id BIGINT,

    client_id BIGINT NOT NULL,

    equipment_id BIGINT,

    address_id BIGINT,

    service_id BIGINT NOT NULL,

    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,

    assigned_user_id BIGINT NOT NULL,

    status_id BIGINT NOT NULL,

    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM'
        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),

    notes TEXT,

    created_by_user_id BIGINT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_orders_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_orders_request
        FOREIGN KEY (request_id)
        REFERENCES incoming_requests(id),

    CONSTRAINT fk_orders_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id),

    CONSTRAINT fk_orders_equipment
        FOREIGN KEY (equipment_id)
        REFERENCES equipments(id),

    CONSTRAINT fk_orders_address
        FOREIGN KEY (address_id)
        REFERENCES client_addresses(id),

    CONSTRAINT fk_orders_service
        FOREIGN KEY (service_id)
        REFERENCES service_catalog(id),

    CONSTRAINT fk_orders_assigned_user
        FOREIGN KEY (assigned_user_id)
        REFERENCES users(id),

    CONSTRAINT fk_orders_status
        FOREIGN KEY (status_id)
        REFERENCES maintenance_statuses(id),

    CONSTRAINT fk_orders_created_user
        FOREIGN KEY (created_by_user_id)
        REFERENCES users(id)
);

-- =========================================================
-- MAINTENANCE EXECUTIONS
-- =========================================================

CREATE TABLE maintenance_executions (
    id BIGSERIAL PRIMARY KEY,

    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    tenant_id BIGINT NOT NULL,

    maintenance_order_id BIGINT NOT NULL UNIQUE,

    diagnostic TEXT,

    work_done TEXT NOT NULL,

    warranty_applies BOOLEAN NOT NULL DEFAULT FALSE,

    warranty_details TEXT,

    recommendations TEXT,

    completed_at TIMESTAMP NOT NULL,

    completed_by_user_id BIGINT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_executions_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_executions_order
        FOREIGN KEY (maintenance_order_id)
        REFERENCES maintenance_orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_executions_user
        FOREIGN KEY (completed_by_user_id)
        REFERENCES users(id)
);

-- =========================================================
-- PRODUCTS
-- =========================================================

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,

    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    tenant_id BIGINT NOT NULL,

    product_type_id BIGINT NOT NULL,

    sku VARCHAR(100) NOT NULL,

    name VARCHAR(200) NOT NULL,

    description TEXT,

    stock_quantity NUMERIC(12,2) NOT NULL DEFAULT 0,

    minimum_stock NUMERIC(12,2) NOT NULL DEFAULT 0,

    unit_cost NUMERIC(12,2),

    sale_price NUMERIC(12,2),

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_products_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_products_type
        FOREIGN KEY (product_type_id)
        REFERENCES product_types(id),

    CONSTRAINT uq_products_sku
        UNIQUE (tenant_id, sku)
);

-- =========================================================
-- MAINTENANCE EXECUTION PARTS
-- =========================================================

CREATE TABLE maintenance_execution_parts (
    id BIGSERIAL PRIMARY KEY,

    tenant_id BIGINT NOT NULL,

    execution_id BIGINT NOT NULL,

    product_id BIGINT NOT NULL,

    quantity NUMERIC(10,2) NOT NULL DEFAULT 1,

    unit_cost NUMERIC(12,2),

    notes TEXT,

    CONSTRAINT fk_execution_parts_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_execution_parts_execution
        FOREIGN KEY (execution_id)
        REFERENCES maintenance_executions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_execution_parts_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
);

-- =========================================================
-- FILES
-- =========================================================

CREATE TABLE files (
    id BIGSERIAL PRIMARY KEY,

    uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    tenant_id BIGINT NOT NULL,

    storage_path VARCHAR(500) NOT NULL,

    original_name VARCHAR(255) NOT NULL,

    mime_type VARCHAR(100) NOT NULL,

    size_bytes BIGINT NOT NULL,

    uploaded_by_user_id BIGINT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_files_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_files_user
        FOREIGN KEY (uploaded_by_user_id)
        REFERENCES users(id)
);

-- =========================================================
-- MAINTENANCE EVIDENCE
-- =========================================================

CREATE TABLE maintenance_evidence (
    id BIGSERIAL PRIMARY KEY,

    tenant_id BIGINT NOT NULL,

    execution_id BIGINT NOT NULL,

    file_id BIGINT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_evidence_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id),

    CONSTRAINT fk_evidence_execution
        FOREIGN KEY (execution_id)
        REFERENCES maintenance_executions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_evidence_file
        FOREIGN KEY (file_id)
        REFERENCES files(id)
);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_users_tenant
    ON users(tenant_id);

CREATE INDEX idx_clients_tenant
    ON clients(tenant_id);

CREATE INDEX idx_contacts_tenant
    ON client_contacts(tenant_id);

CREATE INDEX idx_addresses_tenant
    ON client_addresses(tenant_id);

CREATE INDEX idx_equipments_tenant
    ON equipments(tenant_id);

CREATE INDEX idx_requests_tenant
    ON incoming_requests(tenant_id);

CREATE INDEX idx_orders_tenant
    ON maintenance_orders(tenant_id);

CREATE INDEX idx_executions_tenant
    ON maintenance_executions(tenant_id);

CREATE INDEX idx_products_tenant
    ON products(tenant_id);

CREATE INDEX idx_files_tenant
    ON files(tenant_id);

CREATE INDEX idx_orders_date
    ON maintenance_orders(scheduled_date);

CREATE INDEX idx_orders_status
    ON maintenance_orders(status_id);

CREATE INDEX idx_orders_assigned
    ON maintenance_orders(assigned_user_id);

CREATE INDEX idx_equipment_client
    ON equipments(client_id);

CREATE INDEX idx_execution_completed
    ON maintenance_executions(completed_at);

-- =========================================================
-- SEED DATA
-- =========================================================

INSERT INTO roles (code, name)
VALUES
('ADMIN', 'Administrador'),
('SUPERVISOR', 'Supervisor'),
('OPERARIO', 'Operario');

INSERT INTO client_types (code, name)
VALUES
('PERSON', 'Persona Natural'),
('COMPANY', 'Empresa');

INSERT INTO client_statuses (code, name)
VALUES
('ACTIVE', 'Activo'),
('INACTIVE', 'Inactivo');

INSERT INTO request_statuses (code, name)
VALUES
('PENDING', 'Pendiente'),
('ASSIGNED', 'Asignada'),
('DISCARDED', 'Descartada'),
('CONVERTED', 'Convertida');

INSERT INTO maintenance_statuses (code, name)
VALUES
('SCHEDULED', 'Programado'),
('IN_PROGRESS', 'En progreso'),
('COMPLETED', 'Completado'),
('CANCELLED', 'Cancelado');

INSERT INTO equipment_statuses (code, name)
VALUES
('ACTIVE', 'Activo'),
('IN_REPAIR', 'En reparación'),
('INACTIVE', 'Inactivo'),
('OUT_OF_SERVICE', 'Fuera de servicio');

INSERT INTO product_types (code, name)
VALUES
('SPARE_PART', 'Repuesto'),
('TOOL', 'Herramienta'),
('SUPPLY', 'Insumo');

INSERT INTO service_catalog (name, description, active)
VALUES
('Mantenimiento Preventivo', 'Servicio preventivo general', TRUE),
('Mantenimiento Correctivo', 'Reparación de equipos', TRUE),
('Instalación', 'Instalación de equipos', TRUE),
('Diagnóstico Técnico', 'Diagnóstico y revisión', TRUE);