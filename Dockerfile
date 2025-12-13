# Usa una imagen base ligera de Python (adaptada a tu versión, 3.12 aquí)
FROM python:3.12-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /sb-agent

# Copia los archivos de configuración de dependencias y el proyecto
COPY requirements.txt .
COPY . .

# 1. Instala dependencias del sistema operativo (necesarias para 'scapy' y 'psutil')
#    Además, limpia el cache para que la imagen sea pequeña.
RUN apt-get update \
    && apt-get install -y net-tools iproute2 libpcap0.8 tcpdump util-linux \
    && rm -rf /var/lib/apt/lists/*

# 2. Configura e instala las dependencias de Python usando el entorno virtual
#    Creamos el venv y lo usamos inmediatamente para instalar
ENV VIRTUAL_ENV=/sb-agent/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Instala las dependencias Python
# psutil y scapy (si scapy no funciona con la versión slim, cambia la base a python:3.12-buster)
RUN pip install --no-cache-dir -r requirements.txt

# El agente necesita que el ID se mantenga. Docker usará un volume para esto.
# También expone el puerto de escucha (Inbound)
EXPOSE 9876

# Comando que se ejecuta al iniciar el contenedor
# Ejecuta el main.py usando el intérprete dentro del venv
CMD ["python3", "main.py"]