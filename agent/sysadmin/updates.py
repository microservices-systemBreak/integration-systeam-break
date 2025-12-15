import subprocess

def check_available_updates():
    # 'apt list --upgradable' lista lo que se puede actualizar
    # Nota: Requiere haber ejecutado 'apt update' antes (lo hace el executor)
    cmd = "apt list --upgradable"
    try:
        # Check output, ignoramos stderr
        result = subprocess.check_output(cmd, shell=True, stderr=subprocess.DEVNULL).decode('utf-8')
        updates = []
        
        lines = result.splitlines()
        # La primera línea suele ser "Listing...", la saltamos
        for line in lines:
            if "/" in line and "upgradable" in line:
                # Formato aprox: "curl/stable 7.88.1-10 amd64 [upgradable from: ...]"
                parts = line.split("/")
                pkg_name = parts[0]
                updates.append(pkg_name)
                
        return updates # Lista de nombres de paquetes obsoletos
    except Exception as e:
        print(f"[ERROR] checking updates: {e}")
        return []