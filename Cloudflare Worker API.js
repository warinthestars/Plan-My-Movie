const URLSEARCH = URL_SEARCH;
const URLDETAILS = URL_DETAILS;

addEventListener("fetch", event => 
  event.respondWith(handleRequest(event.request))
);

async function handleRequest(req) {
  if (req.method === "OPTIONS") {
    return handleOptions(request)
  } else if (req.method === "POST") {
    return handlePost(request)
  } else if (req.method === "GET" || req.method == "HEAD") {
        var idkbro;
        try {
            const { url, method, headers } = req;
            const { pathname } = new URL(url);
            const body = await req.text();
            const urlForSearch = new URL(url);
            const urlAPI = decideAPIURL(url)
            const searchParams = new URLSearchParams(urlAPI);
            const urlCritera = decideAPICriteria(url);

            function decideAPIURL(url) {
                if (pathname == "/3/search/movie/") {
                    return new URL(URLSEARCH);
                }else if(pathname == "/3/movie/") {
                    const apiSearchParams = new URLSearchParams(urlForSearch.search);
                    const movieID = apiSearchParams.get("id");
                    return new URL(URLDETAILS + "/" + movieID);
                }else if(pathname == "/3/movie/credits/") {
                    const apiSearchParams = new URLSearchParams(urlForSearch.search);
                    const movieID = apiSearchParams.get("id");
                    return new URL(URLDETAILS + "/" + movieID + "/credits")
                }else{
                }
            };

            function decideAPICriteria(url) {
                if (pathname == "/3/search/movie/") {
                        const querySearchParam = new URLSearchParams(urlForSearch.search);
                        const myQuery = querySearchParam.get('query');
                        ([[API_KEY, "api_key"], [myQuery, "query"], ["en-US", "language"], ["false", "include-adult"], [10, "page_limit"]]).forEach(([value, key]) => {urlAPI.searchParams.append(key, value);}); 
                }else if(pathname == "/3/movie/") {
                        ([[API_KEY, "api_key"], ["en-US", "language"]]).forEach(([value, key]) => {urlAPI.searchParams.append(key, value);});
                }else if(pathname == "/3/movie/credits/") {
                        ([[API_KEY, "api_key"], ["en-US", "language"]]).forEach(([value, key]) => {urlAPI.searchParams.append(key, value);});
                }else{
                }
            };

            return fetch(urlAPI.href, {
                method,
                headers: {
                    'dataType':'jsonp',
                    'responseType':'application/jsonp'
                },
                body: method === "GET" ? undefined : body,
            })

        } catch (error) {
          console.error(error);

          return new Response(JSON.stringify(
            { message: "Something went wrong" }
            ), 
            { status: 500, }
          );
        }
  } else {
    return new Response(null, {
      status: 405,
      statusText: "Method Not Allowed",
    })
  }
}

// We support the GET, POST, HEAD, and OPTIONS methods from any origin,
// and accept the Content-Type header on requests. These headers must be
// present on all responses to all CORS requests. In practice, this means
// all responses to OPTIONS or POST requests.
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://dev.planmymovie.com",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

function handleOptions(request) {
  if (request.headers.get("Origin") !== null &&
    request.headers.get("Access-Control-Request-Method") !== null &&
    request.headers.get("Access-Control-Request-Headers") !== null) {
    // Handle CORS pre-flight request.
    return new Response(null, {
      headers: corsHeaders
    })
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        "Allow": "GET, HEAD, POST, OPTIONS",
      }
    })
  }
}

async function handlePost(request) {
  if (request.headers.get("Content-Type") !== "application/json") {
    return new Response(null, {
      status: 415,
      statusText: "Unsupported Media Type",
      headers: corsHeaders,
    })
  }

  // Detect parse failures by setting `json` to null.
  let json = await request.json().catch(e => null)
  if (json === null) {
    return new Response("JSON parse failure", {
      status: 400,
      statusText: "Bad Request",
      headers: corsHeaders,
    })
  }

  return new Response(JSON.stringify(json), {
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    }
  })
}