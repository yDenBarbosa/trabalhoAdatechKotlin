package br.com.adatech.dto

import jakarta.validation.constraints.*
import java.math.BigDecimal

data class ClienteRequestDTO(
    @field:NotBlank(message = "Nome completo é obrigatório")
    @field:Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    val nomeCompleto: String,

    @field:NotBlank(message = "CPF é obrigatório")
    @field:Pattern(regexp = "\\d{11}", message = "CPF deve conter exatamente 11 dígitos")
    val cpf: String,

    @field:NotBlank(message = "E-mail é obrigatório")
    @field:Email(message = "E-mail deve ter formato válido")
    val email: String,

    @field:NotBlank(message = "Telefone é obrigatório")
    @field:Pattern(regexp = "\\d{10,11}", message = "Telefone deve ter 10 ou 11 dígitos")
    val telefone: String,

    @field:DecimalMin(value = "0.0", message = "Saldo inicial deve ser maior ou igual a zero")
    val saldoInicial: BigDecimal
)
