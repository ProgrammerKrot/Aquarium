from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        "clientes",
        sa.Column("id_cliente", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("nome",       sa.String(255), nullable=False),
        sa.Column("cidade",     sa.String(255), nullable=False),
        sa.Column("telefone",   sa.String(50),  nullable=False),
    )

    op.create_table(
        "atores",
        sa.Column("id_ator",       sa.Integer(),    primary_key=True, autoincrement=True),
        sa.Column("nome",          sa.String(255),  nullable=False),
        sa.Column("idade",         sa.Integer(),    nullable=False),
        sa.Column("nacionalidade", sa.String(100),  nullable=False),
        sa.Column("avatar_url",    sa.String(500),  nullable=True),
    )

    op.create_table(
        "tipos_evento",
        sa.Column("id_tipo",   sa.Integer(),    primary_key=True, autoincrement=True),
        sa.Column("descricao", sa.String(255),  nullable=False),
    )

    op.create_table(
        "papeis",
        sa.Column("id_papel",  sa.Integer(),    primary_key=True, autoincrement=True),
        sa.Column("descricao", sa.String(255),  nullable=False),
    )

    op.create_table(
        "pedidos",
        sa.Column("id_pedido",   sa.Integer(),   primary_key=True, autoincrement=True),
        sa.Column("id_cliente",  sa.Integer(),   sa.ForeignKey("clientes.id_cliente"), nullable=False),
        sa.Column("data_pedido", sa.Date(),      nullable=False),
        sa.Column("status",      sa.String(50),  nullable=False),
    )
    op.create_index("ix_pedidos_id_cliente", "pedidos", ["id_cliente"])

    op.create_table(
        "servicos",
        sa.Column("id_servico",   sa.Integer(),        primary_key=True, autoincrement=True),
        sa.Column("id_pedido",    sa.Integer(),        sa.ForeignKey("pedidos.id_pedido"),    nullable=False),
        sa.Column("id_tipo",      sa.Integer(),        sa.ForeignKey("tipos_evento.id_tipo"), nullable=False),
        sa.Column("data_servico", sa.Date(),           nullable=False),
        sa.Column("preco",        sa.Numeric(10, 2),   nullable=False),
    )
    op.create_index("ix_servicos_id_pedido", "servicos", ["id_pedido"])

    op.create_table(
        "servico_atores",
        sa.Column("id_servico", sa.Integer(), sa.ForeignKey("servicos.id_servico"), primary_key=True),
        sa.Column("id_ator",    sa.Integer(), sa.ForeignKey("atores.id_ator"),      primary_key=True),
        sa.Column("id_papel",   sa.Integer(), sa.ForeignKey("papeis.id_papel"),     nullable=False),
    )

    op.create_table(
        "pagamentos",
        sa.Column("id_pagamento",   sa.Integer(),      primary_key=True, autoincrement=True),
        sa.Column("id_pedido",      sa.Integer(),      sa.ForeignKey("pedidos.id_pedido"), nullable=False),
        sa.Column("valor",          sa.Numeric(10, 2), nullable=False),
        sa.Column("metodo",         sa.String(50),     nullable=False),
        sa.Column("data_pagamento", sa.Date(),         nullable=False),
    )
    op.create_index("ix_pagamentos_id_pedido", "pagamentos", ["id_pedido"])

    op.create_table(
        "avaliacoes",
        sa.Column("id_avaliacao",  sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("id_servico",    sa.Integer(), sa.ForeignKey("servicos.id_servico"), nullable=False),
        sa.Column("classificacao", sa.Integer(), nullable=False),
        sa.Column("comentario",    sa.Text(),    nullable=True),
        sa.CheckConstraint("classificacao >= 1 AND classificacao <= 5", name="ck_classificacao"),
    )

    op.create_table(
        "swipes",
        sa.Column("id_swipe",   sa.Integer(),   primary_key=True, autoincrement=True),
        sa.Column("id_cliente", sa.Integer(),   sa.ForeignKey("clientes.id_cliente"), nullable=False),
        sa.Column("id_ator",    sa.Integer(),   sa.ForeignKey("atores.id_ator"),      nullable=False),
        sa.Column("direcao",    sa.String(10),  nullable=False),
        sa.UniqueConstraint("id_cliente", "id_ator", name="uq_swipe_pair"),
    )
    op.create_index("ix_swipes_id_cliente", "swipes", ["id_cliente"])

def downgrade() -> None:
    op.drop_table("swipes")
    op.drop_table("avaliacoes")
    op.drop_table("pagamentos")
    op.drop_table("servico_atores")
    op.drop_table("servicos")
    op.drop_table("pedidos")
    op.drop_table("papeis")
    op.drop_table("tipos_evento")
    op.drop_table("atores")
    op.drop_table("clientes")
