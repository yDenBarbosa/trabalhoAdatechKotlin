package br.com.adatech

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class AdatechApplication

fun main(args: Array<String>) {
	runApplication<AdatechApplication>(*args)
}
