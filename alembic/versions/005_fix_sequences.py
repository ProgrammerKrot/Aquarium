from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    bind = op.get_bind()
    for table, col in [
        ("clientes",      "id_cliente"),
        ("atores",        "id_ator"),
        ("tipos_evento",  "id_tipo"),
        ("papeis",        "id_papel"),
        ("pedidos",       "id_pedido"),
        ("servicos",      "id_servico"),
        ("pagamentos",    "id_pagamento"),
        ("avaliacoes",    "id_avaliacao"),
    ]:
        seq = f"{table}_{col}_seq"
        bind.execute(sa.text(
            f"SELECT setval('{seq}', COALESCE((SELECT MAX({col}) FROM {table}), 0) + 1, false)"
        ))

def downgrade() -> None:
    pass
