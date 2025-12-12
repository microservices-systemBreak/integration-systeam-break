# main.py
import sys
import os

# Asegurar que Python encuentre el paquete 'agent' si ejecutamos desde fuera
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agent.core import start

if __name__ == "__main__":
    try:
        start()
    except KeyboardInterrupt:
        print("\n[STOP] Agent stopping by user request.")