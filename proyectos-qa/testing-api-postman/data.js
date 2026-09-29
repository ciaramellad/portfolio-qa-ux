// Datos completos del caso de estudio API Testing con Postman, extraídos íntegramente de portfolio-qa-ux.
const POSTMAN = {
  es: {
    title: "API Testing con Postman",
    subtitle: "Validación de API REST de E-commerce",
    certification: { title: "Certificación Postman Student Expert", image: "../../img/postman/Postman - Postman API Fundamentals Student Expert - 2026-02-21 (2).png" },
    description: "Este proyecto consiste en la validación de una API REST de e-commerce utilizando Postman. Las pruebas se enfocaron en analizar el comportamiento de distintos endpoints relacionados con productos y carritos de compra, verificando el correcto funcionamiento de las respuestas del servidor, la estructura de los datos y el manejo de errores.",
    objective: "Verificar el correcto funcionamiento de los endpoints de la API relacionados con productos y carritos de compra, validando códigos de respuesta HTTP, la estructura de los datos en formato JSON y el comportamiento del sistema ante escenarios positivos y negativos.",
    platform: "DummyJSON API mediante POSTMAN",
    endpoints: {
      title: "ENDPOINTS ANALIZADOS", idHeader: "Método",
      desc: "Se analizaron distintos endpoints de la API para asegurar el comportamiento esperado del sistema y la integridad de los datos dentro del flujo de e-commerce.",
      table: [
        { id: "GET", feature: "/products", scenario: "Obtener la lista de productos disponibles" },
        { id: "GET", feature: "/products/{id}", scenario: "Obtener la información de un producto específico por ID" },
        { id: "PUT", feature: "/products/{id}", scenario: "Actualizar la información de un producto existente" },
        { id: "POST", feature: "/carts/add", scenario: "Crear un carrito de compra con productos" },
        { id: "DELETE", feature: "/carts/{id}", scenario: "Eliminar un carrito de compra existente" }
      ]
    },
    scenarios: {
      title: "ESCENARIOS DE PRUEBA",
      table: [
        { id: "TS-001", scenario: "Verificar que la API devuelve correctamente la lista de productos" },
        { id: "TS-002", scenario: "Verificar que la API devuelve la información de un producto específico por ID" },
        { id: "TS-003", scenario: "Validar que la API permite actualizar la información de un producto" },
        { id: "TS-004", scenario: "Verificar que se puede crear un carrito con productos" },
        { id: "TS-005", scenario: "Verificar que la API devuelve la lista de carritos existentes" },
        { id: "TS-006", scenario: "Validar la eliminación de un carrito existente" },
        { id: "TS-007", scenario: "Verificar el comportamiento de la API al eliminar un carrito inexistente" }
      ]
    },
    casesIntro: {
      p1: "Se definieron diferentes casos de prueba ejecutados mediante Postman, utilizando métodos HTTP comunes en APIs REST como GET, POST, PUT y DELETE.",
      p2: "Cada test case verifica aspectos clave como códigos de respuesta HTTP, estructura de datos JSON y tiempos de respuesta. Hacé clic en una fila para ver la evidencia de ejecución."
    },
    cases: [
      { id: "TC-001", feature: "GET /products", scenario: "Obtener lista de productos", result: "Status code 200 OK - JSON de productos", status: "pass", evidence: "../../img/postman/tc-001-get-products.png" },
      { id: "TC-002", feature: "GET /products/1", scenario: "Obtener producto por ID", result: "Status 200 OK - Respuesta JSON - El campo ID = 1", status: "pass", evidence: "../../img/postman/tc-002-get-products-1.png" },
      { id: "TC-003", feature: "PUT /products/1", scenario: "Actualizar información de un producto", result: "Status 200 OK - La API devuelve el producto actualizado - El campo title tiene un nuevo valor", status: "pass", evidence: "../../img/postman/tc-003-put-update1.png" },
      { id: "TC-004", feature: "GET /products", scenario: "Validar que el endpoint responde dentro de un tiempo aceptable", result: "Status 200 OK - Tiempo de respuesta < 1000 ms", status: "pass", evidence: "../../img/postman/TC-004-response-time-products.png" },
      { id: "TC-005", feature: "POST /carts/add", scenario: "Crear un nuevo carrito con productos", result: "Status 200 OK - JSON con información de carrito - Presencia de campo id del carrito", status: "pass", evidence: "../../img/postman/tc-005-post-create-cart.png" },
      { id: "TC-006", feature: "DELETE /carts/1", scenario: "Eliminar carrito existente utilizando ID", result: "Status 200 OK - Respuesta JSON confirmación de eliminación", status: "pass", evidence: "../../img/postman/tc-006-delete-cart.png" },
      { id: "TC-007", feature: "DELETE /carts/9999", scenario: "Eliminar carrito inexistente (Negative Test)", result: "La API devuelve error o mensaje de que ese producto no existe", status: "fail", evidence: "../../img/postman/tc-007-delete-cart-negative.png" }
    ],
    automations: {
      title: "AUTOMATIZACIONES POSTMAN",
      desc: "Se añadieron validaciones automáticas en Postman para verificar automáticamente el status code, la estructura de la respuesta y el tiempo de respuesta.",
      items: [
        { title: "Status code", language: "JavaScript", code: "pm.test(\"Status code is 200\", function () {\n    pm.response.to.have.status(200);\n});", evidence: "../../img/postman/aut-status-code.png" },
        { title: "Validación de productos", language: "JavaScript", code: "pm.test(\"Products length is 5\", function () {\n    const response = pm.response.json();\n    pm.expect(response.products.length).to.eql(5);\n});", evidence: "../../img/postman/aut-limit-parameter.png" },
        { title: "Tiempo de respuesta", language: "JavaScript", code: "pm.test(\"Response time is less than 1000ms\", function () {\n    pm.expect(pm.response.responseTime).to.be.below(1000);\n});", evidence: "../../img/postman/aut-time-response.png" }
      ]
    },
    labels: {
      description: "DESCRIPCIÓN", objective: "OBJETIVO", platform: "PLATAFORMA",
      thId: "Método", thFeature: "Endpoint", thScenario: "Escenario", thResult: "Resultado", thStatus: "Estado",
      pass: "Pasa", fail: "Falla", evidence: "Ver evidencia", contact: "Contáctame", certification: "Certificación"
    }
  },
  en: {
    title: "API Testing with Postman",
    subtitle: "E-commerce REST API Validation",
    certification: { title: "Postman Student Expert Certification", image: "../../img/postman/Postman - Postman API Fundamentals Student Expert - 2026-02-21 (2).png" },
    description: "This project consists of the validation of an e-commerce REST API using Postman. The tests focused on analyzing the behavior of different endpoints related to products and shopping carts, verifying the correct functioning of server responses, data structure, and error handling.",
    objective: "Verify the correct functioning of the API endpoints related to products and shopping carts, validating HTTP response codes, the JSON data structure, and the system's behavior in positive and negative scenarios.",
    platform: "DummyJSON API via POSTMAN",
    endpoints: {
      title: "ENDPOINTS ANALYZED", idHeader: "HTTP",
      desc: "Different API endpoints were analyzed to ensure the expected behavior of the system and data integrity within the e-commerce flow.",
      table: [
        { id: "GET", feature: "/products", scenario: "Get the list of available products" },
        { id: "GET", feature: "/products/{id}", scenario: "Get information for a specific product by ID" },
        { id: "PUT", feature: "/products/{id}", scenario: "Update information for an existing product" },
        { id: "POST", feature: "/carts/add", scenario: "Create a shopping cart with products" },
        { id: "DELETE", feature: "/carts/{id}", scenario: "Delete an existing shopping cart" }
      ]
    },
    scenarios: {
      title: "TEST SCENARIOS",
      table: [
        { id: "TS-001", scenario: "Get product list" },
        { id: "TS-002", scenario: "Get product by valid ID" },
        { id: "TS-003", scenario: "Get product with non-existent ID" },
        { id: "TS-004", scenario: "Create cart with products" },
        { id: "TS-005", scenario: "Get list of carts" },
        { id: "TS-006", scenario: "Delete existing cart" },
        { id: "TS-007", scenario: "Verify API behavior when deleting a non-existent cart" }
      ]
    },
    casesIntro: {
      p1: "Different test cases were defined and executed using Postman, utilizing common HTTP methods in REST APIs such as GET, POST, PUT, and DELETE.",
      p2: "Each test case verifies key aspects such as HTTP response codes, JSON data structure, and response times. Click a row to see the execution evidence."
    },
    cases: [
      { id: "TC-001", feature: "GET /products", scenario: "Get product list", result: "Status code 200 OK - JSON of products", status: "pass", evidence: "../../img/postman/tc-001-get-products.png" },
      { id: "TC-002", feature: "GET /products/1", scenario: "Get product by ID", result: "Status 200 OK - JSON response - ID field = 1", status: "pass", evidence: "../../img/postman/tc-002-get-products-1.png" },
      { id: "TC-003", feature: "PUT /products/1", scenario: "Update product information", result: "Status 200 OK - API returns updated product - Title field has new value", status: "pass", evidence: "../../img/postman/tc-003-put-update1.png" },
      { id: "TC-004", feature: "GET /products", scenario: "Validate that the endpoint responds within an acceptable time", result: "Status 200 OK - Response time < 1000 ms", status: "pass", evidence: "../../img/postman/TC-004-response-time-products.png" },
      { id: "TC-005", feature: "POST /carts/add", scenario: "Create a new cart with products", result: "Status 200 OK - JSON with cart information - Presence of cart id field", status: "pass", evidence: "../../img/postman/tc-005-post-create-cart.png" },
      { id: "TC-006", feature: "DELETE /carts/1", scenario: "Delete existing cart using ID", result: "Status 200 OK - JSON response confirming deletion", status: "pass", evidence: "../../img/postman/tc-006-delete-cart.png" },
      { id: "TC-007", feature: "DELETE /carts/9999", scenario: "Delete non-existent cart (Negative Test)", result: "API returns error or message that the product does not exist", status: "fail", evidence: "../../img/postman/tc-007-delete-cart-negative.png" }
    ],
    automations: {
      title: "POSTMAN AUTOMATIONS",
      desc: "Automatic validations were added in Postman to automatically verify the status code, response structure, and response time.",
      items: [
        { title: "Status code", language: "JavaScript", code: "pm.test(\"Status code is 200\", function () {\n    pm.response.to.have.status(200);\n});", evidence: "../../img/postman/aut-status-code.png" },
        { title: "Product validation", language: "JavaScript", code: "pm.test(\"Products length is 5\", function () {\n    const response = pm.response.json();\n    pm.expect(response.products.length).to.eql(5);\n});", evidence: "../../img/postman/aut-limit-parameter.png" },
        { title: "Response time", language: "JavaScript", code: "pm.test(\"Response time is less than 1000ms\", function () {\n    pm.expect(pm.response.responseTime).to.be.below(1000);\n});", evidence: "../../img/postman/aut-time-response.png" }
      ]
    },
    labels: {
      description: "DESCRIPTION", objective: "OBJECTIVE", platform: "PLATFORM",
      thId: "Method", thFeature: "Endpoint", thScenario: "Scenario", thResult: "Result", thStatus: "Status",
      pass: "Pass", fail: "Fail", evidence: "View evidence", contact: "Contact me", certification: "Certification"
    }
  }
};
