--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_modified_column(); Type: FUNCTION; Schema: public; Owner: shamilkv
--

CREATE FUNCTION public.update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_modified_column() OWNER TO shamilkv;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: shamilkv
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(500),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO shamilkv;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: shamilkv
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO shamilkv;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shamilkv
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: shamilkv
--

CREATE TABLE public.customers (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    phone character varying(20),
    email character varying(100),
    address character varying(255),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.customers OWNER TO shamilkv;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: shamilkv
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_id_seq OWNER TO shamilkv;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shamilkv
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: shamilkv
--

CREATE TABLE public.order_items (
    id bigint NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(38,2) NOT NULL,
    subtotal numeric(38,2) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.order_items OWNER TO shamilkv;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: shamilkv
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_items_id_seq OWNER TO shamilkv;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shamilkv
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: shamilkv
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    order_number character varying(50) NOT NULL,
    order_date timestamp without time zone NOT NULL,
    customer_id bigint,
    user_id bigint,
    total_amount numeric(38,2) NOT NULL,
    status character varying(20) NOT NULL,
    payment_method character varying(20),
    payment_reference character varying(100),
    table_id bigint,
    order_type character varying(20),
    number_of_guests integer,
    special_instructions text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT orders_order_type_check CHECK (((order_type)::text = ANY ((ARRAY['DINE_IN'::character varying, 'TAKEOUT'::character varying, 'DELIVERY'::character varying])::text[]))),
    CONSTRAINT orders_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['CASH'::character varying, 'CREDIT_CARD'::character varying, 'DEBIT_CARD'::character varying, 'MOBILE_PAYMENT'::character varying])::text[]))),
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'IN_PROGRESS'::character varying, 'READY'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[])))
);


ALTER TABLE public.orders OWNER TO shamilkv;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: shamilkv
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO shamilkv;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shamilkv
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: shamilkv
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(500),
    price numeric(38,2) NOT NULL,
    stock_quantity integer NOT NULL,
    sku character varying(50),
    barcode character varying(50),
    category_id bigint,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.products OWNER TO shamilkv;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: shamilkv
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO shamilkv;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shamilkv
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: restaurant_tables; Type: TABLE; Schema: public; Owner: shamilkv
--

CREATE TABLE public.restaurant_tables (
    id bigint NOT NULL,
    table_number character varying(50) NOT NULL,
    capacity integer NOT NULL,
    status character varying(20),
    location character varying(50),
    current_order_id bigint,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    height integer,
    positionx integer,
    positiony integer,
    shape character varying(255),
    width integer,
    CONSTRAINT restaurant_tables_status_check CHECK (((status)::text = ANY ((ARRAY['AVAILABLE'::character varying, 'OCCUPIED'::character varying, 'RESERVED'::character varying, 'CLEANING'::character varying])::text[])))
);


ALTER TABLE public.restaurant_tables OWNER TO shamilkv;

--
-- Name: restaurant_tables_id_seq; Type: SEQUENCE; Schema: public; Owner: shamilkv
--

CREATE SEQUENCE public.restaurant_tables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.restaurant_tables_id_seq OWNER TO shamilkv;

--
-- Name: restaurant_tables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shamilkv
--

ALTER SEQUENCE public.restaurant_tables_id_seq OWNED BY public.restaurant_tables.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: shamilkv
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    name character varying(20) NOT NULL
);


ALTER TABLE public.roles OWNER TO shamilkv;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: shamilkv
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO shamilkv;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shamilkv
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: shamilkv
--

CREATE TABLE public.user_roles (
    user_id bigint NOT NULL,
    role_id bigint NOT NULL
);


ALTER TABLE public.user_roles OWNER TO shamilkv;

--
-- Name: users; Type: TABLE; Schema: public; Owner: shamilkv
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(120) NOT NULL,
    full_name character varying(100) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.users OWNER TO shamilkv;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: shamilkv
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO shamilkv;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shamilkv
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: restaurant_tables id; Type: DEFAULT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.restaurant_tables ALTER COLUMN id SET DEFAULT nextval('public.restaurant_tables_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: shamilkv
--

COPY public.categories (id, name, description, created_at, updated_at) FROM stdin;
1	Food	All food items	2025-05-07 11:25:30.113464	2025-05-07 11:25:30.113464
2	Food	Food items	2025-05-07 11:46:11.375829	2025-05-07 11:46:11.375829
3	Electronics	Electronics	2025-05-07 12:00:24.117167	2025-05-07 12:00:24.117167
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: shamilkv
--

COPY public.customers (id, name, phone, email, address, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: shamilkv
--

COPY public.order_items (id, order_id, product_id, quantity, unit_price, subtotal, created_at, updated_at) FROM stdin;
1	8	2	1	3.00	3.00	2025-05-07 12:26:39.548272	2025-05-07 12:26:39.548272
11	9	2	1	3.00	3.00	2025-05-07 14:36:59.84246	2025-05-07 14:36:59.84246
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: shamilkv
--

COPY public.orders (id, order_number, order_date, customer_id, user_id, total_amount, status, payment_method, payment_reference, table_id, order_type, number_of_guests, special_instructions, created_at, updated_at) FROM stdin;
1	ORD-20250507-6454	2025-05-07 02:55:01.45	\N	1	0.00	PENDING	\N	\N	15	DINE_IN	1	as	2025-05-07 06:55:01.549154	2025-05-07 06:55:01.549154
2	ORD-20250507-55C8	2025-05-07 03:06:16.623	\N	1	0.00	PENDING	\N	\N	15	DINE_IN	1		2025-05-07 07:06:16.658996	2025-05-07 07:06:16.658996
3	ORD-20250507-5DB2	2025-05-07 03:07:28.589	\N	1	0.00	PENDING	\N	\N	2	DINE_IN	1	spv	2025-05-07 07:07:28.615547	2025-05-07 07:07:28.615547
4	ORD-20250507-E3A0	2025-05-07 03:09:45.761	\N	1	0.00	PENDING	\N	\N	2	DINE_IN	1	;	2025-05-07 07:09:45.815446	2025-05-07 07:09:45.815446
5	ORD-20250507-595C	2025-05-07 03:10:06.436	\N	1	0.00	PENDING	\N	\N	1	DINE_IN	1	we	2025-05-07 07:10:06.479596	2025-05-07 07:10:06.479596
6	ORD-20250507-4F22	2025-05-07 03:14:21.008	\N	1	0.00	PENDING	\N	\N	3	DINE_IN	1	spicy	2025-05-07 07:14:21.040757	2025-05-07 07:14:21.040757
7	ORD-20250507-9DF2	2025-05-07 06:08:14.862	\N	1	0.00	PENDING	\N	\N	4	DINE_IN	1	w	2025-05-07 10:08:14.914301	2025-05-07 10:08:14.914301
8	ORD-20250507-A7F3	2025-05-07 06:12:40.579	\N	1	3.00	PENDING	\N	\N	5	DINE_IN	1	spicy	2025-05-07 10:12:40.595047	2025-05-07 12:26:39.576386
9	ORD-20250507-69AF	2025-05-07 10:20:47.972	\N	1	3.00	PENDING	\N	\N	5	DINE_IN	1		2025-05-07 14:20:48.05717	2025-05-07 14:36:59.953885
25	ORD-20250507-3C74	2025-05-07 11:07:08.062	\N	1	0.00	PENDING	\N	\N	\N	DINE_IN	1		2025-05-07 15:07:08.09189	2025-05-07 15:07:08.09189
26	ORD-20250507-3D1B	2025-05-07 11:07:08.122	\N	1	0.00	PENDING	\N	\N	3	DINE_IN	1		2025-05-07 15:07:08.133305	2025-05-07 15:07:08.133305
29	ORD-20250507-FF74	2025-05-07 11:08:22.603	\N	1	0.00	PENDING	\N	\N	\N	DINE_IN	1		2025-05-07 15:08:22.639522	2025-05-07 15:08:22.639522
30	ORD-20250507-CF7E	2025-05-07 11:08:22.661	\N	1	0.00	PENDING	\N	\N	6	DINE_IN	1		2025-05-07 15:08:22.670332	2025-05-07 15:08:22.670332
31	ORD-20250508-E4C4	2025-05-08 09:38:53.504	\N	1	0.00	PENDING	\N	\N	\N	DINE_IN	1		2025-05-08 13:38:53.54172	2025-05-08 13:38:53.54172
32	ORD-20250508-2604	2025-05-08 09:39:24.669	\N	1	0.00	PENDING	\N	\N	\N	DINE_IN	1		2025-05-08 13:39:24.679838	2025-05-08 13:39:24.679838
33	ORD-20250508-C7AD	2025-05-08 10:08:00.786	\N	1	0.00	PENDING	\N	\N	\N	DINE_IN	1		2025-05-08 14:08:00.803149	2025-05-08 14:08:00.803149
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: shamilkv
--

COPY public.products (id, name, description, price, stock_quantity, sku, barcode, category_id, active, created_at, updated_at) FROM stdin;
2	Pasta	past food	3.00	10	pasta01	pasta01	1	t	2025-05-07 11:26:07.58949	2025-05-07 11:26:07.58949
3	Magi	Fast food	12.00	12	magi01	magi01	1	t	2025-05-07 11:27:12.309512	2025-05-07 11:59:25.617262
4	HP-Laptop	HP Laptops	200.00	10	Laptop01	Laptop001	3	t	2025-05-07 12:01:20.114174	2025-05-07 12:01:20.114174
\.


--
-- Data for Name: restaurant_tables; Type: TABLE DATA; Schema: public; Owner: shamilkv
--

COPY public.restaurant_tables (id, table_number, capacity, status, location, current_order_id, created_at, updated_at, height, positionx, positiony, shape, width) FROM stdin;
7	T7	8	AVAILABLE	Indoor	\N	2025-05-07 06:46:22.381071	2025-05-07 06:46:22.381071	\N	\N	\N	\N	\N
8	T8	8	AVAILABLE	Indoor	\N	2025-05-07 06:46:22.381071	2025-05-07 06:46:22.381071	\N	\N	\N	\N	\N
9	O1	2	AVAILABLE	Outdoor	\N	2025-05-07 06:46:22.381071	2025-05-07 06:46:22.381071	\N	\N	\N	\N	\N
10	O2	2	AVAILABLE	Outdoor	\N	2025-05-07 06:46:22.381071	2025-05-07 06:46:22.381071	\N	\N	\N	\N	\N
11	O3	4	AVAILABLE	Outdoor	\N	2025-05-07 06:46:22.381071	2025-05-07 06:46:22.381071	\N	\N	\N	\N	\N
12	O4	4	AVAILABLE	Outdoor	\N	2025-05-07 06:46:22.381071	2025-05-07 06:46:22.381071	\N	\N	\N	\N	\N
13	B1	6	AVAILABLE	Balcony	\N	2025-05-07 06:46:22.381071	2025-05-07 06:46:22.381071	\N	\N	\N	\N	\N
14	B2	6	AVAILABLE	Balcony	\N	2025-05-07 06:46:22.381071	2025-05-07 06:46:22.381071	\N	\N	\N	\N	\N
15	VIP1	10	AVAILABLE	VIP Room	\N	2025-05-07 06:46:22.381071	2025-05-07 07:06:44.279963	\N	\N	\N	\N	\N
2	T2	2	AVAILABLE	Indoor	\N	2025-05-07 06:46:22.381071	2025-05-07 07:09:51.006138	\N	\N	\N	\N	\N
1	T1	2	AVAILABLE	Indoor	\N	2025-05-07 06:46:22.381071	2025-05-07 10:08:24.336271	\N	\N	\N	\N	\N
4	T4	4	AVAILABLE	Indoor	\N	2025-05-07 06:46:22.381071	2025-05-07 10:12:30.445145	\N	\N	\N	\N	\N
5	T5	6	AVAILABLE	Indoor	9	2025-05-07 06:46:22.381071	2025-05-07 15:07:44.455897	\N	\N	\N	\N	\N
3	T3	4	AVAILABLE	Indoor	\N	2025-05-07 06:46:22.381071	2025-05-07 15:07:48.857035	\N	\N	\N	\N	\N
6	T6	6	AVAILABLE	Indoor	\N	2025-05-07 06:46:22.381071	2025-05-07 15:09:35.356118	\N	\N	\N	\N	\N
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: shamilkv
--

COPY public.roles (id, name) FROM stdin;
1	ROLE_USER
2	ROLE_CASHIER
3	ROLE_MANAGER
4	ROLE_ADMIN
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: shamilkv
--

COPY public.user_roles (user_id, role_id) FROM stdin;
1	4
3	4
4	4
5	3
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: shamilkv
--

COPY public.users (id, username, email, password, full_name, created_at, updated_at, active) FROM stdin;
1	admin	admin@erp-pos.com	$2a$10$ixlPY3AAd4ty1l6E2IsQ9OFZi2ba9ZQE0bP7RFcGIWNhyFrrT3YUi	Administrator	2025-05-07 06:46:22.375918	2025-05-07 06:46:22.375918	t
3	test	test@erp-pos.com	$2a$10$8RjyG9E4y2Qb0fKxDylExechtV26UJVV6pwhC8OyFmFGE.OGk6YfS	Test User	2025-05-07 06:46:22.380465	2025-05-07 06:46:22.380465	t
4	admin2	admin2@example.com	$2a$10$kz7n4JvpS9VYjcCyHS6zV.j88grRdayqzc96bVl8PH0GfV9A8Tqjq	Admin User 2	2025-05-07 06:47:17.045699	2025-05-07 06:47:17.045699	t
5	manager	manager@example.com	$2a$10$0KqAzEJo0NIcCsffBT3tjOFLBuuXvp.tc7Jd10LhXzj4L7.G3Bggq	Manager User	2025-05-07 07:00:36.098337	2025-05-07 07:00:36.098337	t
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: shamilkv
--

SELECT pg_catalog.setval('public.categories_id_seq', 3, true);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: shamilkv
--

SELECT pg_catalog.setval('public.customers_id_seq', 1, false);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: shamilkv
--

SELECT pg_catalog.setval('public.order_items_id_seq', 19, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: shamilkv
--

SELECT pg_catalog.setval('public.orders_id_seq', 33, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: shamilkv
--

SELECT pg_catalog.setval('public.products_id_seq', 4, true);


--
-- Name: restaurant_tables_id_seq; Type: SEQUENCE SET; Schema: public; Owner: shamilkv
--

SELECT pg_catalog.setval('public.restaurant_tables_id_seq', 15, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: shamilkv
--

SELECT pg_catalog.setval('public.roles_id_seq', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: shamilkv
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: restaurant_tables restaurant_tables_pkey; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.restaurant_tables
    ADD CONSTRAINT restaurant_tables_pkey PRIMARY KEY (id);


--
-- Name: restaurant_tables restaurant_tables_table_number_key; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.restaurant_tables
    ADD CONSTRAINT restaurant_tables_table_number_key UNIQUE (table_number);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: users uk6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: users ukr43af9ap4edm43mmtq01oddj6; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT ukr43af9ap4edm43mmtq01oddj6 UNIQUE (username);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: orders fk_orders_table; Type: FK CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_orders_table FOREIGN KEY (table_id) REFERENCES public.restaurant_tables(id);


--
-- Name: restaurant_tables fk_tables_current_order; Type: FK CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.restaurant_tables
    ADD CONSTRAINT fk_tables_current_order FOREIGN KEY (current_order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shamilkv
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

