package br.com.adatech.dto

import java.math.BigDecimal

data class SaldoResponseDTO(
    val clienteId: Long,
    val nomeCompleto: String,
    val saldo: BigDecimal
)
