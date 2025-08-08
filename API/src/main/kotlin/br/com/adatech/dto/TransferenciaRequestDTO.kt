package br.com.adatech.dto

import br.com.adatech.enums.TipoConta
import br.com.adatech.enums.TipoTransacao
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import java.math.BigDecimal

data class TransferenciaRequestDTO(
    @field:NotBlank(message = "CPF de origem é obrigatório")
    @field:Pattern(regexp = "\\d{11}", message = "CPF deve conter 11 dígitos")
    val cpfOrigem: String,

    @field:NotBlank(message = "CPF de destino é obrigatório")
    @field:Pattern(regexp = "\\d{11}", message = "CPF deve conter 11 dígitos")
    val cpfDestino: String,

    @field:DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    val valor: BigDecimal,

    val tipoTransacao: TipoTransacao = TipoTransacao.TRANSFERENCIA,
    val tipoConta: TipoConta = TipoConta.CORRENTE,
    val descricao: String = ""
)
