"""
CompanionMatch — FastAPI Backend  v0.4.0
  - Haversine distance filter on GET /api/swipes/actors (?raio_km=)
  - Registration: POST /api/clientes  POST /api/atores
  - Bio fields on Clientes + Atores
  - Provider view returns client bio (what they want)
  - OpenAI DALL-E 3 avatar generation (DiceBear fallback)
  - 50 % match probability + ERD auto-insert
"""

from __future__ import annotations

import math
import os
import random
from datetime import date
from typing import Literal, Optional

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from db.base import get_db
import db.models as M

app = FastAPI(title="CompanionMatch API", version="0.4.0")

# ═══════════════════════════════════════════════════
# Geolocation — Haversine
# ═══════════════════════════════════════════════════

def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Return great-circle distance in km between two (lat, lon) points."""
    R = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

# ═══════════════════════════════════════════════════
# DALL-E avatar generation
# ═══════════════════════════════════════════════════

def generate_avatar(gender: str, nationality: str, name: str = "") -> str:
    """Generate via DALL-E 3; fall back to DiceBear SVG."""
    fallback = f"https://api.dicebear.com/7.x/bottts/svg?seed={name or nationality}"
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        return fallback
    try:
        from openai import OpenAI
        client = OpenAI(api_key=key)
        prompt = (
            "A minimalistic 2D hand-drawn vector avatar face, simple line art, "
            f"monochrome with a sharp black outline, person from {nationality}, "
            f"gender {gender}, solid white background, profile picture style"
        )
        resp = client.images.generate(
            model="dall-e-3", prompt=prompt,
            size="1024x1024", quality="standard", n=1,
        )
        return resp.data[0].url
    except Exception as exc:
        print(f"[DALL-E] {name}: {exc}")
        return fallback

# ═══════════════════════════════════════════════════
# Pydantic schemas
# ═══════════════════════════════════════════════════

class ClienteOut(BaseModel):
    id_cliente: int
    nome:       str
    cidade:     str
    telefone:   str
    bio:        Optional[str]   = None
    latitude:   Optional[float] = None
    longitude:  Optional[float] = None
    telegram:   Optional[str]   = None
    model_config = {"from_attributes": True}


class ClienteCreate(BaseModel):
    nome:      str
    cidade:    str
    telefone:  str
    bio:       Optional[str]   = None
    latitude:  Optional[float] = None
    longitude: Optional[float] = None
    telegram:  Optional[str]   = None


class ClienteSummaryOut(BaseModel):
    """Minimal client info returned inside PedidoRequestOut."""
    id_cliente: int
    nome:       str
    bio:        Optional[str] = None
    telegram:   Optional[str] = None
    model_config = {"from_attributes": True}


class AtorOut(BaseModel):
    id_ator:       int
    nome:          str
    idade:         int
    nacionalidade: str
    genero:        Optional[str]   = "neutral"
    avatar_url:    Optional[str]   = None
    bio:           Optional[str]   = None
    distancia_km:  Optional[float] = None   # computed, not stored
    telegram:      Optional[str]   = None
    model_config = {"from_attributes": True}


class AtorCreate(BaseModel):
    nome:          str
    idade:         int
    nacionalidade: str
    genero:        str           = "neutral"
    bio:           Optional[str]   = None
    latitude:      Optional[float] = None
    longitude:     Optional[float] = None
    telegram:      Optional[str]   = None


class PedidoOut(BaseModel):
    id_pedido:   int
    id_cliente:  int
    data_pedido: date
    status:      str
    model_config = {"from_attributes": True}


class PedidoRequestOut(BaseModel):
    id_pedido:   int
    status:      str
    data_pedido: date
    ator:        AtorOut
    cliente:     ClienteSummaryOut


class PedidoStatusUpdate(BaseModel):
    status: str


class TipoEventoOut(BaseModel):
    id_tipo:  int
    descricao: str
    model_config = {"from_attributes": True}


class PapelOut(BaseModel):
    id_papel:  int
    descricao: str
    model_config = {"from_attributes": True}


class SwipeRequest(BaseModel):
    id_cliente: int
    id_ator:    int
    direcao:    Literal["like", "dislike"]


class SwipeResponse(BaseModel):
    id_cliente: int
    id_ator:    int
    direcao:    str
    matched:    bool          = False
    id_pedido:  Optional[int] = None

# ═══════════════════════════════════════════════════
# Registration
# ═══════════════════════════════════════════════════

@app.post(
    "/api/clientes",
    response_model=ClienteOut,
    status_code=201,
    summary="Register a new client",
    tags=["Clientes"],
)
def create_cliente(body: ClienteCreate, db: Session = Depends(get_db)):
    obj = M.Cliente(**body.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@app.post(
    "/api/atores",
    response_model=AtorOut,
    status_code=201,
    summary="Register a new actor",
    tags=["Atores"],
)
def create_ator(body: AtorCreate, db: Session = Depends(get_db)):
    obj = M.Ator(**body.model_dump())
    obj.avatar_url = generate_avatar(obj.genero or "neutral", obj.nacionalidade, obj.nome)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return AtorOut.model_validate(obj)

# ═══════════════════════════════════════════════════
# Swipe endpoints
# ═══════════════════════════════════════════════════

@app.get(
    "/api/swipes/actors",
    response_model=list[AtorOut],
    summary="Actors available for swiping (optional radius filter)",
    tags=["Swipes"],
)
def get_actors_for_swipe(
    id_cliente: int          = Query(default=1),
    raio_km:    Optional[float] = Query(default=None, ge=1.0, le=500.0,
                                        description="Radius filter in km (Haversine)"),
    db: Session = Depends(get_db),
):
    already_swiped = (
        db.query(M.Swipe.id_ator)
        .filter(M.Swipe.id_cliente == id_cliente)
        .subquery()
    )
    actors = (
        db.query(M.Ator)
        .filter(M.Ator.id_ator.not_in(already_swiped))
        .all()
    )

    # Lazy-generate missing avatars in one batch
    updated = False
    for a in actors:
        if not a.avatar_url:
            a.avatar_url = generate_avatar(a.genero or "neutral", a.nacionalidade, a.nome)
            updated = True
    if updated:
        db.commit()

    cliente = db.get(M.Cliente, id_cliente)
    c_lat = cliente.latitude  if cliente else None
    c_lon = cliente.longitude if cliente else None

    result: list[AtorOut] = []
    for a in actors:
        dist: Optional[float] = None
        if c_lat is not None and c_lon is not None and a.latitude is not None and a.longitude is not None:
            dist = round(haversine(c_lat, c_lon, a.latitude, a.longitude), 1)

        if raio_km is not None and dist is not None and dist > raio_km:
            continue  # outside requested radius

        result.append(AtorOut(
            id_ator=a.id_ator,
            nome=a.nome,
            idade=a.idade,
            nacionalidade=a.nacionalidade,
            genero=a.genero or "neutral",
            avatar_url=a.avatar_url,
            bio=a.bio,
            distancia_km=dist,
            telegram=a.telegram,
        ))

    # Closest first
    result.sort(key=lambda x: x.distancia_km if x.distancia_km is not None else float("inf"))
    return result


@app.post(
    "/api/swipes",
    response_model=SwipeResponse,
    summary="Record a swipe — 50 % chance of match",
    tags=["Swipes"],
)
def post_swipe(body: SwipeRequest, db: Session = Depends(get_db)):
    existing = (
        db.query(M.Swipe)
        .filter_by(id_cliente=body.id_cliente, id_ator=body.id_ator)
        .first()
    )
    if existing:
        existing.direcao = body.direcao
    else:
        db.add(M.Swipe(
            id_cliente=body.id_cliente,
            id_ator=body.id_ator,
            direcao=body.direcao,
        ))
    db.flush()

    matched   = body.direcao == "like" and random.random() < 0.5
    id_pedido = None

    if matched:
        pedido = M.Pedido(
            id_cliente=body.id_cliente,
            data_pedido=date.today(),
            status="Matched",
        )
        db.add(pedido)
        db.flush()

        tipo = db.query(M.TipoEvento).first()
        servico = M.Servico(
            id_pedido=pedido.id_pedido,
            id_tipo=tipo.id_tipo if tipo else 1,
            data_servico=date.today(),
            preco=0.00,
        )
        db.add(servico)
        db.flush()

        papel = db.query(M.Papel).filter_by(descricao="Companion").first()
        db.add(M.ServicoAtor(
            id_servico=servico.id_servico,
            id_ator=body.id_ator,
            id_papel=papel.id_papel if papel else 1,
        ))
        id_pedido = pedido.id_pedido

    db.commit()
    return SwipeResponse(
        id_cliente=body.id_cliente,
        id_ator=body.id_ator,
        direcao=body.direcao,
        matched=matched,
        id_pedido=id_pedido,
    )


@app.delete(
    "/api/swipes/reset",
    summary="Clear all swipes for a client (start over)",
    tags=["Swipes"],
)
def reset_swipes(id_cliente: int = Query(...), db: Session = Depends(get_db)):
    deleted = db.query(M.Swipe).filter_by(id_cliente=id_cliente).delete()
    db.commit()
    return {"deleted": deleted}


@app.get(
    "/api/swipes/matches",
    response_model=list[AtorOut],
    summary="Confirmed mutual matches for a client",
    tags=["Swipes"],
)
def get_matches(id_cliente: int = Query(...), db: Session = Depends(get_db)):
    liked_ids = (
        db.query(M.Swipe.id_ator)
        .filter_by(id_cliente=id_cliente, direcao="like")
        .subquery()
    )
    mutual_ids = (
        db.query(M.Swipe.id_cliente)
        .filter(
            M.Swipe.id_ator == id_cliente,
            M.Swipe.direcao == "like",
            M.Swipe.id_cliente.in_(liked_ids),
        )
        .subquery()
    )
    return db.query(M.Ator).filter(M.Ator.id_ator.in_(mutual_ids)).all()

# ═══════════════════════════════════════════════════
# Pedidos — provider view
# ═══════════════════════════════════════════════════

@app.get(
    "/api/pedidos/requests",
    response_model=list[PedidoRequestOut],
    summary="Incoming requests — filterable by client or actor",
    tags=["Pedidos"],
)
def get_matched_requests(
    id_cliente: Optional[int] = Query(default=None),
    id_ator:    Optional[int] = Query(default=None),
    db: Session = Depends(get_db),
):
    q = (
        db.query(M.Pedido, M.Ator, M.Cliente)
        .join(M.Servico,    M.Servico.id_pedido     == M.Pedido.id_pedido)
        .join(M.ServicoAtor, M.ServicoAtor.id_servico == M.Servico.id_servico)
        .join(M.Ator,       M.Ator.id_ator           == M.ServicoAtor.id_ator)
        .join(M.Cliente,    M.Cliente.id_cliente      == M.Pedido.id_cliente)
        .filter(M.Pedido.status.in_(["Matched", "Confirmed"]))
    )
    if id_cliente is not None:
        q = q.filter(M.Pedido.id_cliente == id_cliente)
    if id_ator is not None:
        q = q.filter(M.ServicoAtor.id_ator == id_ator)

    return [
        PedidoRequestOut(
            id_pedido=pedido.id_pedido,
            status=pedido.status,
            data_pedido=pedido.data_pedido,
            ator=AtorOut.model_validate(ator),
            cliente=ClienteSummaryOut.model_validate(cliente),
        )
        for pedido, ator, cliente in q.all()
    ]


@app.put(
    "/api/pedidos/{id_pedido}",
    response_model=PedidoOut,
    summary="Update pedido status",
    tags=["Pedidos"],
)
def update_pedido(
    id_pedido: int,
    body: PedidoStatusUpdate,
    db: Session = Depends(get_db),
):
    pedido = db.get(M.Pedido, id_pedido)
    if not pedido:
        raise HTTPException(404, "Pedido not found")
    pedido.status = body.status
    db.commit()
    db.refresh(pedido)
    return pedido

# ═══════════════════════════════════════════════════
# Reference endpoints
# ═══════════════════════════════════════════════════

@app.get("/api/clientes",              response_model=list[ClienteOut], tags=["Clientes"])
def list_clientes(db: Session = Depends(get_db)):
    return db.query(M.Cliente).all()


@app.get("/api/clientes/{id_cliente}", response_model=ClienteOut,      tags=["Clientes"])
def get_cliente(id_cliente: int, db: Session = Depends(get_db)):
    obj = db.get(M.Cliente, id_cliente)
    if not obj:
        raise HTTPException(404, "Cliente not found")
    return obj


@app.get("/api/atores",                response_model=list[AtorOut],   tags=["Atores"])
def list_atores(db: Session = Depends(get_db)):
    return db.query(M.Ator).all()


@app.get("/api/atores/{id_ator}",      response_model=AtorOut,         tags=["Atores"])
def get_ator(id_ator: int, db: Session = Depends(get_db)):
    obj = db.get(M.Ator, id_ator)
    if not obj:
        raise HTTPException(404, "Ator not found")
    return obj


@app.get("/api/tipos-evento", response_model=list[TipoEventoOut], tags=["Tipos Evento"])
def list_tipos_evento(db: Session = Depends(get_db)):
    return db.query(M.TipoEvento).all()


@app.get("/api/papeis", response_model=list[PapelOut], tags=["Papeis"])
def list_papeis(db: Session = Depends(get_db)):
    return db.query(M.Papel).all()


@app.get("/api/health", tags=["System"])
def health(db: Session = Depends(get_db)):
    return {
        "status":    "ok",
        "version":   "0.4.0",
        "actors":    db.query(M.Ator).count(),
        "clients":   db.query(M.Cliente).count(),
        "swipes":    db.query(M.Swipe).count(),
        "matches":   db.query(M.Pedido).filter_by(status="Matched").count(),
    }

# ═══════════════════════════════════════════════════
# Static files — LAST
# ═══════════════════════════════════════════════════
app.mount("/", StaticFiles(directory="client", html=True), name="static")
