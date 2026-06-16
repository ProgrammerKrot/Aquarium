# CompanionMatch

A mobile-first **companion-booking demo app** built with FastAPI, PostgreSQL, Alembic, and Vanilla JS.
Strict 2D hand-drawn / comic-book aesthetic — `4px solid #1A1A1A` borders, `6px 6px 0px #1A1A1A` hard offset shadows, `Courier New` font throughout.

---

## Quick Start (Docker)

```bash
# Clone / enter the project
cd Aquarium

# Optional — supply an OpenAI key for DALL-E 3 avatars
# (omit to fall back to DiceBear SVG avatars automatically)
export OPENAI_API_KEY=sk-...

# Build and run everything
docker compose up --build
```

Open **http://localhost:8000** in your browser.

The `entrypoint.sh` script waits for PostgreSQL, runs `alembic upgrade head` (applies all migrations + seeds demo data), then starts `uvicorn`.

---

## Project Structure

```
Aquarium/
├── server.py                        # FastAPI app (v0.4.0)
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── entrypoint.sh                    # wait-for-db → migrate → serve
│
├── db/
│   ├── base.py                      # SQLAlchemy engine, SessionLocal, get_db
│   └── models.py                    # ORM models (all ERD tables)
│
├── alembic.ini
├── alembic/
│   ├── env.py
│   └── versions/
│       ├── 001_initial_schema.py    # All ERD tables
│       ├── 002_seed_data.py         # Demo clients, actors, event types, roles
│       ├── 003_add_genero_to_atores.py
│       ├── 004_add_bio_and_location.py  # bio, latitude, longitude + Lisbon coords
│       ├── 005_fix_sequences.py     # Reset PG sequences after explicit-id seeds
│       └── 006_add_telegram.py      # telegram username + seed handles
│
└── client/
    ├── index.html                   # Auth screen + main app shell
    ├── style.css                    # 2D hand-drawn design system
    └── main.js                      # Vanilla JS — auth, swipe, geolocation, API
```

---

## Database Schema

### `clientes`
| Column | Type | Notes |
|---|---|---|
| id_cliente | SERIAL PK | |
| nome | VARCHAR(255) | |
| cidade | VARCHAR(255) | |
| telefone | VARCHAR(50) | |
| bio | TEXT | "What I'm looking for" |
| latitude | FLOAT | Lisbon-area seed coords |
| longitude | FLOAT | |
| telegram | VARCHAR(100) | Username (no @) |

### `atores`
| Column | Type | Notes |
|---|---|---|
| id_ator | SERIAL PK | |
| nome | VARCHAR(255) | |
| idade | INTEGER | |
| nacionalidade | VARCHAR(100) | |
| genero | VARCHAR(10) | `male` / `female` / `neutral` |
| avatar_url | VARCHAR(500) | DALL-E 3 or DiceBear fallback |
| bio | TEXT | "What I can do" |
| latitude | FLOAT | |
| longitude | FLOAT | |
| telegram | VARCHAR(100) | Username (no @) |

### Other ERD tables
`tipos_evento`, `papeis`, `pedidos`, `servicos`, `servico_atores`, `pagamentos`, `avaliacoes`, `swipes`

---

## Migration History

| Rev | Description |
|---|---|
| 001 | Initial schema — all ERD tables |
| 002 | Seed demo data (3 clients, 7 actors, event types, roles) |
| 003 | Add `genero` to `atores` |
| 004 | Add `bio`, `latitude`, `longitude` to both tables; seed Lisbon coords + bios |
| 005 | Reset PostgreSQL sequences after explicit-id seed inserts |
| 006 | Add `telegram` to both tables; seed demo handles |

---

## API Endpoints

### Auth / Registration
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/clientes` | Register a new Customer |
| `POST` | `/api/atores` | Register a new Provider (auto-generates avatar) |

### Clientes
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/clientes` | List all clients (used for Login dropdown) |
| `GET` | `/api/clientes/{id}` | Get one client |

### Atores
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/atores` | List all actors (used for Login dropdown) |
| `GET` | `/api/atores/{id}` | Get one actor |

### Swipes
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/swipes/actors?id_cliente=&raio_km=` | Unswiped actors, sorted by distance. `raio_km` filters by Haversine radius. |
| `POST` | `/api/swipes` | Record a swipe; 50 % chance of match → auto-creates `pedido` + `servico` + `servico_ator` |
| `GET` | `/api/swipes/matches?id_cliente=` | Mutual matches for a client |
| `DELETE` | `/api/swipes/reset?id_cliente=` | Clear all swipes (start over) |

### Pedidos
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/pedidos/requests?id_cliente=&id_ator=` | Incoming requests filtered by client or actor |
| `PUT` | `/api/pedidos/{id}` | Update pedido status (e.g. `"Confirmed"`) |

### System
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | DB counts + version |

All endpoints are documented at **http://localhost:8000/docs** (Swagger UI).

---

## Features

### Welcome / Auth Screen
- **Log In** tab: select account type (Customer / Provider) → pick from dropdown of existing demo users → instant login
- **Register** tab: fill Name, City, Phone, Bio, Telegram username, Latitude/Longitude
  - **"📍 Use my location"** button auto-fills coordinates via the browser Geolocation API
  - Providers also enter Age, Nationality, Gender
- Session stored in `localStorage`; logout button (✕) in the header clears it

### Role-Locked Tabs
- **Customer** accounts see only the Customer tab (Provider tab is greyed out)
- **Provider** accounts see only the Provider tab (Customer tab is greyed out)
- Each role starts in its own default mode

### Customer Mode — Swipe View
- **Search Radius slider** (1–100 km): filters actors using the **Haversine formula** in the backend; debounced 600 ms
- Swipe card shows: avatar, name, age, nationality, **bio** ("What I can do"), **distance badge** (e.g. `📍 3.5 km away`)
- ✕ (dislike) / ✓ (like) action buttons
- 50 % match probability on "like" — triggers a **Match Overlay** celebration popup
- **↺ Reset swipes** button appears when the deck is exhausted

### Customer Mode — Matches Panel
- Lists all matched actors with avatar, name, meta
- Shows matched actor's **Telegram handle** as a tappable `@username` button → opens `t.me/username`

### Provider Mode — Requests Panel
- Lists incoming `Matched` / `Confirmed` pedidos with the requesting client's name and **bio** ("What they want")
- `Matched` status shows `🔒 Confirm to unlock contact`
- After clicking **Confirm** → status changes to `Confirmed` and the **client's Telegram handle** is revealed as a tappable link

### Avatar Generation
- If `OPENAI_API_KEY` is set: DALL-E 3 generates a 2D hand-drawn avatar on first request, cached in DB
- Fallback: DiceBear SVG (`bottts` style) — no API key required

---

## Demo Accounts

### Customers (login dropdown → Customer)
| Name | Telegram | Location |
|---|---|---|
| Ana Costa | @ana_costa_companion | Lisbon centre |
| Bruno Lima | @bruno_lima_events | ~1 km N |
| Carla Nunes | @carla_nunes_lisbon | ~1 km SE |

### Providers (login dropdown → Provider)
| Name | Telegram | Distance from Ana |
|---|---|---|
| Lucia Ferreira | @lucia_companion_pt | 0.2 km |
| Yuki Tanaka | @yuki_cultural_bridge | 0.6 km |
| Sofia Andrade | @sofia_andrade_art | 4 km |
| Carlos Mendez | @carlos_mx_events | 6 km |
| Tomas Oliveira | @tomas_corp_lisbon | 7 km |
| Elena Vasquez | @elena_multilingual | 8 km |
| Marco Ricci | @marco_luxury_host | 14 km |

---

## Visual Design

| Token | Value |
|---|---|
| Font | `Courier New` (monospace) |
| Border | `4px solid #1A1A1A` |
| Shadow | `6px 6px 0px #1A1A1A` |
| Background | `#F5F3EE` (off-white) |
| Avatar ring | `4px solid #0066FF` |
| Dislike button | `#FF0000` |
| Like button | `#00CC44` |
| Telegram button | `#29B6F6` |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes (set by Docker) | PostgreSQL connection string |
| `OPENAI_API_KEY` | No | Enables DALL-E 3 avatar generation |
