from datetime import date
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    bind = op.get_bind()

    bind.execute(sa.text("""
        INSERT INTO clientes (id_cliente, nome, cidade, telefone) VALUES
        (1, 'Ana Costa',    'Sao Paulo',       '+55-11-90000-0001'),
        (2, 'Bruno Lima',   'Rio de Janeiro',  '+55-21-90000-0002'),
        (3, 'Carla Nunes',  'Brasilia',        '+55-61-90000-0003')
        ON CONFLICT DO NOTHING
        INSERT INTO atores (id_ator, nome, idade, nacionalidade) VALUES
        (1, 'Lucia Ferreira', 28, 'Brazilian'),
        (2, 'Carlos Mendez',  34, 'Mexican'),
        (3, 'Sofia Andrade',  25, 'Portuguese'),
        (4, 'Tomas Oliveira', 31, 'Brazilian'),
        (5, 'Elena Vasquez',  29, 'Colombian'),
        (6, 'Marco Ricci',    37, 'Italian'),
        (7, 'Yuki Tanaka',    26, 'Japanese')
        ON CONFLICT DO NOTHING
        INSERT INTO tipos_evento (id_tipo, descricao) VALUES
        (1, 'Wedding'),
        (2, 'Corporate Event'),
        (3, 'Birthday Party'),
        (4, 'Private Gathering')
        ON CONFLICT DO NOTHING
        INSERT INTO papeis (id_papel, descricao) VALUES
        (1, 'Companion'),
        (2, 'Host'),
        (3, 'Entertainment')
        ON CONFLICT DO NOTHING
