package br.com.adatech.repository

import br.com.adatech.enums.StatusTransacao
import br.com.adatech.model.Transacao
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface TransacaoRepository : JpaRepository<Transacao, Long> {
    fun findByCpfOrigemOrCpfDestinoOrderByDataTransacaoDesc(cpfOrigem: String, cpfDestino: String): List<Transacao>
    fun findByCpfOrigemOrderByDataTransacaoDesc(cpfOrigem: String): List<Transacao>
    fun findByStatusAndDataTransacaoBetween(status: StatusTransacao, inicio: LocalDateTime, fim: LocalDateTime): List<Transacao>
}