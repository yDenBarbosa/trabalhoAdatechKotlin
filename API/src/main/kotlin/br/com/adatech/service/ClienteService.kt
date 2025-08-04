package br.com.adatech.service

import br.com.adatech.dto.ClienteRequestDTO
import br.com.adatech.dto.ClienteResponseDTO
import br.com.adatech.dto.ClienteUpdateRequestDTO
import br.com.adatech.dto.DepositoResponseDTO
import br.com.adatech.dto.SaldoResponseDTO
import br.com.adatech.model.Cliente
import br.com.adatech.repository.ClienteRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.LocalDateTime

@Service
@Transactional
class ClienteService(
    private val clienteRepository: ClienteRepository
) {

    fun cadastrarCliente(request: ClienteRequestDTO): ClienteResponseDTO {
        if (clienteRepository.existsByCpf(request.cpf)) {
            throw IllegalArgumentException("CPF já cadastrado no sistema")
        }

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
    fun buscarTodosClientes(): List<ClienteResponseDTO> =
        clienteRepository.findAll().map { it.toResponseDTO() }

    @Transactional()
    fun atualizarCliente(id: Long, updateDTO: ClienteUpdateRequestDTO): ClienteResponseDTO {
        val cliente = clienteRepository.findById(id)
            .orElseThrow { NoSuchElementException("Cliente não encontrado com ID: $id") }

        if (updateDTO.email != null && updateDTO.email != cliente.email) {
            if (clienteRepository.existsByEmail(updateDTO.email)) {
                throw IllegalArgumentException("E-mail já cadastrado no sistema")
            }
        }

        val clienteAtualizado = cliente.copy(
            id = cliente.id,
            nomeCompleto = updateDTO.nomeCompleto ?: cliente.nomeCompleto,
            email = updateDTO.email ?: cliente.email,
            telefone = updateDTO.telefone ?: cliente.telefone
        )

        val salvo = clienteRepository.save(clienteAtualizado)
        return salvo.toResponseDTO()
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

    fun realizarDeposito(clienteId: Long, valor: BigDecimal): DepositoResponseDTO {
        if (valor <= BigDecimal.ZERO) {
            throw IllegalArgumentException("Valor do depósito deve ser maior que zero")
        }

        val cliente = clienteRepository.findById(clienteId)
            .orElseThrow { NoSuchElementException("Cliente não encontrado com ID: $clienteId") }

        val novoSaldo = cliente.saldo + valor
        val clienteAtualizado = cliente.copy(saldo = novoSaldo)
        clienteRepository.save(clienteAtualizado)

        return DepositoResponseDTO(
            clienteId = clienteAtualizado.id!!,
            nomeCompleto = clienteAtualizado.nomeCompleto,
            saldoAtualizado = novoSaldo,
            dataHoraDeposito = LocalDateTime.now()
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
