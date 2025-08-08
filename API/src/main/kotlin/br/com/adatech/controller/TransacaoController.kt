package br.com.adatech.controller

import br.com.adatech.dto.ConsultaSaldoResponseDTO
import br.com.adatech.dto.ExtratoRequestDTO
import br.com.adatech.dto.TransferenciaRequestDTO
import br.com.adatech.dto.TransferenciaResponseDTO
import br.com.adatech.exception.ClienteNaoEncontradoException
import br.com.adatech.exception.ContaInativaException
import br.com.adatech.exception.ContaNaoEncontradaException
import br.com.adatech.exception.CpfInvalidoException
import br.com.adatech.exception.SaldoInsuficienteException
import br.com.adatech.model.Transacao
import br.com.adatech.service.TransacaoService
import jakarta.validation.Valid
import jakarta.validation.constraints.Pattern
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/transacoes")
@Validated
class TransacaoController(
    private val transacaoService: TransacaoService
) {

    @PostMapping("/transferir")
    fun transferir(@RequestBody @Valid request: TransferenciaRequestDTO): ResponseEntity<TransferenciaResponseDTO> {
        return try {
            val response = transacaoService.transferir(request)
            ResponseEntity.ok(response)
        } catch (e: CpfInvalidoException) {
            ResponseEntity.badRequest().build()
        } catch (e: ClienteNaoEncontradoException) {
            ResponseEntity.badRequest().build()
        } catch (e: ContaNaoEncontradaException) {
            ResponseEntity.badRequest().build()
        } catch (e: SaldoInsuficienteException) {
            ResponseEntity.badRequest().build()
        } catch (e: ContaInativaException) {
            ResponseEntity.badRequest().build()
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().build()
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @GetMapping("/saldo/{cpf}")
    fun consultarSaldo(@PathVariable @Pattern(regexp = "\\d{11}") cpf: String): ResponseEntity<ConsultaSaldoResponseDTO> {
        return try {
            val response = transacaoService.consultarSaldo(cpf)
            ResponseEntity.ok(response)
        } catch (e: CpfInvalidoException) {
            ResponseEntity.badRequest().build()
        } catch (e: ClienteNaoEncontradoException) {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/extrato")
    fun buscarExtrato(@RequestBody @Valid request: ExtratoRequestDTO): ResponseEntity<List<Transacao>> {
        return try {
            val transacoes = transacaoService.buscarExtrato(request)
            ResponseEntity.ok(transacoes)
        } catch (e: CpfInvalidoException) {
            ResponseEntity.badRequest().build()
        } catch (e: ClienteNaoEncontradoException) {
            ResponseEntity.notFound().build()
        }
    }
}
