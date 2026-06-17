from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "006"
down_revision: Union[str, None] = "005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

_CLIENT_TG = [
    ("Ana Costa",   "ana_costa_companion"),
    ("Bruno Lima",  "bruno_lima_events"),
    ("Carla Nunes", "carla_nunes_lisbon"),
]

_ACTOR_TG = [
    ("Lucia Ferreira", "lucia_companion_pt"),
    ("Carlos Mendez",  "carlos_mx_events"),
    ("Sofia Andrade",  "sofia_andrade_art"),
    ("Tomas Oliveira", "tomas_corp_lisbon"),
    ("Elena Vasquez",  "elena_multilingual"),
    ("Marco Ricci",    "marco_luxury_host"),
    ("Yuki Tanaka",    "yuki_cultural_bridge"),
]

def upgrade() -> None:
    op.add_column("clientes", sa.Column("telegram", sa.String(100), nullable=True))
    op.add_column("atores",   sa.Column("telegram", sa.String(100), nullable=True))

    bind = op.get_bind()
    for nome, tg in _CLIENT_TG:
        bind.execute(sa.text("UPDATE clientes SET telegram=:tg WHERE nome=:nome"), {"tg": tg, "nome": nome})
    for nome, tg in _ACTOR_TG:
        bind.execute(sa.text("UPDATE atores SET telegram=:tg WHERE nome=:nome"), {"tg": tg, "nome": nome})

def downgrade() -> None:
    op.drop_column("atores",   "telegram")
    op.drop_column("clientes", "telegram")
