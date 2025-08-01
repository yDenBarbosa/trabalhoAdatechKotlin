# Projeto: Kotlin - Programa Orientada a Objetos.

## ENDPOINTS DISPONÍVEIS:

1. POST /api/clientes
   - Cadastra um novo cliente
   - Body exemplo:
   {
     "nomeCompleto": "João Silva Santos",
     "cpf": "12345678901",
     "email": "joao@email.com",
     "telefone": "11987654321",
     "saldoInicial": 1000.00
   }

2. GET /api/clientes
   - Lista todos os clientes cadastrados

3. GET /api/clientes/{id}
   - Busca um cliente específico pelo ID

4. GET /api/clientes/{id}/saldo
   - Consulta apenas o saldo de um cliente específico