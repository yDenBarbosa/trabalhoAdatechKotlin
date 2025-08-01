package br.com.adatech.service

import br.com.adatech.dto.ClienteRequestDTO
import br.com.adatech.dto.ClienteResponseDTO
import br.com.adatech.dto.SaldoResponseDTO
import br.com.adatech.model.Cliente
import br.com.adatech.repository.ClienteRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class ClienteService(
    private val clienteRepository: ClienteRepository
) {

    fun cadastrarCliente(request: ClienteRequestDTO): ClienteResponseDTO {
        // Validar se CPF já existe
        if (clienteRepository.existsByCpf(request.cpf)) {
            throw IllegalArgumentException("CPF já cadastrado no sistema")
        }

        // Validar se email já existe
        if (clienteRepository.existsByEmail(request.email)) {
            throw IllegalArgumentException("E-mail já cadastrado no sistema")
        }

        val cliente = Cliente(
            nomeCompleto = request.nomeCompleto,
            cpf = request.cpf,
            email = request.email,
            telefone = request.telefone,
            saldo = request.saldoInicial
        )

        val clienteSalvo = clienteRepository.save(cliente)
        return clienteSalvo.toResponseDTO()
    }

    @Transactional(readOnly = true)
    fun buscarTodosClientes(): List<ClienteResponseDTO> {
        return clienteRepository.findAll().map { it.toResponseDTO() }
    }

    @Transactional(readOnly = true)
    fun buscarClientePorId(id: Long): ClienteResponseDTO {
        val cliente = clienteRepository.findById(id)
            .orElseThrow { NoSuchElementException("Cliente não encontrado com ID: $id") }
        return cliente.toResponseDTO()
    }

    @Transactional(readOnly = true)
    fun consultarSaldo(id: Long): SaldoResponseDTO {
        val cliente = clienteRepository.findById(id)
            .orElseThrow { NoSuchElementException("Cliente não encontrado com ID: $id") }

        return SaldoResponseDTO(
            clienteId = cliente.id!!,
            nomeCompleto = cliente.nomeCompleto,
            saldo = cliente.saldo
        )
    }

    private fun Cliente.toResponseDTO() = ClienteResponseDTO(
        id = this.id!!,
        nomeCompleto = this.nomeCompleto,
        cpf = this.cpf,
        email = this.email,
        telefone = this.telefone,
        saldo = this.saldo,
        dataCadastro = this.dataCadastro
    )
}