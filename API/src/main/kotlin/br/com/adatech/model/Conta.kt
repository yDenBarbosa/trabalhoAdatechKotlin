package br.com.adatech.model

import br.com.adatech.enums.TipoConta
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
@Table(name = "contas")
data class Conta(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true)
    val numero: String,

    @Column(nullable = false)
    val agencia: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    val cliente: Cliente,

    @Column(nullable = false)
    var saldo: BigDecimal = BigDecimal.ZERO,

    @Enumerated(EnumType.STRING)
    val tipoConta: TipoConta = TipoConta.CORRENTE,

    @Column(nullable = false)
    val ativa: Boolean = true,

    @Column(nullable = false)
    val dataCriacao: LocalDateTime = LocalDateTime.now()
) { }