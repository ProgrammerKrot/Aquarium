"""Add genero column to atores

Revision ID: 003
Revises: 002
Create Date: 2026-06-16
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "atores",
        sa.Column("genero", sa.String(10), nullable=True, server_default="neutral"),
    )
    bind = op.get_bind()
    bind.execute(sa.text(
        "UPDATE atores SET genero = 'female' WHERE nome IN "
        "('Lucia Ferreira', 'Sofia Andrade', 'Elena Vasquez')"
    ))
    bind.execute(sa.text(
        "UPDATE atores SET genero = 'male' WHERE nome IN "
        "('Carlos Mendez', 'Tomas Oliveira', 'Marco Ricci')"
    ))
    bind.execute(sa.text(
        "UPDATE atores SET genero = 'neutral' WHERE genero IS NULL"
    ))


def downgrade() -> None:
    op.drop_column("atores", "genero")
