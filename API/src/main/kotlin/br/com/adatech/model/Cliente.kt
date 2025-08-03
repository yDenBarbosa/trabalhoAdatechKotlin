package br.com.adatech.model


import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "clientes")
data class Cliente(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "nome_completo", nullable = false)
    @NotBlank(message = "Nome completo é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    val nomeCompleto: String,

    @Column(name = "cpf", nullable = false, unique = true)
    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "CPF deve conter exatamente 11 dígitos")
    val cpf: String,

    @Column(name = "email", nullable = false, unique = true)
    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail deve ter formato válido")
    val email: String,

    @Column(name = "telefone", nullable = false)
    @NotBlank(message = "Telefone é obrigatório")
    @Pattern(regexp = "\\d{10,11}", message = "Telefone deve ter 10 ou 11 dígitos")
    val telefone: String,

    @Column(name = "saldo", nullable = false, precision = 15, scale = 2)
    @DecimalMin(value = "0.0", message = "Saldo inicial deve ser maior ou igual a zero")
    val saldo: BigDecimal,

    @Column(name = "data_cadastro", nullable = false)
    val dataCadastro: LocalDateTime = LocalDateTime.now()
)