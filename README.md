# DevOps Evaluación 1

API RESTful desarrollada en Node.js y Express para la gestión básica de tareas (To-Do List) en memoria. Este repositorio forma parte de la Evaluación Parcial N°1 del curso **DOY0101 - Ingeniería DevOps** en DuocUC, e implementa una estrategia de ramificación GitFlow junto con un pipeline de integración continua mediante GitHub Actions.

---

## Tabla de Contenidos

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Instalación y Configuración Local](#instalación-y-configuración-local)
4. [Endpoints de la API](#endpoints-de-la-api)
5. [Estrategia de Ramificación (GitFlow)](#estrategia-de-ramificación-gitflow)
6. [Convenciones del Repositorio](#convenciones-del-repositorio)
7. [Integración Continua (CI/CD)](#integración-continua-cicd)
8. [Estructura del Proyecto](#estructura-del-proyecto)
9. [Declaración de Uso de Inteligencia Artificial](#declaración-de-uso-de-inteligencia-artificial)

---

## Descripción del Proyecto

Este microservicio expone una API REST que permite gestionar una lista de tareas almacenadas en memoria. Fue seleccionado como base para el trabajo DevOps por su arquitectura simple y clara, lo que facilita demostrar los flujos de control de versiones, colaboración y automatización sin distracciones de infraestructura compleja.

---

## Stack Tecnológico

| Tecnología     | Versión | Rol                               |
| -------------- | ------- | --------------------------------- |
| Node.js        | v18+    | Runtime de JavaScript             |
| Express        | ^5.2.1  | Framework HTTP                    |
| GitHub         | -       | Repositorio remoto y colaboración |
| GitHub Actions | -       | Automatización CI/CD              |

---

## Instalación y Configuración Local

**Requisitos previos:** tener instalado Node.js v18 o superior y Git.

```bash
# 1. Clonar el repositorio
git clone https://github.com/joralbornoz/DevOps-Evaluacion_1.git

# 2. Acceder al directorio del proyecto
cd DevOps-Evaluacion_1

# 3. Instalar las dependencias
npm install

# 4. Levantar el servidor
npm start
```

El servidor quedará disponible en `http://localhost:3000`.

---

## Endpoints de la API

La aplicación maneja un arreglo local de tareas en memoria y expone las siguientes rutas:

| Método | Ruta                      | Descripción                                                                                                                              |
| ------ | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/tareas`                 | Retorna el listado completo de todas las tareas registradas.                                                                             |
| `GET`  | `/tareas/completadas`     | Filtra y retorna solo las tareas con `completado: true`.                                                                                 |
| `POST` | `/tareas`                 | Crea una nueva tarea. Requiere `{ "nombre": "string" }` en el body. El ID es autoincremental y el estado inicial es `completado: false`. |
| `PUT`  | `/tareas/completar-todas` | Marca todas las tareas existentes como `completado: true`.                                                                               |

### Ejemplo de uso (POST /tareas)

```bash
curl -X POST http://localhost:3000/tareas \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Estudiar GitFlow"}'
```

**Respuesta:**

```json
{
  "id": 1,
  "nombre": "Estudiar GitFlow",
  "completado": false
}
```

---

## Estrategia de Ramificación (GitFlow)

Se implementó **GitFlow** como estrategia de ramificación. Esta elección se justifica porque el proyecto tiene ciclos de desarrollo claros con features y hotfixes separados, lo que se alinea perfectamente con el modelo de ramas de GitFlow y permite mantener `main` siempre estable y lista para producción.

### Estructura de ramas

| Rama               | Propósito                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `main`             | Código estable y listo para producción. Solo recibe merges vía Pull Request desde `develop` o `hotfix/*`. |
| `develop`          | Rama de integración continua. Las features se integran aquí antes de llegar a `main`.                     |
| `feature/<nombre>` | Desarrollo de nuevas funcionalidades. Se crean desde `develop` y se fusionan de vuelta a `develop`.       |
| `hotfix/<nombre>`  | Correcciones urgentes en producción. Se crean desde `main` y se fusionan tanto a `main` como a `develop`. |

### Diagrama de flujo

```
main ─────────────────────────────────────────────► (producción)
  │                                     ▲
  │ (se crea hotfix)            (merge PR)
  ▼                                     │
hotfix/fix-endpoint ──────────────────►─┘

develop ──────────────────────────────────────────► (integración)
  │               ▲         ▲
  │           (merge)   (merge)
  ▼               │         │
feature/completadas        feature/completar-todas
```

### Flujo de trabajo colaborativo simulado

**Features integradas:**

1. **`feature/get-completadas`** — Implementación del endpoint `GET /tareas/completadas` que filtra tareas por estado. Se trabajó en rama separada, se realizó Pull Request a `develop`, se revisó el código y se fusionó.

2. **`feature/put-completar-todas`** — Implementación del endpoint `PUT /tareas/completar-todas` para marcar todas las tareas como completadas. Mismo flujo de PR y revisión.

**Hotfix integrado:**

1. **`hotfix/fix-order-listen`** — Corrección del orden de declaración del listener `app.listen()` en `app.js`, que estaba ubicado antes de la declaración del endpoint PUT, lo que podía causar comportamiento inesperado. Se creó desde `main`, se fusionó a `main` y a `develop`.

---

## Convenciones del Repositorio

### Naming de ramas

```
feature/<descripcion-corta-en-kebab-case>   # nueva funcionalidad
hotfix/<descripcion-corta-en-kebab-case>    # corrección urgente
release/<version>                           # preparación de versión
```

**Ejemplos válidos:**

- `feature/get-completadas`
- `feature/validacion-input`
- `hotfix/fix-id-autoincremental`

### Mensajes de commit

Se sigue la convención [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>: <descripción breve en imperativo>
```

| Tipo       | Cuándo usarlo                                         |
| ---------- | ----------------------------------------------------- |
| `feat`     | Nueva funcionalidad                                   |
| `fix`      | Corrección de bug                                     |
| `docs`     | Cambios solo en documentación                         |
| `refactor` | Refactorización sin cambio de comportamiento          |
| `chore`    | Tareas de mantenimiento (dependencias, configuración) |
| `ci`       | Cambios en el pipeline de CI/CD                       |

**Ejemplos válidos:**

```
feat: add GET /tareas/completadas endpoint
fix: correct app.listen placement in app.js
docs: add branching strategy to README
ci: configure GitHub Actions workflow triggers
chore: add .gitignore for node_modules and env files
```

### Estrategia de merge y revisión

- Toda integración a `develop` y `main` se realiza **únicamente mediante Pull Request**.
- Los Pull Requests deben incluir una descripción clara del cambio realizado.
- Se requiere al menos **una revisión** antes de aprobar el merge.
- Se prefiere el uso de **Squash Merge** para mantener el historial de `develop` limpio.
- Nunca se hace push directo a `main`.

### Estructura de carpetas

```
DevOps-Evaluacion_1/
├── .github/
│   └── workflows/
│       └── ci.yml          # Pipeline de GitHub Actions
├── app.js                  # Lógica principal del servidor Express
├── package.json            # Dependencias y scripts
├── package-lock.json       # Lock de versiones exactas
├── .gitignore              # Archivos excluidos del repositorio
└── README.md               # Esta documentación
```

### Control de versiones

- El archivo `package-lock.json` **sí se versiona** para garantizar builds reproducibles.
- El directorio `node_modules/` está excluido mediante `.gitignore`.
- Los archivos `.env` con variables de entorno sensibles **nunca se versionan**.

---

## Integración Continua (CI/CD)

El repositorio cuenta con un workflow configurado en GitHub Actions ubicado en `.github/workflows/ci.yml`.

### Triggers del pipeline

El pipeline se ejecuta automáticamente ante dos eventos:

- **`push` a la rama `develop`** — Verifica que los cambios integrados no rompan el build.
- **`pull_request` hacia `main`** — Valida que el código esté listo antes de fusionarse a producción.

### Jobs y pasos

```yaml
on:
  push:
    branches: [develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout código
        uses: actions/checkout@v3

      - name: Instalar dependencias
        run: npm install

      - name: Validación
        run: echo "Pipeline OK"
```

| Paso                  | Acción                | Descripción                                                       |
| --------------------- | --------------------- | ----------------------------------------------------------------- |
| Checkout código       | `actions/checkout@v3` | Descarga el código del repositorio en el runner                   |
| Instalar dependencias | `npm install`         | Instala Express y demás dependencias declaradas en `package.json` |
| Validación            | `echo "Pipeline OK"`  | Confirma que el pipeline se ejecutó correctamente end-to-end      |

### Rol del pipeline en CI/CD

Este workflow implementa la fase de **Integración Continua (CI)**: cada vez que un desarrollador integra código, el sistema verifica automáticamente que las dependencias instalen sin errores y que el proyecto esté en condiciones de ser ejecutado. En una evolución futura del pipeline (fase CD), se agregarían pasos de testing automatizado y despliegue a un entorno cloud.

---

## Declaración de Uso de Inteligencia Artificial

En conformidad con las políticas de uso ético de IA establecidas por DuocUC, se declara que durante el desarrollo de esta evaluación se utilizaron herramientas de Inteligencia Artificial (LLMs) como apoyo en las siguientes áreas:

- **Estructuración y redacción de documentación:** Apoyo para organizar y mejorar la redacción del archivo `README.md` en base al código fuente ya construido por el equipo.
- **Flujo de control de versiones:** Asistencia técnica para comprender y ejecutar correctamente comandos de Git, gestión de Pull Requests y resolución de conflictos de merge.
- **Revisión de código:** Verificación de sintaxis y buenas prácticas en la implementación de los endpoints en Node.js y Express.

> **Nota:** Todo el código, los flujos de trabajo y la configuración del pipeline fueron revisados, comprendidos, probados y ejecutados manualmente por el equipo. Las justificaciones técnicas, conclusiones y reflexiones individuales son de autoría propia y no fueron generadas por IA, en cumplimiento de las restricciones establecidas en la pauta de evaluación.

Referencia de citación IA: [https://bibliotecas.duoc.cl/ia](https://bibliotecas.duoc.cl/ia)

---

## Conclusiones y Reflexiones

> Las siguientes reflexiones son de autoría personal de cada integrante y fueron redactadas sin apoyo de inteligencia artificial, en cumplimiento de los requisitos de la evaluación.

### Jorge

Durante la evaluación me tocó armar la base del microservicio y dejar funcionando lo principal. También hice una funcionalidad para completar todas las tareas y corregí un error con los IDs usando un hotfix.

Al principio me confundía con las ramas, sobre todo con main y develop, pero con la práctica fui entendiendo mejor cómo ordenar el trabajo.

Lo que más aprendí fue usar Pull Request, porque no es solo subir cambios, sino revisarlos y hacer merge de forma ordenada. También tuve que coordinarme con Abraham para no chocar con los cambios y mantener todo actualizado.

En general, me ayudó bastante a entender cómo trabajar en equipo con Git y hacerlo de forma más ordenada.

### Abraham

En este proyecto mi aporte principal fue implementar el filtro de tareas completadas y gestionar todo el flujo desde la rama feature hasta el Pull Request. También me encargué de documentar el proyecto en el README.

Lo que más me costó fue la sincronización con Jorge, especialmente cuando tuve que fusionar los cambios de develop en mi rama local para no perder su trabajo. Ahí entendí en la práctica para qué sirve realmente tener ramas separadas.

Me quedé con que el código en sí es la parte más corta del proceso. Todo lo que rodea a ese código, el control de versiones, las revisiones, la automatización, es lo que hace que un proyecto pueda escalar y mantenerse en equipo.
