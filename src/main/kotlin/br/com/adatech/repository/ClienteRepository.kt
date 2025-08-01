package br.com.adatech.repository

import br.com.adatech.model.Cliente
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ClienteRepository : JpaRepository<Cliente, Long> {
    fun existsByCpf(cpf: String): Boolean
    fun existsByEmail(email: String): Boolean
}