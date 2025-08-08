package br.com.adatech.dto

import br.com.adatech.enums.StatusTransacao
import br.com.adatech.enums.TipoTransacao
import java.math.BigDecimal
import java.time.LocalDateTime

data class TransferenciaResponseDTO(
    val transacaoId: Long,
    val cpfOrigem: String,
    val cpfDestino: String,
    val valor: BigDecimal,
    val status: StatusTransacao,
    val tipoTransacao: TipoTransacao,
    val dataTransacao: LocalDateTime,
    val mensagem: String
)
