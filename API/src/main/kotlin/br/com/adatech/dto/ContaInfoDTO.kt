package br.com.adatech.dto

import br.com.adatech.enums.TipoConta
import java.math.BigDecimal

data class ContaInfoDTO(
    val numero: String,
    val agencia: String,
    val tipoConta: TipoConta,
    val saldo: BigDecimal,
    val ativa: Boolean
)
