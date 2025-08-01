package br.com.adatech.dto

import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotNull
import java.math.BigDecimal

data class DepositoRequestDTO(
    @field:NotNull(message = "Valor do depósito é obrigatório")
    @field:DecimalMin(value = "0.01", message = "O valor do depósito deve ser maior que zero")
    val valor: BigDecimal
)