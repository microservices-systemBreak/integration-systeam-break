#!/bin/bash
# Este script está diseñado para ejecutar el apagado del sistema Host.
echo "Ejecutando shutdown en el Host..." >> /tmp/host_shutdown.log
/sbin/shutdown -h now &
# Dormimos un momento para que el shell principal tenga tiempo de salir
sleep 1