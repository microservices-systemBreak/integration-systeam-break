from scapy.all import sniff, IP, TCP
from collections import defaultdict
import time
import threading
from agent.utils import get_logger

logger = get_logger("SECURITY-IDS")

# ... (código de variables y configuración igual que antes) ...

def packet_callback(packet):
    if packet.haslayer(IP) and packet.haslayer(TCP):
        if packet[TCP].flags == 'S':
            src_ip = packet[IP].src
            now = time.time()
            syn_tracker[src_ip] = [t for t in syn_tracker[src_ip] if t > now - TIME_WINDOW]
            syn_tracker[src_ip].append(now)
            
            if len(syn_tracker[src_ip]) > THRESHOLD_SYN:
                # CAMBIO IMPORTANTE: Logueamos como WARNING
                logger.warning(f"PORT SCAN DETECTED from IP: {src_ip}")
                
                syn_tracker[src_ip] = []

def start_ids_daemon(interface=None):
    logger.info(f"Starting packet sniffer on {interface or 'default interface'}")
    try:
        sniff(filter="tcp", prn=packet_callback, store=0, iface=interface)
    except Exception as e:
        logger.error(f"IDS Sniffing failed (Root privileges required?): {e}")

def start():
    t = threading.Thread(target=start_ids_daemon, daemon=True)
    t.start()