import os
import subprocess
import shlex

# ----------- POWER MANAGEMENT -------------
def shutdown(args=None):
    print("[EXECUTOR] Shutting down system using os.system('/sbin/poweroff')...")
    
    # Usamos la ruta absoluta del binario 'poweroff' para máxima compatibilidad
    os.system("/sbin/shutdown -h now &") # Usando el comando shutdown en lugar de poweroff
    
    return True

# ----------- SYSTEM UPDATES ----------------
def update_system(args=None):
    try:
        # shell=True es necesario para && o wildcards, pero aquí son comandos fijos
        # Dividimos en dos llamadas para evitar shell=True si es posible, 
        # o usamos && con shell=True pero SIN variables externas.
        cmd = "sudo apt update -y && sudo apt upgrade -y"
        subprocess.run(cmd, shell=True, check=True)
        print("[EXECUTOR] Update completed")
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Update failed: {e}")

# ----------- MULTIMEDIA --------------------
def show_video(args):
    path = args.get("path")
    if not path or not os.path.exists(path):
        print(f"[ERROR] Video path not found: {path}")
        return

    env = os.environ.copy()
    env["DISPLAY"] = ":0"
    
    # Intento básico de obtener XAUTHORITY (Mejorable)
    if "XAUTHORITY" not in env:
        uid = os.getuid()
        env["XAUTHORITY"] = f"/run/user/{uid}/gdm/Xauthority"

    try:
        # shlex.split no es necesario si pasamos lista, pero path debe ser un solo argumento
        print(f"[EXECUTOR] Opening video: {path}")
        subprocess.Popen(["xdg-open", path], env=env)
    except Exception as e:
        print(f"[ERROR] Could not open video: {e}")

def change_wallpaper(args):
    path = args.get("path")
    if not path: return
    
    # Ejemplo para GNOME. Para otros entornos (KDE, XFCE) el comando cambia.
    cmd = [
        "gsettings", "set", "org.gnome.desktop.background", 
        "picture-uri", f"file://{path}"
    ]
    try:
        subprocess.run(cmd, check=True)
        print(f"[EXECUTOR] Wallpaper changed to {path}")
    except Exception as e:
        print(f"[ERROR] Failed to set wallpaper: {e}")