# CHECKPOINT 11 — BLOQUEADO: Estrutura de Volumes

**Data:** 2026-09-20 19:35  
**Status:** ⏸️ BLOQUEADO por estrutura de diretórios esperada  
**Próximo:** Simplificar docker-composes ou criar TODOS os diretórios

---

## O Problema

Os docker-composes criados pelo Codex usam **bind-mounts específicos** esperando uma estrutura rígida:

```
AureusERP espera:
  /var/data/focussdev/aureusrp/sites/
  /var/data/focussdev/aureusrp/postgres/
  /var/data/focussdev/aureusrp/redis/
  /var/logs/focussdev/aureusrp/

Documenso espera:
  /var/data/focussdev/documenso/postgres/
  /var/data/focussdev/documenso/data/
  /var/data/focussdev/documenso/uploads/

... E assim por diante para as 6 stacks
```

**CADA FALTA DE DIRETÓRIO causa erro e o container falha.**

---

## Soluções

### OPÇÃO A: Criar TODOS os diretórios (Mais seguro)

```bash
ssh root@72.62.138.208

# TODOS os diretórios necessários
mkdir -p /var/logs/focussdev/{aureusrp,documenso,plane,forgejo,bookstack,freescout}
mkdir -p /var/data/focussdev/{aureusrp,documenso,plane,forgejo,bookstack,freescout}/{sites,postgres,redis,mysql,data,logs,uploads}
chmod -R 700 /var/data/focussdev /var/logs/focussdev/

# Depois tenta deploy
cd /opt/focussdev/stacks/aureusrp
docker compose -f docker-compose.yml up -d
```

### OPÇÃO B: Simplificar docker-composes (Mais rápido)

Remover os bind-mounts específicos e deixar Docker criar volumes nomeados:

Trocar:
```yaml
volumes:
  - /var/data/focussdev/aureusrp/sites:/home/frappe/frappe-bench/sites
```

Por:
```yaml
volumes:
  - aureusrp-data:/home/frappe/frappe-bench/sites
```

Depois:
```yaml
volumes:
  aureusrp-data:
    driver: local
```

---

## Recomendação

**OPÇÃO B é melhor** porque:
✅ Volumes Docker nomeados são mais portáveis  
✅ Docker gerencia os diretórios automaticamente  
✅ Menos chance de erro de permissões  
✅ Facilita backup/restore

Mas demanda **editar 6 docker-composes** (30 min de trabalho manual)

---

## Próximas Ações

**Você quer que eu:**

1. **OPÇÃO A:** Criar TODOS os diretórios na VPS agora → tenta deploy (5 min)
2. **OPÇÃO B:** Editar os 6 docker-composes para usar volumes Docker nomeados (30 min)
3. **OPÇÃO C:** Esperar você usar a VPS manualmente para criar os diretórios

---

**Responde:** A, B ou C? 👇
