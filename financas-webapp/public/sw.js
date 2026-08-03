/**
 * Service Worker — Finanças WebApp (RF06 / PWA)
 *
 * Responsabilidades:
 *  - Cache First para  GET /categories  e  GET /spending-limits
 *  - Network First (com fallback em cache) para  GET /transactions
 *  - Página de fallback offline para navegações que falharem por falta de rede
 *  - Recebimento de mensagens da aplicação para exibir Web Notifications
 *    quando um limite de gastos atinge >= 80%
 *
 * Observação: os requisitos de estratégia de cache (cache-first / network-first)
 * se aplicam apenas às rotas listadas abaixo. Demais requisições (auth, goals,
 * criação/edição de recursos via POST/PUT/DELETE, etc.) seguem o comportamento
 * padrão do navegador, sem interceptação.
 */

const SW_VERSION = "v2";
const STATIC_CACHE_NAME = `financas-static-${SW_VERSION}`;
const API_CACHE_NAME = `financas-api-${SW_VERSION}`;

const OFFLINE_URL = "/offline.html";

// Precisa bater com a baseURL configurada em src/services/api.ts
const API_ORIGIN = "http://localhost:8080";

const CACHE_FIRST_ROUTES = ["/categories", "/spending-limits"];
const NETWORK_FIRST_ROUTES = ["/transactions"];

// Usado em todo fetch() feito de dentro do SW para checar conectividade real.
// Sem isso, o navegador pode responder a partir do cache HTTP comum (disco)
// mesmo com a rede desligada, e o catch() de fallback nunca é acionado.
const NO_HTTP_CACHE = { cache: "no-store" };

/* ------------------------------------------------------------------ */
/* Ciclo de vida                                                       */
/* ------------------------------------------------------------------ */

self.addEventListener("install", (event) => {
  console.log(`[SW ${SW_VERSION}] install`);
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(async (cache) => {
      try {
        // fetch manual + put (em vez de cache.add) para poder usar no-store:
        // garante que estamos guardando o offline.html mais recente do servidor,
        // não uma cópia antiga do cache HTTP do navegador.
        const response = await fetch(OFFLINE_URL, NO_HTTP_CACHE);
        await cache.put(OFFLINE_URL, response);
        console.log(`[SW ${SW_VERSION}] offline.html pré-cacheado com sucesso`);
      } catch (error) {
        console.error(
          `[SW ${SW_VERSION}] Falha ao pré-cachear página offline — o fallback offline NÃO vai funcionar até isso ser corrigido:`,
          error
        );
        // Propaga o erro: install falha de propósito, o navegador tenta
        // instalar o SW novamente mais tarde em vez de "dar certo" sem a
        // página offline em cache.
        throw error;
      }
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log(`[SW ${SW_VERSION}] activate`);
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (name) =>
                name !== STATIC_CACHE_NAME && name !== API_CACHE_NAME
            )
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
      .then(() => console.log(`[SW ${SW_VERSION}] ativo e controlando os clients`))
  );
});

/* ------------------------------------------------------------------ */
/* Estratégias de cache                                                */
/* ------------------------------------------------------------------ */

function offlineJsonResponse() {
  return new Response(
    JSON.stringify({
      error: "offline",
      message:
        "Você está offline e não há dados em cache para esta requisição.",
    }),
    {
      status: 503,
      statusText: "Service Unavailable (Offline)",
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Cache First: usa o cache se existir; caso contrário busca na rede e cacheia.
async function cacheFirst(request) {
  const cache = await caches.open(API_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request, NO_HTTP_CACHE);

    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    return offlineJsonResponse();
  }
}

// Usada para POST/DELETE em rotas cacheadas com Cache First: encaminha a
// requisição normalmente e, se der certo, invalida o cache correspondente
// para que a próxima leitura (GET) busque dados atualizados na rede.
async function invalidateCacheAndForward(request, urlsToInvalidate) {
  const response = await fetch(request);

  if (response.ok) {
    const cache = await caches.open(API_CACHE_NAME);

    await Promise.all(
      urlsToInvalidate.map((url) => cache.delete(url))
    );
  }

  return response;
}

function isSpendingLimitsMutation(url, method) {
  if (url.origin !== API_ORIGIN) {
    return false;
  }

  if (method !== "POST" && method !== "DELETE") {
    return false;
  }

  return (
    url.pathname === "/spending-limits" ||
    url.pathname.startsWith("/spending-limits/")
  );
}

// Network First: tenta a rede primeiro; se falhar, cai para o cache.
async function networkFirst(request) {
  const cache = await caches.open(API_CACHE_NAME);

  try {
    const networkResponse = await fetch(request, NO_HTTP_CACHE);

    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return offlineJsonResponse();
  }
}

// Navegação (troca de página / recarregamento): tenta rede, cai para offline.html.
async function navigationFallback(request) {
  console.log(`[SW ${SW_VERSION}] navegação interceptada:`, request.url);
  try {
    // no-store é essencial aqui: sem isso, o navegador pode responder com uma
    // cópia em cache HTTP do index.html mesmo estando offline, e o app real
    // (main.tsx, @vite/client, etc.) tenta carregar e falha com tela em branco
    // em vez de cair no fallback abaixo.
    const response = await fetch(request, NO_HTTP_CACHE);
    console.log(`[SW ${SW_VERSION}] navegação respondida pela rede (você está online)`);
    return response;
  } catch (error) {
    console.log(`[SW ${SW_VERSION}] navegação falhou na rede, tentando offline.html em cache...`, error);
    const cache = await caches.open(STATIC_CACHE_NAME);
    const offlinePage = await cache.match(OFFLINE_URL);

    if (!offlinePage) {
      console.error(
        `[SW ${SW_VERSION}] offline.html NÃO estava pré-cacheado — verifique o evento install.`
      );
      return Response.error();
    }

    console.log(`[SW ${SW_VERSION}] servindo offline.html do cache`);
    return offlinePage;
  }
}

/* ------------------------------------------------------------------ */
/* Interceptação de requisições                                       */
/* ------------------------------------------------------------------ */

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Navegações de página (F5, digitar URL, etc.) — fallback offline.
  if (request.mode === "navigate") {
    event.respondWith(navigationFallback(request));
    return;
  }

  // POST/PUT/DELETE seguem normalmente para a rede, exceto mutações em
  // /spending-limits: essas precisam invalidar o cache do GET (Cache First)
  // para que a listagem não fique desatualizada após criar/excluir um limite.
  if (request.method !== "GET") {
    const mutationUrl = new URL(request.url);

    if (isSpendingLimitsMutation(mutationUrl, request.method)) {
      event.respondWith(
        invalidateCacheAndForward(request, [
          `${API_ORIGIN}/spending-limits`,
        ])
      );
    }

    return;
  }

  const url = new URL(request.url);

  if (url.origin !== API_ORIGIN) {
    return;
  }

  if (CACHE_FIRST_ROUTES.includes(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (NETWORK_FIRST_ROUTES.includes(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Demais rotas da API (ex.: /goals, /auth) não são interceptadas.
});

/* ------------------------------------------------------------------ */
/* Web Notifications                                                   */
/* ------------------------------------------------------------------ */

self.addEventListener("message", (event) => {
  if (event.data?.type !== "SHOW_SPENDING_LIMIT_NOTIFICATION") {
    return;
  }

  const title = event.data.title ?? "Alerta de limite de gastos";

  const options = {
    body:
      event.data.body ?? "Uma categoria está próxima do limite mensal.",
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: "spending-limit-alert",
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
