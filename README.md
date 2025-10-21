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
    ```bash
    cd frontend
    npm install axios react-router-dom


3. Instalar dependencias (Backend)
    ```bash
    cd ../backend
    npm install


## Configuración de base de datos

1. Abre pgadmin4

2. Crea la base de datos maxware_db y crea la tabla Productos
    ```bash
    CREATE TABLE Productos (
	id serial PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	precio DECIMAL (10 ,2) NOT NULL,
	descripcion TEXT,
	stock INT DEFAULT 0
    );


3. Crea un archivo .env dentro de la carpeta backend con tus credenciales
    ```bash
    PORT=4000
    PGHOST=localhost
    PGUSER=postgres
    PGPASSWORD=tu_contraseña
    PGDATABASE=maxware_db
    PGPORT=5432


4. Para iniciar el servidor, ejecuta esto dentro de la carpeta backend
    ```bash
    npm start o node index.js


5. Para ejecutar el cliente, ejecuta esto dentro de la carpeta frontend
    ```bash
    npm start


La aplicación se abrirá automaticamente en tu navegador en http://localhost:3000



## Desarrolladores
- **Project Leader:** Luis Eduardo Urbano Caicedo
- **Lead Developer:** Samuel Ospina Velásquez
- **UX/UI Designer:** Juan David Becerra Ussa
- **Quality Analyst:** Javier Mauricio Ortiz Millán
- **Developer**: Fabian Andres Camayo Pesas

## Notas
- Si hay errores de conexión, revisa las variables del archivo .env
- Recuerda ejecutar SIEMPRE el backend antes del frontend