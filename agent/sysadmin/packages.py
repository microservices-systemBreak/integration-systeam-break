import subprocess

def list_installed_packages():
    # Usamos dpkg-query para obtener una salida limpia: Nombre,Versión
    cmd = "dpkg-query -W -f='${binary:Package},${Version}\\n'"
    try:
        result = subprocess.check_output(cmd, shell=True).decode('utf-8')
        packages = []
        for line in result.splitlines():
            if "," in line:
                name, version = line.split(",", 1)
                packages.append({"name": name, "version": version})
        return packages # Retorna una lista enorme de dicts
    except Exception as e:
        print(f"[ERROR] listing packages: {e}")
        return []