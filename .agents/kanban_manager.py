#!/usr/bin/env python3
"""
Kanban Manager CLI - Gerenciador do Fluxo de Trabalho do Time de Agentes
"""

import sys
import re
from pathlib import Path

KANBAN_DIR = Path(__file__).parent.parent / ".kanban"
CARDS_DIR = KANBAN_DIR / "cards"
BOARD_FILE = KANBAN_DIR / "BOARD.md"

VALID_STATUSES = ["BACKLOG", "REFINEMENT", "READY", "IN_PROGRESS", "IN_REVIEW", "DONE"]

def list_cards():
    if not CARDS_DIR.exists():
        print("Diretório de cards não encontrado.")
        return
    cards = sorted(CARDS_DIR.glob("CARD-*.md"))
    print(f"\n📋 Total de {len(cards)} cards encontrados:")
    print("-" * 60)
    for card_path in cards:
        content = card_path.read_text(encoding="utf-8")
        status_match = re.search(r"\*\*Status\*\*:\s*`?([A-Z_]+)`?", content)
        title_match = re.search(r"^#\s*(CARD-\d+:\s*.+)$", content, re.MULTILINE)
        status = status_match.group(1) if status_match else "DESCONHECIDO"
        title = title_match.group(1) if title_match else card_path.name
        print(f"[{status.ljust(11)}] {title}")

def check_gate(card_id: str):
    card_files = list(CARDS_DIR.glob(f"{card_id}*.md"))
    if not card_files:
        print(f"Card {card_id} não encontrado.")
        return
    card_file = card_files[0]
    content = card_file.read_text(encoding="utf-8")
    print(f"\n🔍 Verificando Gates para {card_file.name}:")
    
    # Check gates
    po_gate = "Especificação do PO" in content
    sec_gate = "Requisitos de Segurança" in content or "SEC" in content
    ux_gate = "Especificação de UX/UI" in content or "UX" in content
    dev_dup = "Prevenção de Duplicação" in content or "ARCHITECTURE_MAP" in content
    
    print(f" - Gate PO (Critérios de Aceite): {'✅' if po_gate else '❌'}")
    print(f" - Gate SEC (Segurança & Firestore Rules): {'✅' if sec_gate else '❌'}")
    print(f" - Gate UX (Design & Responsividade): {'✅' if ux_gate else '❌'}")
    print(f" - Gate DEV (Prevenção de Duplicação): {'✅' if dev_dup else '❌'}")

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] == "list":
        list_cards()
    elif sys.argv[1] == "check" and len(sys.argv) > 2:
        check_gate(sys.argv[2])
    else:
        print("Uso: python3 kanban_manager.py [list | check <CARD-ID>]")

