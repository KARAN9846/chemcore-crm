--
-- PostgreSQL database dump
--

\restrict QWXJlj6Re5VmQeN4hnDFmf0iSv75lIUSDQ74ksUOnxihuhayi1nFtG7GflQJaHa

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-05-19 11:08:05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 17903)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 227 (class 1259 OID 17755)
-- Name: branding; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branding (
    id integer NOT NULL,
    company_id integer,
    primary_color character varying(20) NOT NULL,
    workspace_name character varying(100) NOT NULL,
    tagline character varying(150),
    subdomain character varying(100),
    custom_domain character varying(255),
    from_name character varying(100) NOT NULL,
    reply_to_email character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.branding OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 17754)
-- Name: branding_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.branding_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branding_id_seq OWNER TO postgres;

--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 226
-- Name: branding_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branding_id_seq OWNED BY public.branding.id;


--
-- TOC entry 231 (class 1259 OID 17798)
-- Name: chemicals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chemicals (
    id integer NOT NULL,
    company_id integer,
    name character varying(255) NOT NULL,
    formula character varying(255),
    category character varying(50),
    hs_code character varying(50),
    unit character varying(20),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.chemicals OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 17797)
-- Name: chemicals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chemicals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chemicals_id_seq OWNER TO postgres;

--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 230
-- Name: chemicals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chemicals_id_seq OWNED BY public.chemicals.id;


--
-- TOC entry 223 (class 1259 OID 17720)
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    company_name character varying(255),
    address text,
    city character varying(100),
    state character varying(100),
    pincode character varying(20),
    contact_email character varying(255),
    contact_phone character varying(20),
    logo_url text,
    created_at timestamp without time zone DEFAULT now(),
    company_type character varying(100),
    description text,
    gst_number character varying(50),
    iec_code character varying(50),
    pan_number character varying(20),
    year_established integer,
    address2 text,
    country character varying(100),
    currency character varying(20),
    website character varying(255),
    timezone character varying(100),
    onboarding_step integer DEFAULT 1,
    onboarding_completed boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17719)
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO postgres;

--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 222
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- TOC entry 225 (class 1259 OID 17731)
-- Name: company_branding; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_branding (
    id integer NOT NULL,
    company_id integer NOT NULL,
    primary_color character varying(7) NOT NULL,
    workspace_name character varying(50) NOT NULL,
    tagline character varying(60),
    from_name character varying(50) NOT NULL,
    reply_to character varying(255) NOT NULL,
    subdomain character varying(63),
    custom_domain character varying(255),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.company_branding OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 17730)
-- Name: company_branding_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.company_branding_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_branding_id_seq OWNER TO postgres;

--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 224
-- Name: company_branding_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.company_branding_id_seq OWNED BY public.company_branding.id;


--
-- TOC entry 237 (class 1259 OID 17994)
-- Name: lead_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lead_activities (
    id bigint NOT NULL,
    public_id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id bigint NOT NULL,
    lead_id bigint NOT NULL,
    activity_type character varying(40) NOT NULL,
    subject character varying(255) NOT NULL,
    notes text NOT NULL,
    outcome character varying(120),
    previous_stage character varying(40),
    new_stage character varying(40),
    followup_date date,
    followup_time time without time zone,
    followup_via character varying(40),
    activity_date date NOT NULL,
    activity_time time without time zone,
    created_by character varying(120),
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.lead_activities OWNER TO postgres;

--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 237
-- Name: TABLE lead_activities; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.lead_activities IS 'Company-scoped CRM timeline and conversation activity records for leads.';


--
-- TOC entry 236 (class 1259 OID 17993)
-- Name: lead_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lead_activities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lead_activities_id_seq OWNER TO postgres;

--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 236
-- Name: lead_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lead_activities_id_seq OWNED BY public.lead_activities.id;


--
-- TOC entry 235 (class 1259 OID 17942)
-- Name: leads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leads (
    id bigint NOT NULL,
    public_id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id bigint NOT NULL,
    first_name character varying(80) NOT NULL,
    last_name character varying(80),
    company_name character varying(140) NOT NULL,
    designation character varying(100),
    email character varying(255) NOT NULL,
    phone character varying(40) NOT NULL,
    country character varying(80) NOT NULL,
    city character varying(80),
    chemical_names text[] DEFAULT ARRAY[]::text[] NOT NULL,
    quantity_required numeric(14,3),
    unit character varying(20),
    frequency character varying(40),
    price_per_unit numeric(14,2),
    currency character varying(10) DEFAULT 'USD'::character varying NOT NULL,
    estimated_value numeric(16,2),
    incoterm character varying(40),
    payment_terms text[] DEFAULT ARRAY[]::text[] NOT NULL,
    packaging_requirement character varying(120),
    port_of_destination character varying(120),
    source character varying(80),
    source_detail character varying(180),
    assigned_to character varying(100),
    initial_stage character varying(40),
    lead_score integer DEFAULT 0 NOT NULL,
    score_label character varying(20) DEFAULT 'Cold'::character varying NOT NULL,
    followup_date date,
    followup_time time without time zone,
    followup_via character varying(40),
    notes text,
    status character varying(40) DEFAULT 'new'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    current_stage character varying(40),
    CONSTRAINT leads_score_check CHECK (((lead_score >= 0) AND (lead_score <= 100))),
    CONSTRAINT leads_status_check CHECK (((status)::text = ANY ((ARRAY['new'::character varying, 'qualified'::character varying, 'quoted'::character varying, 'negotiating'::character varying, 'converted'::character varying, 'lost'::character varying])::text[])))
);


ALTER TABLE public.leads OWNER TO postgres;

--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 235
-- Name: TABLE leads; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.leads IS 'Company-scoped CRM lead records for chemical export workflows.';


--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN leads.public_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.leads.public_id IS 'External UUID safe for API responses and future URLs.';


--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN leads.current_stage; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.leads.current_stage IS 'Current CRM workflow stage used by lead activity logging and future pipeline automation.';


--
-- TOC entry 234 (class 1259 OID 17941)
-- Name: leads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leads_id_seq OWNER TO postgres;

--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 234
-- Name: leads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leads_id_seq OWNED BY public.leads.id;


--
-- TOC entry 241 (class 1259 OID 18083)
-- Name: quotation_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quotation_items (
    id bigint NOT NULL,
    quotation_id bigint NOT NULL,
    chemical_name character varying(255) NOT NULL,
    grade_spec character varying(255),
    quantity numeric(14,2) DEFAULT 0 NOT NULL,
    unit character varying(50) DEFAULT 'MT'::character varying NOT NULL,
    unit_price numeric(14,2) DEFAULT 0 NOT NULL,
    supplier_cost numeric(14,2) DEFAULT 0 NOT NULL,
    freight_cost numeric(14,2) DEFAULT 0 NOT NULL,
    line_total numeric(14,2) DEFAULT 0 NOT NULL,
    gross_profit numeric(14,2) DEFAULT 0 NOT NULL,
    margin_percent numeric(8,2) DEFAULT 0 NOT NULL,
    sort_order integer DEFAULT 0,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.quotation_items OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 18082)
-- Name: quotation_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quotation_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quotation_items_id_seq OWNER TO postgres;

--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 240
-- Name: quotation_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quotation_items_id_seq OWNED BY public.quotation_items.id;


--
-- TOC entry 239 (class 1259 OID 18035)
-- Name: quotations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quotations (
    id bigint NOT NULL,
    public_id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id bigint NOT NULL,
    lead_id bigint,
    quotation_number character varying(50) NOT NULL,
    status character varying(40) DEFAULT 'Draft'::character varying NOT NULL,
    quotation_date date NOT NULL,
    valid_until date,
    currency character varying(10) DEFAULT 'USD'::character varying NOT NULL,
    client_name character varying(255) NOT NULL,
    company_name character varying(255),
    client_email character varying(255),
    country character varying(120),
    subtotal numeric(14,2) DEFAULT 0 NOT NULL,
    freight_total numeric(14,2) DEFAULT 0 NOT NULL,
    additional_charges numeric(14,2) DEFAULT 0 NOT NULL,
    discount_total numeric(14,2) DEFAULT 0 NOT NULL,
    grand_total numeric(14,2) DEFAULT 0 NOT NULL,
    gross_profit numeric(14,2) DEFAULT 0 NOT NULL,
    margin_percent numeric(8,2) DEFAULT 0 NOT NULL,
    incoterm character varying(50),
    payment_terms text,
    loading_port character varying(255),
    discharge_port character varying(255),
    packaging_details text,
    remarks text,
    internal_notes text,
    metadata jsonb DEFAULT '{}'::jsonb,
    is_deleted boolean DEFAULT false,
    created_by character varying(120),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.quotations OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 18034)
-- Name: quotations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quotations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quotations_id_seq OWNER TO postgres;

--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 238
-- Name: quotations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quotations_id_seq OWNED BY public.quotations.id;


--
-- TOC entry 233 (class 1259 OID 17817)
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    company_id integer NOT NULL,
    company_name character varying(255) NOT NULL,
    supplier_type character varying(100),
    city character varying(100),
    country character varying(100),
    contact_person character varying(255),
    designation character varying(100),
    email character varying(255),
    phone character varying(50),
    min_order integer,
    lead_time integer,
    reliability character varying(50),
    payment_terms text[],
    rating integer,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 17816)
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suppliers_id_seq OWNER TO postgres;

--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 232
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- TOC entry 229 (class 1259 OID 17776)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    company_id integer,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    role character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'invited'::character varying,
    invite_token text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 17775)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 228
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4949 (class 2604 OID 17758)
-- Name: branding id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branding ALTER COLUMN id SET DEFAULT nextval('public.branding_id_seq'::regclass);


--
-- TOC entry 4956 (class 2604 OID 17801)
-- Name: chemicals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chemicals ALTER COLUMN id SET DEFAULT nextval('public.chemicals_id_seq'::regclass);


--
-- TOC entry 4941 (class 2604 OID 17723)
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- TOC entry 4946 (class 2604 OID 17734)
-- Name: company_branding id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_branding ALTER COLUMN id SET DEFAULT nextval('public.company_branding_id_seq'::regclass);


--
-- TOC entry 4972 (class 2604 OID 17997)
-- Name: lead_activities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_activities ALTER COLUMN id SET DEFAULT nextval('public.lead_activities_id_seq'::regclass);


--
-- TOC entry 4962 (class 2604 OID 17945)
-- Name: leads id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads ALTER COLUMN id SET DEFAULT nextval('public.leads_id_seq'::regclass);


--
-- TOC entry 4992 (class 2604 OID 18086)
-- Name: quotation_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotation_items ALTER COLUMN id SET DEFAULT nextval('public.quotation_items_id_seq'::regclass);


--
-- TOC entry 4977 (class 2604 OID 18038)
-- Name: quotations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotations ALTER COLUMN id SET DEFAULT nextval('public.quotations_id_seq'::regclass);


--
-- TOC entry 4959 (class 2604 OID 17820)
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- TOC entry 4952 (class 2604 OID 17779)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5016 (class 2606 OID 17769)
-- Name: branding branding_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branding
    ADD CONSTRAINT branding_pkey PRIMARY KEY (id);


--
-- TOC entry 5026 (class 2606 OID 17808)
-- Name: chemicals chemicals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chemicals
    ADD CONSTRAINT chemicals_pkey PRIMARY KEY (id);


--
-- TOC entry 5008 (class 2606 OID 17729)
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- TOC entry 5010 (class 2606 OID 17748)
-- Name: company_branding company_branding_company_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_branding
    ADD CONSTRAINT company_branding_company_id_key UNIQUE (company_id);


--
-- TOC entry 5012 (class 2606 OID 17746)
-- Name: company_branding company_branding_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_branding
    ADD CONSTRAINT company_branding_pkey PRIMARY KEY (id);


--
-- TOC entry 5054 (class 2606 OID 18013)
-- Name: lead_activities lead_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_activities
    ADD CONSTRAINT lead_activities_pkey PRIMARY KEY (id);


--
-- TOC entry 5044 (class 2606 OID 17976)
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- TOC entry 5046 (class 2606 OID 17978)
-- Name: leads leads_public_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_public_id_unique UNIQUE (public_id);


--
-- TOC entry 5065 (class 2606 OID 18113)
-- Name: quotation_items quotation_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotation_items
    ADD CONSTRAINT quotation_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5060 (class 2606 OID 18071)
-- Name: quotations quotations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_pkey PRIMARY KEY (id);


--
-- TOC entry 5032 (class 2606 OID 17828)
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- TOC entry 5029 (class 2606 OID 17815)
-- Name: chemicals unique_chemical_per_company; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chemicals
    ADD CONSTRAINT unique_chemical_per_company UNIQUE (company_id, name);


--
-- TOC entry 5022 (class 2606 OID 17791)
-- Name: users users_email_company_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_company_id_key UNIQUE (email, company_id);


--
-- TOC entry 5024 (class 2606 OID 17789)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5017 (class 1259 OID 17855)
-- Name: idx_branding_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_branding_company_id ON public.branding USING btree (company_id);


--
-- TOC entry 5027 (class 1259 OID 17854)
-- Name: idx_chemicals_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chemicals_company_id ON public.chemicals USING btree (company_id);


--
-- TOC entry 5013 (class 1259 OID 17856)
-- Name: idx_company_branding_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_company_branding_company_id ON public.company_branding USING btree (company_id);


--
-- TOC entry 5047 (class 1259 OID 18028)
-- Name: idx_lead_activities_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lead_activities_company_id ON public.lead_activities USING btree (company_id);


--
-- TOC entry 5048 (class 1259 OID 18032)
-- Name: idx_lead_activities_company_lead_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lead_activities_company_lead_created ON public.lead_activities USING btree (company_id, lead_id, activity_date DESC, activity_time DESC, id DESC);


--
-- TOC entry 5049 (class 1259 OID 18033)
-- Name: idx_lead_activities_company_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lead_activities_company_type ON public.lead_activities USING btree (company_id, activity_type);


--
-- TOC entry 5050 (class 1259 OID 18029)
-- Name: idx_lead_activities_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lead_activities_created_at ON public.lead_activities USING btree (created_at DESC);


--
-- TOC entry 5051 (class 1259 OID 18030)
-- Name: idx_lead_activities_followup_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lead_activities_followup_date ON public.lead_activities USING btree (followup_date);


--
-- TOC entry 5052 (class 1259 OID 18027)
-- Name: idx_lead_activities_lead_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lead_activities_lead_id ON public.lead_activities USING btree (lead_id);


--
-- TOC entry 5033 (class 1259 OID 17989)
-- Name: idx_leads_chemical_names_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leads_chemical_names_gin ON public.leads USING gin (chemical_names);


--
-- TOC entry 5034 (class 1259 OID 17986)
-- Name: idx_leads_company_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leads_company_created_at ON public.leads USING btree (company_id, created_at DESC);


--
-- TOC entry 5035 (class 1259 OID 18031)
-- Name: idx_leads_company_current_stage; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leads_company_current_stage ON public.leads USING btree (company_id, current_stage);


--
-- TOC entry 5036 (class 1259 OID 17984)
-- Name: idx_leads_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leads_company_id ON public.leads USING btree (company_id);


--
-- TOC entry 5037 (class 1259 OID 17991)
-- Name: idx_leads_company_lower_company_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leads_company_lower_company_name ON public.leads USING btree (company_id, lower((company_name)::text));


--
-- TOC entry 5038 (class 1259 OID 17990)
-- Name: idx_leads_company_lower_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leads_company_lower_email ON public.leads USING btree (company_id, lower((email)::text));


--
-- TOC entry 5039 (class 1259 OID 17992)
-- Name: idx_leads_company_recent_duplicate_scan; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leads_company_recent_duplicate_scan ON public.leads USING btree (company_id, created_at DESC, lower((email)::text), lower((company_name)::text));


--
-- TOC entry 5040 (class 1259 OID 17987)
-- Name: idx_leads_company_score; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leads_company_score ON public.leads USING btree (company_id, lead_score DESC);


--
-- TOC entry 5041 (class 1259 OID 17985)
-- Name: idx_leads_company_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leads_company_status ON public.leads USING btree (company_id, status);


--
-- TOC entry 5042 (class 1259 OID 17988)
-- Name: idx_leads_followup_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leads_followup_date ON public.leads USING btree (company_id, followup_date) WHERE (followup_date IS NOT NULL);


--
-- TOC entry 5062 (class 1259 OID 18125)
-- Name: idx_quotation_items_chemical_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quotation_items_chemical_name ON public.quotation_items USING btree (chemical_name);


--
-- TOC entry 5063 (class 1259 OID 18124)
-- Name: idx_quotation_items_quotation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quotation_items_quotation_id ON public.quotation_items USING btree (quotation_id);


--
-- TOC entry 5055 (class 1259 OID 18119)
-- Name: idx_quotations_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quotations_company_id ON public.quotations USING btree (company_id);


--
-- TOC entry 5056 (class 1259 OID 18120)
-- Name: idx_quotations_lead_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quotations_lead_id ON public.quotations USING btree (lead_id);


--
-- TOC entry 5057 (class 1259 OID 18122)
-- Name: idx_quotations_quotation_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quotations_quotation_date ON public.quotations USING btree (quotation_date);


--
-- TOC entry 5058 (class 1259 OID 18121)
-- Name: idx_quotations_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quotations_status ON public.quotations USING btree (status);


--
-- TOC entry 5030 (class 1259 OID 17853)
-- Name: idx_suppliers_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_suppliers_company_id ON public.suppliers USING btree (company_id);


--
-- TOC entry 5019 (class 1259 OID 17852)
-- Name: idx_users_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_company_id ON public.users USING btree (company_id);


--
-- TOC entry 5018 (class 1259 OID 17858)
-- Name: uq_branding_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_branding_company_id ON public.branding USING btree (company_id) WHERE (company_id IS NOT NULL);


--
-- TOC entry 5014 (class 1259 OID 17859)
-- Name: uq_company_branding_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_company_branding_company_id ON public.company_branding USING btree (company_id) WHERE (company_id IS NOT NULL);


--
-- TOC entry 5061 (class 1259 OID 18123)
-- Name: uq_quotations_number_per_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_quotations_number_per_company ON public.quotations USING btree (company_id, quotation_number);


--
-- TOC entry 5020 (class 1259 OID 17857)
-- Name: uq_users_company_lower_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_users_company_lower_email ON public.users USING btree (company_id, lower((email)::text)) WHERE ((company_id IS NOT NULL) AND (email IS NOT NULL));


--
-- TOC entry 5068 (class 2606 OID 17770)
-- Name: branding branding_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branding
    ADD CONSTRAINT branding_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 5072 (class 2606 OID 17809)
-- Name: chemicals chemicals_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chemicals
    ADD CONSTRAINT chemicals_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 5066 (class 2606 OID 17749)
-- Name: company_branding company_branding_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_branding
    ADD CONSTRAINT company_branding_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 5069 (class 2606 OID 17875)
-- Name: branding fk_branding_company; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branding
    ADD CONSTRAINT fk_branding_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 5073 (class 2606 OID 17870)
-- Name: chemicals fk_chemicals_company; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chemicals
    ADD CONSTRAINT fk_chemicals_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 5067 (class 2606 OID 17880)
-- Name: company_branding fk_company_branding_company; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_branding
    ADD CONSTRAINT fk_company_branding_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 5075 (class 2606 OID 17979)
-- Name: leads fk_leads_company; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT fk_leads_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 5074 (class 2606 OID 17865)
-- Name: suppliers fk_suppliers_company; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT fk_suppliers_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE RESTRICT;


--
-- TOC entry 5070 (class 2606 OID 17860)
-- Name: users fk_users_company; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- TOC entry 5076 (class 2606 OID 18014)
-- Name: lead_activities lead_activities_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_activities
    ADD CONSTRAINT lead_activities_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- TOC entry 5077 (class 2606 OID 18019)
-- Name: lead_activities lead_activities_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_activities
    ADD CONSTRAINT lead_activities_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- TOC entry 5080 (class 2606 OID 18114)
-- Name: quotation_items quotation_items_quotation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotation_items
    ADD CONSTRAINT quotation_items_quotation_id_fkey FOREIGN KEY (quotation_id) REFERENCES public.quotations(id) ON DELETE CASCADE;


--
-- TOC entry 5078 (class 2606 OID 18072)
-- Name: quotations quotations_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- TOC entry 5079 (class 2606 OID 18077)
-- Name: quotations quotations_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id);


--
-- TOC entry 5071 (class 2606 OID 17792)
-- Name: users users_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


-- Completed on 2026-05-19 11:08:05

--
-- PostgreSQL database dump complete
--

\unrestrict QWXJlj6Re5VmQeN4hnDFmf0iSv75lIUSDQ74ksUOnxihuhayi1nFtG7GflQJaHa

