# Gerador de jogos lotofácil
Lightweight, sem depedências, aleatório.

## Gerar Jogos
Por padrão gera apenas 1 jogo e salva em `jogos/last.json`, outros jogos já 
salvos não são descartados, apenas movidos para outros arquivos.

```sh
node generator.js
```

Argumentos opcionais:
```js
-jogos=10 // Quantidade de jogos a serem gerados
-numeros=1,2,3,4 // Números a estarem presentes em todas as apostas
```

## Conferir último resultado
O resultado completo é salvo em `resultados/last.json`, o último arquivo é
apagado.

```sh
#                numeros do resultado
node checker.js -nums=1,2,3,4,5
```