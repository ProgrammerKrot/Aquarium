from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

_CLIENT_SEEDS = [
    ("Ana Costa",   "Looking for a sophisticated companion for corporate dinners and business events.",
     38.7169, -9.1399),
    ("Bruno Lima",  "Seeking a fun and energetic partner for social gatherings and weekend parties.",
     38.7250, -9.1500),
    ("Carla Nunes", "Need a calm, professional companion for charity galas and cultural events.",
     38.7100, -9.1300),
]

_ACTOR_SEEDS = [
    ("Lucia Ferreira", "Trilingual event companion; specialises in luxury galas and corporate dinners.",
     38.7180, -9.1410),
    ("Carlos Mendez",  "Experienced wedding host with 8 years in the events industry.",
     38.7500, -9.2000),
    ("Sofia Andrade",  "Creative performer and witty conversationalist for private parties.",
     38.6900, -9.1100),
    ("Tomas Oliveira", "Corporate specialist: business etiquette, public speaking support.",
     38.7800, -9.1500),
    ("Elena Vasquez",  "Multilingual companion for international delegations and embassy events.",
     38.6500, -9.1800),
    ("Marco Ricci",    "Charismatic luxury-event host; sommelier-trained and fluent in Italian.",
     38.8000, -9.0800),
    ("Yuki Tanaka",    "Cultural bridge expert; cross-cultural events and Japanese business etiquette.",
     38.7220, -9.1420),
]

def upgrade() -> None:
    op.add_column("clientes", sa.Column("bio",       sa.Text(),  nullable=True))
    op.add_column("clientes", sa.Column("latitude",  sa.Float(), nullable=True))
    op.add_column("clientes", sa.Column("longitude", sa.Float(), nullable=True))

    op.add_column("atores",   sa.Column("bio",       sa.Text(),  nullable=True))
    op.add_column("atores",   sa.Column("latitude",  sa.Float(), nullable=True))
    op.add_column("atores",   sa.Column("longitude", sa.Float(), nullable=True))

    bind = op.get_bind()

    for nome, bio, lat, lon in _CLIENT_SEEDS:
        bind.execute(sa.text(
            "UPDATE clientes SET bio=:bio, latitude=:lat, longitude=:lon WHERE nome=:nome"
        ), {"bio": bio, "lat": lat, "lon": lon, "nome": nome})

    for nome, bio, lat, lon in _ACTOR_SEEDS:
        bind.execute(sa.text(
            "UPDATE atores SET bio=:bio, latitude=:lat, longitude=:lon WHERE nome=:nome"
        ), {"bio": bio, "lat": lat, "lon": lon, "nome": nome})

def downgrade() -> None:
    op.drop_column("atores",   "longitude")
    op.drop_column("atores",   "latitude")
    op.drop_column("atores",   "bio")
    op.drop_column("clientes", "longitude")
    op.drop_column("clientes", "latitude")
    op.drop_column("clientes", "bio")
