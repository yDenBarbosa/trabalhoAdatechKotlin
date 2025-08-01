package br.com.adatech.dto

import java.math.BigDecimal
import java.time.LocalDateTime

data class ClienteResponseDTO(
    val id: Long,
    val nomeCompleto: String,
    val cpf: String,
    val email: String,
    val telefone: String,
    val saldo: BigDecimal,
    val dataCadastro: LocalDateTime
)
