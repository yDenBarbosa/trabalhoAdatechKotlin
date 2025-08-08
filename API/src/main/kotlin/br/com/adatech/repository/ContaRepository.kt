package br.com.adatech.repository

import br.com.adatech.enums.TipoConta
import br.com.adatech.model.Conta
import jakarta.persistence.LockModeType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Lock
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface ContaRepository : JpaRepository<Conta, Long> {
    fun findByClienteCpf(cpf: String): List<Conta>
    fun findByClienteCpfAndTipoConta(cpf: String, tipoConta: TipoConta): Conta?
    fun findByClienteCpfAndAtiva(cpf: String, ativa: Boolean): List<Conta>

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Conta c WHERE c.id = :id")
    fun findByIdWithLock(id: Long): Conta?
}
