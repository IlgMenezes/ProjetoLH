// Inicializa o Application Insights
(function () {
  var instrumentationKey = "8feca599-867f-4f81-8656-20408abb74a3"; // Substitua pela sua Instrumentation Key
  var appInsights = window.appInsights || function (config) {
      function r(config) {
          t[config] = function () {
              var i = arguments;
              t.queue.push(function () {
                  t[config].apply(t, i);
              });
          };
      }
      var t = { config: config },
          u = document,
          e = window,
          o = "script",
          s = u.createElement(o),
          i,
          f;
      for (
          s.src = config.url || "https://js.monitor.azure.com/scripts/b/ai.2.min.js",
              u.getElementsByTagName(o)[0].parentNode.appendChild(s),
              t.queue = [],
              f = [
                  "trackEvent",
                  "trackPageView",
                  "trackException",
                  "trackTrace",
                  "trackDependencyData",
                  "setAuthenticatedUserContext",
                  "clearAuthenticatedUserContext",
                  "startTrackPage",
                  "stopTrackPage",
                  "flush",
              ],
              i = 0;
          i < f.length;
          i++
      )
          r(f[i]);
      return t;
  }({
      instrumentationKey: instrumentationKey,
  });
  window.appInsights = appInsights;
})();

// Define funções globais para logging de erros

/**
* Loga um erro no Application Insights.
* @param {Error} error - O erro a ser logado.
* @param {Object} additionalInfo - Informações adicionais para contexto.
*/
window.logErrorToInsights = function (error, additionalInfo = {}) {
  if (window.appInsights) {
      appInsights.trackException({
          exception: error,
          severityLevel: 3, // 0 = Verbose, 3 = Warning, 4 = Error
          properties: additionalInfo,
      });
  } else {
      console.error("Application Insights não está configurado corretamente.");
  }
};

/**
* Loga um erro em um serviço backend, como Azure Functions.
* @param {Error} error - O erro a ser enviado.
*/
window.logErrorToAzure = function (error) {
  console.error("Logging to Azure:", error);
  // Aqui você pode integrar com um backend para armazenar os logs.
  // Por exemplo:
  // fetch('/api/LogFrontEndErrors', {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //         message: error.message || 'Erro desconhecido',
  //         stack: error.stack || 'Sem stack disponível',
  //         url: window.location.href
  //     })
  // }).catch(err => console.error("Erro ao enviar log para o backend:", err));
};

/**
* Captura erros globais no navegador.
*/
window.onerror = function (message, source, lineno, colno, error) {
  logErrorToInsights(error || { message, source, lineno, colno }, {
      message,
      source,
      lineno,
      colno,
      url: window.location.href,
  });

  logErrorToAzure(error || { message, source, lineno, colno });

  console.error("Erro capturado globalmente:", message, source, lineno, colno, error);
};

/**
* Captura erros não tratados em Promises.
*/
window.addEventListener("unhandledrejection", function (event) {
  logErrorToInsights(event.reason || new Error("Rejeição de Promise não tratada"), {
      url: window.location.href,
  });

  logErrorToAzure(event.reason || new Error("Rejeição de Promise não tratada"));

  console.error("Rejeição de Promise não tratada:", event.reason);
});
