package br.com.adatech.dto

data class ConsultaSaldoResponseDTO(
    val cpf: String,
    val nomeCliente: String,
    val contas: List<ContaInfoDTO>
)
