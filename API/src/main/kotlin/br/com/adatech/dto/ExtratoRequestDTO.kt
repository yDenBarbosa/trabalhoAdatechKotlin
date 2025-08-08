package br.com.adatech.dto

import br.com.adatech.enums.TipoTransacao
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import java.time.LocalDate

data class ExtratoRequestDTO(
    @field:NotBlank(message = "CPF é obrigatório")
    @field:Pattern(regexp = "\\d{11}", message = "CPF deve conter 11 dígitos")
    val cpf: String,

    val dataInicio: LocalDate? = null,
    val dataFim: LocalDate? = null,
    val tipoTransacao: TipoTransacao? = null
)
