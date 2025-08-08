package br.com.adatech.util

import org.springframework.stereotype.Component

@Component
class CpfValidator {

    fun isValid(cpf: String): Boolean {
        if (cpf.length != 11 || cpf.all { it == cpf[0] }) {
            return false
        }

        // Validação do primeiro dígito
        var soma = 0
        for (i in 0..8) {
            soma += cpf[i].digitToInt() * (10 - i)
        }
        var resto = soma % 11
        val digito1 = if (resto < 2) 0 else 11 - resto

        if (cpf[9].digitToInt() != digito1) {
            return false
        }

        // Validação do segundo dígito
        soma = 0
        for (i in 0..9) {
            soma += cpf[i].digitToInt() * (11 - i)
        }
        resto = soma % 11
        val digito2 = if (resto < 2) 0 else 11 - resto

        return cpf[10].digitToInt() == digito2
    }
}