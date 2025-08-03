package br.com.adatech.dto

import java.math.BigDecimal
import java.time.LocalDateTime

data class DepositoResponseDTO(
    val clienteId: Long,
    val nomeCompleto: String,
    val saldoAtualizado: BigDecimal,
    val dataHoraDeposito: LocalDateTime
)