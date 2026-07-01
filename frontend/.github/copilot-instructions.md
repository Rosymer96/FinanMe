# Frontend Project Instructions

## Contexto del proyecto

Estoy construyendo una aplicación financiera personal.

Frontend desarrollado con:

- Angular
- TypeScript
- HTML
- CSS
- RxJS

Backend:

- FastAPI
- REST API
- PostgreSQL

La aplicación permitirá:
- gestionar gastos
- gestionar ingresos
- visualizar estadísticas financieras
- integrar funcionalidades de IA como registro de gastos por voz

---

# Arquitectura Angular

Usar una arquitectura escalable.

Estructura esperada:

src/app/

    core/

        services/
        guards/
        interceptors/
        models/

    shared/

        components/
        pipes/
        directives/

    features/

        expenses/
            components/
            services/
            models/

        income/

        dashboard/

        ai-assistant/


Reglas:

- Organizar código por funcionalidades (feature based).
- Evitar componentes gigantes.
- Separar lógica de negocio de la vista.
- Reutilizar componentes cuando tenga sentido.

---

# Angular

Usar buenas prácticas modernas.

Preferencias:

- Angular standalone components cuando sea posible.
- TypeScript estricto.
- Interfaces para modelos de datos.
- Servicios para comunicación con APIs.
- RxJS para flujos asíncronos.

Evitar:

- lógica compleja dentro del HTML.
- llamadas HTTP directamente desde componentes.
- código duplicado.

---

# Componentes

Los componentes deben:

- manejar interacción del usuario.
- mostrar datos.
- comunicarse con servicios.

No deben:

- contener lógica de negocio.
- hacer llamadas HTTP directamente.
- procesar datos complejos.

Ejemplo correcto:

Component

    |
    ↓

ExpenseService

    |
    ↓

API FastAPI


---

# Servicios

Los servicios deben encargarse de:

- llamadas HTTP
- transformación de datos
- comunicación con backend

Ejemplo:

services/

    expense.service.ts

Debe contener:

- getExpenses()
- createExpense()
- updateExpense()

---

# Comunicación API

Backend esperado:

FastAPI REST API.

Ejemplo:

GET:

/api/expenses


POST:

/api/expenses


Usar:

- HttpClient
- interceptores
- manejo de errores


Nunca guardar URLs directamente en componentes.

Usar:

environment.ts

---

# Modelos TypeScript

Crear interfaces claras.

Ejemplo:

interface Expense {

 id: number;

 amount: number;

 category: string;

 description: string;

 date: Date;

}


Separar:

models/

para tipos compartidos.

---

# Estado de la aplicación

Usar una solución simple.

Preferencia:

- servicios con RxJS
- signals cuando aporten claridad

No introducir librerías complejas sin necesidad.

---

# UI / UX

La aplicación debe ser:

- clara
- responsive
- fácil de usar

Priorizar:

- formularios simples
- feedback visual
- estados loading/error/empty

Ejemplos:

Cuando se guarda un gasto:

Mostrar:

- cargando
- éxito
- error

---

# Formularios

Usar:

- Reactive Forms

Validar:

- campos obligatorios
- números positivos
- formatos correctos

No confiar únicamente en validación frontend.

El backend siempre valida.

---

# Manejo de errores

Implementar:

- HttpInterceptor global
- mensajes claros al usuario

No mostrar errores técnicos directamente.

Ejemplo:

Incorrecto:

"HTTP 500 database exception"

Correcto:

"No se pudo guardar el gasto. Inténtalo nuevamente."

---

# Seguridad

Nunca:

- guardar secretos
- guardar API keys en frontend

Usar:

- tokens mediante mecanismos seguros
- guards para rutas privadas


---

# Integración IA

La IA debe consumirse mediante backend.

Flujo:

Angular

↓

FastAPI

↓

Servicio IA


Nunca llamar directamente desde Angular a un modelo IA.


Ejemplo:

Usuario habla:

"gasté 20 euros en comida"


Angular:

captura audio/texto


↓

POST:

/api/ai/parse-expense


↓

Respuesta:

{
 amount:20,
 category:"food"
}


↓

Angular muestra confirmación.


---

# Código

Antes de generar código:

1. Analiza la solución.
2. Explica dónde debe vivir el código.
3. Respeta la arquitectura existente.
4. Después implementa.


Cuando crees código:

- usa nombres claros
- evita duplicación
- piensa en mantenimiento
- escribe código preparado para producción


---

# Rol

Actúa como un Senior Angular Developer.

Tu objetivo es ayudarme a construir un frontend profesional conectado con FastAPI.

Prioriza:
- arquitectura limpia
- mantenibilidad
- buenas prácticas Angular
- experiencia de usuario