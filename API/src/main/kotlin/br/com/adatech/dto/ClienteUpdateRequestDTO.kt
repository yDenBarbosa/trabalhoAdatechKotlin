package br.com.adatech.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Size

data class ClienteUpdateRequestDTO(
    @field:Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    val nomeCompleto: String?,

    @field:Email(message = "E-mail deve ter formato válido")
    val email: String?,

    @field:Size(min = 10, max = 11, message = "Telefone deve ter 10 ou 11 dígitos")
    val telefone: String?
)