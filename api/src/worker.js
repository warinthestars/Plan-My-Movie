const URLSEARCH = URL_SEARCH, URLDETAILS = URL_DETAILS;
const corsHeaders = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  }
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.method === "GET" || request.method == "HEAD") {
    let decideAPIURL2 = function(url2) {
      if (pathname == "/3/search/movie/") {
        return new URL(URLSEARCH);
      } else if (pathname == "/3/movie/") {
        const apiSearchParams = new URLSearchParams(urlForSearch.search);
        const movieID = apiSearchParams.get("id");
        return new URL(URLDETAILS + "/" + movieID);
      } else if (pathname == "/3/movie/credits/") {
        const apiSearchParams = new URLSearchParams(urlForSearch.search);
        const movieID = apiSearchParams.get("id");
        return new URL(URLDETAILS + "/" + movieID + "/credits");
      } else {}
    }, decideAPICriteria2 = function(url2) {
      if (pathname == "/3/search/movie/") {
        const querySearchParam = new URLSearchParams(urlForSearch.search);
        const myQuery = querySearchParam.get("query");
        [[API_KEY, "api_key"], [myQuery, "query"], ["en-US", "language"], ["false", "include-adult"], [10, "page_limit"]].forEach(([value, key]) => {
          urlAPI.searchParams.append(key, value);
        });
      } else if (pathname == "/3/movie/") {
        [[API_KEY, "api_key"], ["en-US", "language"]].forEach(([value, key]) => {
          urlAPI.searchParams.append(key, value);
        });
      } else if (pathname == "/3/movie/credits/") {
        [[API_KEY, "api_key"], ["en-US", "language"]].forEach(([value, key]) => {
          urlAPI.searchParams.append(key, value);
        });
      }
    }
    var decideAPIURL = decideAPIURL2, decideAPICriteria = decideAPICriteria2;
    const { url, method, headers } = await request;
    const { pathname } = new URL(url);
    const body = await request.text();
    const urlForSearch = new URL(url);
    const urlAPI = decideAPIURL2(url);
    const searchParams = new URLSearchParams(urlAPI);
    const urlCritera = decideAPICriteria2(url);

    const response = await fetch(urlAPI.href, corsHeaders);
    const results = await gatherResponse(response);
    return new Response(results, corsHeaders);
  }
}

async function gatherResponse(response) {
  const { headers } = response;
  const contentType = headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return JSON.stringify(await response.json());
  }
  return response.text();
}
