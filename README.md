# sb-agent
📄 README.md: Agente de Seguridad (sb-agent)💻 1. Visión GeneralEl sb-agent es un agente de seguridad ligero basado en Python, diseñado para operar en la modalidad "Pull" (servidor REST) dentro de un contenedor Docker. Su función principal es servir como sensor y ejecutor de comandos del sistema para el microservicio de orquestación central (sb-core-orchestrator).🎯 Responsabilidades ClaveRecolección de Inventario: Proporcionar la lista de paquetes instalados en el sistema host para su análisis de vulnerabilidades.Monitoreo de Estado: Informar el estado de recursos en tiempo real (CPU, RAM) para actualizar el estado del endpoint (endpoints_state).Detección de Intrusiones (IDS): Monitorear el tráfico de red local para detectar patrones de ataques o escaneo de puertos.Ejecución Remota: Actuar como un ejecutor de comandos (a través de la API) para tareas como aplicar parches de seguridad.🏗️ 2. Arquitectura (Modelo Inverso/Pull)A diferencia de un Heartbeat tradicional, el sb-agent opera como un servidor HTTP/REST que espera solicitudes del sb-core-orchestrator.ServicioRolComunicaciónsb-agent (Este Repo)Servidor HTTP (Esclavo)Escucha en el Puerto 9876 y responde a peticiones.sb-core-orchestratorCliente HTTP (Maestro)Llama al Agente para solicitar paquetes o estado.🚀 3. Endpoints Expuestos (API)El agente expone la siguiente API para el consumo del Orquestador C# (FastAPI):MétodoEndpointPropósitoFormato de RespuestaGET/agent/packagesUsado para el flujo de escaneo. Recolecta el listado completo de paquetes instalados.JSON (compatible con POST /analyze/packages)GET/agent/statusUsado para actualizar el estado del endpoint (online/RAM/CPU/OS).JSON (datos de recursos en tiempo real)Formato de Respuesta para /agent/packagesEl JSON devuelto coincide con el Request esperado por el sb-vuln-analyzer:JSON{
  "agentId": "uuid-del-agente",
  "packages": [
    {
      "name": "openssl",
      "version": "1.1.1l"
    },
    {
      "name": "python3",
      "version": "3.10.12-1"
    }
  ]
}
⚙️ 4. Configuración del EntornoDependenciasEl agente requiere las siguientes dependencias principales:Python 3.10+Uvicorn (Servidor ASGI)FastAPI (Framework API)Scapy (Módulo para el IDS)Instale las dependencias desde requirements.txt:Bashpip install -r requirements.txt
Variables de ConfiguraciónEl archivo agent/config.py maneja la configuración esencial:VariableUsoNotasAGENT_IDIdentificador único persistente.Se lee de data/agent_id.lic.PORTPuerto de escucha de la API (por defecto: 9876).Debe coincidir con la configuración AgentBaseUrl del Orquestador.SERVER_URLURL del servidor central.(Legacy) No utilizada en el modo API Pull actual.📦 5. Despliegue con Docker ComposeEl método de despliegue preferido es Docker Compose, que asegura el aislamiento y la portabilidad.RequisitosPara el despliegue de este agente, es crucial que el contenedor utilice el modo de red del host para permitir que el IDS (scapy) capture el tráfico real y para que el Agente escuche en el puerto 9876 del host.YAML# Fragmento docker-compose.yml
sb-agent-service:
  build: .
  # ...
  network_mode: "host" 
  cap_add:
    - NET_ADMIN # Requerido para Scapy y la detección de red.
Comandos de DespliegueConstruir y Ejecutar (Primer Despliegue):Bashdocker-compose up --build -d
Verificar Logs:Bashdocker-compose logs -f sb-agent-service
(Busque el mensaje: Uvicorn running on http://0.0.0.0:9876)Detener:Bashdocker-compose down
🧪 6. Pruebas Funcionales (CURL)Una vez que el contenedor esté activo, verifique la funcionalidad de los endpoints llamándolos desde su terminal:A. Prueba de Estado (RAM/CPU)Bashcurl http://localhost:9876/agent/status
B. Prueba de Inventario (Paquetes)Bashcurl http://localhost:9876/agent/packages
⚠️ 7. Notas ImportantesAdvertencia de Scapy: Es normal ver el warning de Scapy (WARNING: Socket <scapy.arch.linux.L2ListenSocket...> failed with 'name 'syn_tracker' is not defined'.). Este warning es de bajo impacto y el IDS continúa operando.IDS en Segundo Plano: El módulo de IDS (start_ids_daemon) se ejecuta en un hilo secundario y no bloquea el servidor de API principal.Protocolo: La comunicación entre sb-core-orchestrator y sb-agent es puramente HTTP; no se utiliza RabbitMQ ni sockets binarios.
