package br.com.adatech.model

import br.com.adatech.enums.StatusTransacao
import br.com.adatech.enums.TipoTransacao
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "transacoes")
data class Transacao(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    val cpfOrigem: String,

    @Column(nullable = false)
    val cpfDestino: String,

    @Column(nullable = false)
    val contaOrigemId: Long,

    @Column(nullable = false)
    val contaDestinoId: Long,

    @Column(nullable = false)
    val valor: BigDecimal,

    @Column(nullable = false)
    val descricao: String = "",

    @Column(nullable = false)
    val dataTransacao: LocalDateTime = LocalDateTime.now(),

    @Enumerated(EnumType.STRING)
    val tipoTransacao: TipoTransacao = TipoTransacao.TRANSFERENCIA,

    @Enumerated(EnumType.STRING)
    var status: StatusTransacao = StatusTransacao.PENDENTE
) {
    constructor() : this(null, "", "", 0L, 0L, BigDecimal.ZERO, "", LocalDateTime.now(), TipoTransacao.TRANSFERENCIA, StatusTransacao.PENDENTE)
}