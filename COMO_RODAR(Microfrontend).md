# Como rodar o projeto
Este projeto é composto por três partes:

financas-api — backend em Spring Boot
financas-webapp — frontend principal em React + Vite
financas-summary-mfe — microfrontend de resumo financeiro

1. Instalar as dependências
cd ..
cd financas-summary-mfe
npm install

2. Ordem recomendada para iniciar
A ordem mais segura é:

1° Backend
2° Microfrontend
3° Frontend principal

Use três terminais separados.



# Terminal 2 — Microfrontend
Na raiz do projeto:

cd financas-summary-mfe
npm run dev

O microfrontend deve iniciar em:

http://localhost:5001

Para confirmar que o Module Federation está funcionando, o projeto também deve disponibilizar o módulo remoto.

Em modo de build/preview:

npm run build
npm run preview

Depois é possível acessar:

http://localhost:5001/remoteEntry.js

Esse arquivo é utilizado pelo frontend principal para carregar o componente remoto.

# Microfrontend
O projeto financas-summary-mfe contém o componente de resumo financeiro utilizado no Dashboard.

Ele exibe:

Receita
Despesas
Total de transações

Os dados continuam sendo obtidos e controlados pelo frontend principal por meio do Redux. O Dashboard envia os valores para o microfrontend através de propriedades (props).

Por isso, o financas-summary-mfe precisa estar rodando para que o componente remoto seja carregado normalmente.

# Resumo rápido
Terminal 1
cd financas-api
.\mvnw.cmd spring-boot:run

Terminal 2
cd financas-summary-mfe
npm run dev

Terminal 3
cd financas-webapp
npm run dev