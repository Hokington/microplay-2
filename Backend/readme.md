# MicroPlay 2 Rest API

## Requisitos:

    - Python 3.x
    - pip

## Entorno virtual

    - python -m venv .venv
    - .venv\Scripts\activate

## Instala las dependencias

    - pip install -r requirements.txt

## Aplica las migraciones de la base de datos

    - py manage.py migrate

## Ejecuta el servidor

    - py manage.py runserver

    - http://127.0.0.1:8000/api/ para ver la API

    - Crear un superusuario

    - python manage.py createsuperuser


## Lista de Tareas

    1. Cambiar idioma del proyecto a Español en settings.py ✅
    2. Crear Modelo de Producto ✅
    3. Crear Modelo de Categorias ✅
    4. Crear Modelo de Carrito ✅
    5. Crear Modelo de Pedido ✅
    6. Crear Modelo de Pago ✅

    1. Crear Modelo de usuarios ✅
    
    Para la API REST
    1. Agregar middlewares
    2. Agregar todos los serializers


## Tareas para alguien mas jsj

    1. Seeding de la DB
    2. Revisar Base de datos y compararla
    3. Documentar Cambios del backend