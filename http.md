# HTTP

    - Hyper Text Trasfer Protocol

## URL

    - Uniform Resource Locator

## URI

    - Uniform Resource Identifier

## URN

    - Uniform Resource Name

## what are http headers

    - HTTP headers are key-value pairs sent in HTTP requests and responses that provide essential information about the request or response, such as content type, length, encoding, and caching policies.

    - Request Headers = from client to server
    - response Headers = from server to client
    - representaion headers = encoding and compression of the body
    - paylod headers = metadata about the body

## Most common Header

1. Accept : application/json
2. User-agent
3. authorization
4. content-type
5. cookie
6. cache-control

## CORS - Cross-Origin Resource Sharing

1. Access-Control-Allow-Origin: \*
   - The wildcard (\*) allows all origins
2. Access-Control-Allow-Methods: GET, POST, PUT, DELETE
   - Specifies the allowed HTTP methods for cross-origin requests.
3. Access-Control-Allow-Credentials: true
   - Indicates whether credentials (cookies, HTTP authentication) are allowed in cross-origin requests.

## Security

1. Cross-Origin-Opener-Policy: same-origin
2. Cross-Origin-Embedder-Policy: require-corp
   - These headers help prevent cross-origin attacks by controlling how documents and resources can interact across origins.
3. Content-Security-Policy: default-src 'self'
   - This header defines a security policy that restricts the sources from which content can be loaded, helping to prevent XSS attacks.
4. X-XSS-Protection: 1; mode=block
   - This header enables the XSS filter in browsers to block pages that appear to be reflective XSS attacks.

## HTTP Methods

1. GET
   - Retrieve data from the server.
   - Safe and idempotent.
2. POST
   - Submit data to the server, often resulting in a change in state or side effects.
3. PUT
   - Update existing data or create a new resource at a specified URI.
   - Idempotent.
4. DELETE
   - Remove a resource from the server.
5. PATCH
   - Apply partial modifications to a resource.
6. HEAD
   - Retrieve metadata about a resource without the body.
7. OPTIONS
   - Describe the communication options for the target resource, often used for CORS preflight request.
8. TRACE
   - Echo back the received request, used for diagnostic purposes.

## HTTP Status Codes

1. 1xx - Informational
2. 2xx - Success
3. 3xx - Redirection
4. 4xx - Client Error
5. 5xx - Server Error

## Most common Status Code

      - 100 continue
      - 102 Processing
      - 200 OK
      - 201 Created
      - 202 Accepted
      - 204 No Content
      - 301 Moved Permanently
      - 302 Found
      - 307 Temporary Redirect
      - 308 Permanent Redirect
      - 400 Bad Request
      - 401 Unauthorized
      - 402 Payment Required
      - 403 Forbidden
      - 404 Not Found
      - 500 Internal Server Error
      - 504 Gateway Timeout
      - 540 Bad Gateway
