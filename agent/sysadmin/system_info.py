import platform
import psutil # Necesitarás instalarlo: pip install psutil
import socket
import os

def get_os_info():
    return {
        "system": platform.system(),
        "release": platform.release(),
        "version": platform.version(),
        "architecture": platform.machine(),
        "node": platform.node()
    }

def get_resources():
    # CPU
    cpu_percent = psutil.cpu_percent(interval=0.5)
    
    # RAM
    mem = psutil.virtual_memory()
    ram_info = {
        "total": mem.total,
        "available": mem.available,
        "percent": mem.percent
    }
    
    # DISK (Root)
    disk = psutil.disk_usage('/')
    disk_info = {
        "total": disk.total,
        "used": disk.used,
        "percent": disk.percent
    }

    return {
        "cpu_percent": cpu_percent,
        "ram": ram_info,
        "disk": disk_info
    }

def get_full_report():
    return {
        **get_os_info(),
        "resources": get_resources()
    }