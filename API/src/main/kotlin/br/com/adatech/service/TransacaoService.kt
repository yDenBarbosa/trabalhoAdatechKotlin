package br.com.adatech.service

import br.com.adatech.dto.ConsultaSaldoResponseDTO
import br.com.adatech.dto.ContaInfoDTO
import br.com.adatech.dto.ExtratoRequestDTO
import br.com.adatech.dto.TransferenciaRequestDTO
import br.com.adatech.dto.TransferenciaResponseDTO
import br.com.adatech.enums.StatusTransacao
import br.com.adatech.repository.ClienteRepository
import br.com.adatech.repository.ContaRepository
import br.com.adatech.repository.TransacaoRepository
import br.com.adatech.util.CpfValidator
import br.com.adatech.exception.CpfInvalidoException
import br.com.adatech.exception.ContaNaoEncontradaException
import br.com.adatech.exception.ClienteNaoEncontradoException
import br.com.adatech.exception.ContaInativaException
import br.com.adatech.exception.SaldoInsuficienteException
import br.com.adatech.model.Transacao
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class TransacaoService(
    private val clienteRepository: ClienteRepository,
    private val contaRepository: ContaRepository,
    private val transacaoRepository: TransacaoRepository,
    private val cpfValidator: CpfValidator
) {

    private val logger = LoggerFactory.getLogger(TransacaoService::class.java)

    @Transactional
    fun transferir(request: TransferenciaRequestDTO): TransferenciaResponseDTO {
        logger.info("Iniciando transferência de ${request.valor} do CPF ${request.cpfOrigem} para ${request.cpfDestino}")

        // Validações de CPF
        if (!cpfValidator.isValid(request.cpfOrigem)) {
            throw CpfInvalidoException("CPF de origem inválido: ${request.cpfOrigem}")
        }
        if (!cpfValidator.isValid(request.cpfDestino)) {
            throw CpfInvalidoException("CPF de destino inválido: ${request.cpfDestino}")
        }

        if (request.cpfOrigem == request.cpfDestino) {
            throw IllegalArgumentException("CPF origem e destino não podem ser iguais")
        }

        // Buscar clientes
        val clienteOrigem = clienteRepository.findByCpf(request.cpfOrigem)
            ?: throw ClienteNaoEncontradoException("Cliente não encontrado para CPF: ${request.cpfOrigem}")

        val clienteDestino = clienteRepository.findByCpf(request.cpfDestino)
            ?: throw ClienteNaoEncontradoException("Cliente não encontrado para CPF: ${request.cpfDestino}")

        // Buscar contas
        val contaOrigem = contaRepository.findByClienteCpfAndTipoConta(request.cpfOrigem, request.tipoConta)
            ?: throw ContaNaoEncontradaException("Conta ${request.tipoConta} não encontrada para CPF: ${request.cpfOrigem}")

        val contaDestino = contaRepository.findByClienteCpfAndTipoConta(request.cpfDestino, request.tipoConta)
            ?: throw ContaNaoEncontradaException("Conta ${request.tipoConta} não encontrada para CPF: ${request.cpfDestino}")

        // Verificar se as contas estão ativas
        if (!contaOrigem.ativa) {
            throw ContaInativaException("Conta de origem está inativa")
        }
        if (!contaDestino.ativa) {
            throw ContaInativaException("Conta de destino está inativa")
        }

        // Criar registro da transação
        val transacao = Transacao(
            cpfOrigem = request.cpfOrigem,
            cpfDestino = request.cpfDestino,
            contaOrigemId = contaOrigem.id!!,
            contaDestinoId = contaDestino.id!!,
            valor = request.valor,
            descricao = request.descricao,
            tipoTransacao = request.tipoTransacao,
            status = StatusTransacao.PENDENTE
        )
        val transacaoSalva = transacaoRepository.save(transacao)

        try {
            // Bloquear contas para evitar condições de corrida
            val contaOrigemBloqueada = contaRepository.findByIdWithLock(contaOrigem.id!!)
                ?: throw ContaNaoEncontradaException("Conta origem não encontrada para bloqueio")

            val contaDestinoBloqueada = contaRepository.findByIdWithLock(contaDestino.id!!)
                ?: throw ContaNaoEncontradaException("Conta destino não encontrada para bloqueio")

            // Verificar saldo suficiente
            if (contaOrigemBloqueada.saldo < request.valor) {
                throw SaldoInsuficienteException("Saldo insuficiente. Saldo atual: ${contaOrigemBloqueada.saldo}")
            }

            // Realizar a transferência
            contaOrigemBloqueada.saldo = contaOrigemBloqueada.saldo.subtract(request.valor)
            contaDestinoBloqueada.saldo = contaDestinoBloqueada.saldo.add(request.valor)

            // Salvar as alterações
            contaRepository.save(contaOrigemBloqueada)
            contaRepository.save(contaDestinoBloqueada)

            // Atualizar status da transação
            transacaoSalva.status = StatusTransacao.CONCLUIDA
            val transacaoFinalizada = transacaoRepository.save(transacaoSalva)

            logger.info("Transferência concluída com sucesso. ID da transação: ${transacaoSalva.id}")

            return TransferenciaResponseDTO(
                transacaoId = transacaoFinalizada.id!!,
                cpfOrigem = request.cpfOrigem,
                cpfDestino = request.cpfDestino,
                valor = request.valor,
                status = StatusTransacao.CONCLUIDA,
                tipoTransacao = request.tipoTransacao,
                dataTransacao = transacaoFinalizada.dataTransacao,
                mensagem = "Transferência realizada com sucesso"
            )

        } catch (e: Exception) {
            logger.error("Erro durante a transferência: ${e.message}", e)

            // Atualizar status da transação para falha
            transacaoSalva.status = StatusTransacao.FALHA
            transacaoRepository.save(transacaoSalva)

            // Re-lançar a exceção para provocar rollback
            throw e
        }
    }

    @Transactional(readOnly = true)
    fun consultarSaldo(cpf: String): ConsultaSaldoResponseDTO {
        if (!cpfValidator.isValid(cpf)) {
            throw CpfInvalidoException("CPF inválido: $cpf")
        }

        val cliente = clienteRepository.findByCpf(cpf)
            ?: throw ClienteNaoEncontradoException("Cliente não encontrado para CPF: $cpf")

        val contas = contaRepository.findByClienteCpf(cpf)

        val contasInfo = contas.map { conta ->
            ContaInfoDTO(
                numero = conta.numero,
                agencia = conta.agencia,
                tipoConta = conta.tipoConta,
                saldo = conta.saldo,
                ativa = conta.ativa
            )
        }

        return ConsultaSaldoResponseDTO(
            cpf = cpf,
            nomeCliente = cliente.nomeCompleto,
            contas = contasInfo
        )
    }

    @Transactional(readOnly = true)
    fun buscarExtrato(request: ExtratoRequestDTO): List<Transacao> {
        if (!cpfValidator.isValid(request.cpf)) {
            throw CpfInvalidoException("CPF inválido: ${request.cpf}")
        }

        val cliente = clienteRepository.findByCpf(request.cpf)
            ?: throw ClienteNaoEncontradoException("Cliente não encontrado para CPF: ${request.cpf}")

        return transacaoRepository.findByCpfOrigemOrCpfDestinoOrderByDataTransacaoDesc(request.cpf, request.cpf)
    }
}
