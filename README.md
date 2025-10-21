# MaxWare

Este proyecto corresponde al desarrollo de una página web para una tienda rural.
Fue realizado como parte del curso **Gestión de proyectos de Software - Univalle Yumbo**

---

## Tecnologías Usadas
- **Frontend:** React
- **Backend:** Node.js (Express)
- **Bases de Datos:** PostgreSQL (gestionada con PgAdmin4)
- **Control de versiones:** Git y Github


---


## Requisitos previos

Antes de clonar el proyecto, asegurate de tener lo siguiente:
- Node.js y npm instalados → [https://nodejs.org/](https://nodejs.org/)
- PostgreSQL y pgadmin4 configurados
- Git instalado → [https://git-scm.com/](https://git-scm.com/)


---


## Instalación del proyecto


1. Clonar el repositorio
    ```bash
    git clone <URL-del-repositorio>
    cd <nombre-de-la-carpeta>

2. Instalar dependencias (Frontend)
    ´´´bash
    cd frontend
    npm install axios react-router-dom

3. Instalar dependencias (Backend)
    ´´´bash
    cd ../backend
    npm install

## Configuración de base de datos

1. Abre pgadmin4

2. Crea la base de datos maxware_db

3. Crea un archivo .env dentro de la carpeta backend con tus credenciales
    ´´´bash
    PORT=5000
    PGHOST=localhost
    PGUSER=postgres
    PGPASSWORD=tu_contraseña
    PGDATABASE=maxware_db
    PGPORT=5432

4. Desde la carpeta backend ejecuta
    ´´´bash
    npm start o node index.js
