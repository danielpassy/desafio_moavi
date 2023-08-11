# Desafio Moavi

Esse repositório contém o código feito para o desafio MOAVI.

O desafio é enunciado da seguinte forma:
> O objetivo desse projeto é construir uma aplicação web de visualização de escalas realizadas
por colaboradores de uma farmácia.

## Requerimentos

1. upload de multiplos arquivo csv seguindo um formato específico
2. Registro dos uploads com: data, nome do arquivo, quantidade de entradas
3. Registros das entradas contidas nos CSV
4. Gráfico de visualização de colaboradores em cada intervalo de 10 minutos
5. Construído com Django e React.


## Visão geral da tecnologia

O projeto é construído usando:

-Python/Django no Backend com type annotations
-React como SPA no Frontend

## Discussão sobre as escolhas tecnológicas

-Django como backend de API REST
-Django Ninja, que oferece:
    -Validação de entrada com Pydantic + anotações de tipo
    -Documentação OpenAPI
    -Outras funcionalidades REST
-TDD, com principalmente testes de integração.

<b>P</b>: Por que o Django Ninja?<br>
<b>R</b>: É uma maneira moderna de construir APIs com o Django, inspirada na filosofia do FastAPI.

<b>P</b>: Por que não testes unitários?<br>
<b>R</b>: Costumo sempre escrever um teste de integração para o uso pretendido e, em seguida, testes unitários para os outros casos. Devido a restrições de tempo, decidi focar nos testes de integração.

<b>P</b>: Por que o React como SPA, por que não o NEXTJS ou templates?<br>
<b>R</b>: O React é a tecnologia que a empresa utiliza. E os recursos extras do NEXTJS exigiriam mais tempo