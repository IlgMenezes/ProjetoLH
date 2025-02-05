// Configurações globais para fallback e retentativas
const FALLBACK_URL = "https://fallbackfree.azurewebsites.net/";
const BASE_URL = "https://sghapi20230704112902.azurewebsites.net/";
const BASE_URL2 = "https://localhost:44349/";
const RETRY_COUNT = 2;

// Sobrescrevendo $.ajax
(function () {
    const originalAjax = $.ajax;

    $.ajax = function (options) {
        const retryCount = RETRY_COUNT;

        function makeRequest(url, retriesLeft) {
            return originalAjax({
                ...options,
                url: url,
                success: function (response) {
                    console.log("Request bem-sucedida!", response);
                    if (options.success) options.success(response);
                },
                error: function (error) {
                    console.error("Erro na request:", error);
                    if (retriesLeft > 0) {
                        console.warn(`Tentativa de fallback... Tentativas restantes: ${retriesLeft}`);
                        var fallbackUrl = url.replace(BASE_URL, FALLBACK_URL);
                        fallbackUrl = fallbackUrl.replace(BASE_URL2, FALLBACK_URL);
                        makeRequest(fallbackUrl, retriesLeft - 1);
                    } else {
                        console.error("Todas as tentativas falharam.");
                        if (options.error) options.error(error);
                    }
                }
            });
        }

        return makeRequest(options.url, retryCount);
    };
})();

// Sobrescrevendo fetch
(function () {
    const originalFetch = window.fetch;

    window.fetch = async function (input, init = {}) {
        const retryCount = RETRY_COUNT;

        async function makeRequest(url, retriesLeft) {
            try {
                const response = await originalFetch(url, init);
                if (!response.ok) throw new Error(`Erro: ${response.status}`);
                return response;
            } catch (error) {
                console.error("Erro na request fetch:", error);
                if (retriesLeft > 0) {
                    console.warn(`Tentativa de fallback... Tentativas restantes: ${retriesLeft}`);
                    var fallbackUrl = url.replace(BASE_URL, FALLBACK_URL);
                    fallbackUrl = fallbackUrl.replace(BASE_URL2, FALLBACK_URL);
                    return makeRequest(fallbackUrl, retriesLeft - 1);
                }
                throw error;
            }
        }

        return makeRequest(input, retryCount);
    };
})();
