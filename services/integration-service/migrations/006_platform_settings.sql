-- Migration 006: Tabela Central de Configurações do Focussdev
CREATE TABLE IF NOT EXISTS platform_settings (
  category VARCHAR(64) PRIMARY KEY,
  settings JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed das configurações padrão
INSERT INTO platform_settings (category, settings)
VALUES
  ('geral', '{
    "empresa_nome": "Focussdev Serviços de Tecnologia LTDA",
    "nome_fantasia": "Focussdev",
    "cnpj": "14.829.102/0001-44",
    "email_contato": "contato@focussdev.com.br",
    "telefone": "+55 (11) 98765-4321",
    "idioma": "pt-BR",
    "fuso_horario": "America/Sao_Paulo (UTC-3)",
    "tema_padrao": "dark"
  }'),
  ('crm', '{
    "upstream_url": "https://crm.focussdev.space",
    "waha_conectado": true,
    "silencio_humano_ativo": true,
    "tempo_limite_primeira_resposta_min": 15,
    "funis_ativos": ["Novos Projetos SaaS", "Manutenção & MRR", "Parcerias"]
  }'),
  ('projetos', '{
    "upstream_url": "https://projetos.focussdev.space",
    "sprint_padrao_dias": 14,
    "prioridade_padrao": "medium",
    "notificar_atrasos": true
  }'),
  ('financeiro', '{
    "upstream_url": "https://erp.focussdev.space",
    "chave_pix": "contato@focussdev.com.br",
    "banco_padrao": "Banco Inter PJ",
    "dias_cobranca_antecipada": 3,
    "juros_mora_percentual": 1.0
  }'),
  ('documentos', '{
    "upstream_url": "https://docs.focussdev.space",
    "validade_padrao_proposta_dias": 10,
    "requerer_carimbo_tempo": true
  }'),
  ('suporte', '{
    "upstream_url": "https://suporte.focussdev.space",
    "sla_urgente_min": 15,
    "sla_padrao_horas": 4,
    "encaminhamento_automatico": true
  }')
ON CONFLICT (category) DO UPDATE
SET settings = EXCLUDED.settings, updated_at = NOW();
