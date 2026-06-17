from sqlalchemy import (
    CheckConstraint,
    Column,
    Date,
    Float,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from .base import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id_cliente = Column(Integer,      primary_key=True, autoincrement=True)
    nome       = Column(String(255),  nullable=False)
    cidade     = Column(String(255),  nullable=False)
    telefone   = Column(String(50),   nullable=False)
    bio        = Column(Text,         nullable=True)
    latitude   = Column(Float,        nullable=True)
    longitude  = Column(Float,        nullable=True)
    telegram   = Column(String(100),  nullable=True)

    pedidos = relationship("Pedido", back_populates="cliente")
    swipes  = relationship("Swipe",  back_populates="cliente")

class Ator(Base):
    __tablename__ = "atores"

    id_ator       = Column(Integer,     primary_key=True, autoincrement=True)
    nome          = Column(String(255), nullable=False)
    idade         = Column(Integer,     nullable=False)
    nacionalidade = Column(String(100), nullable=False)
    genero        = Column(String(10),  nullable=True, default="neutral")
    avatar_url    = Column(String(500), nullable=True)
    bio           = Column(Text,        nullable=True)
    latitude      = Column(Float,       nullable=True)
    longitude     = Column(Float,       nullable=True)
    telegram      = Column(String(100), nullable=True)

    servico_atores = relationship("ServicoAtor", back_populates="ator")
    swipes         = relationship("Swipe",       back_populates="ator")

class TipoEvento(Base):
    __tablename__ = "tipos_evento"

    id_tipo   = Column(Integer,     primary_key=True, autoincrement=True)
    descricao = Column(String(255), nullable=False)

    servicos = relationship("Servico", back_populates="tipo_evento")

class Pedido(Base):
    __tablename__ = "pedidos"

    id_pedido   = Column(Integer,     primary_key=True, autoincrement=True)
    id_cliente  = Column(Integer,     ForeignKey("clientes.id_cliente"), nullable=False)
    data_pedido = Column(Date,        nullable=False)
    status      = Column(String(50),  nullable=False)

    cliente    = relationship("Cliente",    back_populates="pedidos")
    servicos   = relationship("Servico",    back_populates="pedido")
    pagamentos = relationship("Pagamento",  back_populates="pedido")

class Servico(Base):
    __tablename__ = "servicos"

    id_servico   = Column(Integer,        primary_key=True, autoincrement=True)
    id_pedido    = Column(Integer,        ForeignKey("pedidos.id_pedido"),       nullable=False)
    id_tipo      = Column(Integer,        ForeignKey("tipos_evento.id_tipo"),    nullable=False)
    data_servico = Column(Date,           nullable=False)
    preco        = Column(Numeric(10, 2), nullable=False)

    pedido         = relationship("Pedido",      back_populates="servicos")
    tipo_evento    = relationship("TipoEvento",  back_populates="servicos")
    servico_atores = relationship("ServicoAtor", back_populates="servico")
    avaliacoes     = relationship("Avaliacao",   back_populates="servico")

class Papel(Base):
    __tablename__ = "papeis"

    id_papel  = Column(Integer,     primary_key=True, autoincrement=True)
    descricao = Column(String(255), nullable=False)

    servico_atores = relationship("ServicoAtor", back_populates="papel")

class ServicoAtor(Base):
    __tablename__ = "servico_atores"

    id_servico = Column(Integer, ForeignKey("servicos.id_servico"), primary_key=True)
    id_ator    = Column(Integer, ForeignKey("atores.id_ator"),      primary_key=True)
    id_papel   = Column(Integer, ForeignKey("papeis.id_papel"),     nullable=False)

    servico = relationship("Servico", back_populates="servico_atores")
    ator    = relationship("Ator",    back_populates="servico_atores")
    papel   = relationship("Papel",   back_populates="servico_atores")

class Pagamento(Base):
    __tablename__ = "pagamentos"

    id_pagamento   = Column(Integer,        primary_key=True, autoincrement=True)
    id_pedido      = Column(Integer,        ForeignKey("pedidos.id_pedido"), nullable=False)
    valor          = Column(Numeric(10, 2), nullable=False)
    metodo         = Column(String(50),     nullable=False)
    data_pagamento = Column(Date,           nullable=False)

    pedido = relationship("Pedido", back_populates="pagamentos")

class Avaliacao(Base):
    __tablename__ = "avaliacoes"
    __table_args__ = (
        CheckConstraint("classificacao >= 1 AND classificacao <= 5", name="ck_classificacao"),
    )

    id_avaliacao  = Column(Integer,  primary_key=True, autoincrement=True)
    id_servico    = Column(Integer,  ForeignKey("servicos.id_servico"), nullable=False)
    classificacao = Column(Integer,  nullable=False)
    comentario    = Column(Text,     nullable=True)

    servico = relationship("Servico", back_populates="avaliacoes")

class Swipe(Base):
    __tablename__ = "swipes"
    __table_args__ = (
        UniqueConstraint("id_cliente", "id_ator", name="uq_swipe_pair"),
    )

    id_swipe   = Column(Integer,    primary_key=True, autoincrement=True)
    id_cliente = Column(Integer,    ForeignKey("clientes.id_cliente"), nullable=False)
    id_ator    = Column(Integer,    ForeignKey("atores.id_ator"),      nullable=False)
    direcao    = Column(String(10), nullable=False)

    cliente = relationship("Cliente", back_populates="swipes")
    ator    = relationship("Ator",    back_populates="swipes")
