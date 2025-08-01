package br.com.adatech.controller

import br.com.adatech.dto.ClienteRequestDTO
import br.com.adatech.dto.ClienteResponseDTO
import br.com.adatech.dto.SaldoResponseDTO
import br.com.adatech.service.ClienteService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/clientes")
class ClienteController(
    private val clienteService: ClienteService
) {

    @PostMapping
    fun cadastrarCliente(@Valid @RequestBody request: ClienteRequestDTO): ResponseEntity<ClienteResponseDTO> {
        val cliente = clienteService.cadastrarCliente(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(cliente)
    }

    @GetMapping
    fun listarTodosClientes(): ResponseEntity<List<ClienteResponseDTO>> {
        val clientes = clienteService.buscarTodosClientes()
        return ResponseEntity.ok(clientes)
    }

    @GetMapping("/{id}")
    fun buscarClientePorId(@PathVariable id: Long): ResponseEntity<ClienteResponseDTO> {
        val cliente = clienteService.buscarClientePorId(id)
        return ResponseEntity.ok(cliente)
    }

    @GetMapping("/{id}/saldo")
    fun consultarSaldo(@PathVariable id: Long): ResponseEntity<SaldoResponseDTO> {
        val saldo = clienteService.consultarSaldo(id)
        return ResponseEntity.ok(saldo)
    }
}