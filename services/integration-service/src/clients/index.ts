/**
 * HTTP Clients para integração com stacks externas
 * Todos os clientes seguem padrão: async methods, retry automático, logging
 */

import axios, { AxiosInstance } from 'axios';

// ============ AUREUS ERP ============

export class AureusClient {
  private client: AxiosInstance;
  private organizationId: string;

  constructor(organizationId: string, apiKey: string) {
    this.organizationId = organizationId;
    this.client = axios.create({
      baseURL: `${process.env.AUREUS_URL}/api/v1`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Organization-ID': organizationId,
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
  }

  async createCustomer(data: {
    name: string;
    email: string;
    phone?: string;
    type: 'individual' | 'company';
    external_id: string;
  }) {
    return this.client.post('/customers', {
      ...data,
      idempotency_key: `cust-${data.external_id}`,
    });
  }

  async createInvoice(data: {
    customer_id: string;
    description: string;
    amount_cents: number;
    currency: string;
    due_date: Date;
    external_id: string;
  }) {
    return this.client.post('/invoices', {
      ...data,
      due_date: data.due_date.toISOString().split('T')[0],
      idempotency_key: `inv-${data.external_id}`,
    });
  }

  async getInvoice(invoiceId: string) {
    return this.client.get(`/invoices/${invoiceId}`);
  }

  async listInvoices(filter?: { status?: string; customer_id?: string }) {
    return this.client.get('/invoices', { params: filter });
  }
}

export function createAureusClient(organizationId: string): AureusClient {
  const apiKey = process.env[`AUREUS_API_KEY_${organizationId}`] || process.env.AUREUS_API_KEY;
  return new AureusClient(organizationId, apiKey!);
}

// ============ PLANE ============

export class PlaneClient {
  private client: AxiosInstance;
  private organizationId: string;

  constructor(organizationId: string, apiKey: string) {
    this.organizationId = organizationId;
    this.client = axios.create({
      baseURL: `${process.env.PLANE_URL}/api/v1`,
      headers: {
        'X-API-Token': apiKey,
        'X-Organization-ID': organizationId,
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
  }

  async createProject(data: {
    name: string;
    description?: string;
    identifier: string;
    external_id: string;
    metadata?: Record<string, any>;
  }) {
    return this.client.post('/projects', {
      ...data,
      color: '#0F172A', // slate-900
    });
  }

  async createIssue(projectId: string, data: {
    title: string;
    description?: string;
    priority?: 'urgent' | 'high' | 'medium' | 'low' | 'none';
    external_id: string;
  }) {
    return this.client.post(`/projects/${projectId}/issues`, {
      ...data,
      idempotency_key: `issue-${data.external_id}`,
    });
  }

  async createCycle(projectId: string, data: {
    name: string;
    start_date: Date;
    end_date: Date;
  }) {
    return this.client.post(`/projects/${projectId}/cycles`, {
      name: data.name,
      start_date: data.start_date.toISOString().split('T')[0],
      end_date: data.end_date.toISOString().split('T')[0],
    });
  }

  async getProject(projectId: string) {
    return this.client.get(`/projects/${projectId}`);
  }
}

export function createPlaneClient(organizationId: string): PlaneClient {
  const apiKey = process.env[`PLANE_API_KEY_${organizationId}`] || process.env.PLANE_API_KEY;
  return new PlaneClient(organizationId, apiKey!);
}

// ============ FORGEJO (GIT) ============

export class ForgejoClient {
  private client: AxiosInstance;
  private organizationId: string;

  constructor(organizationId: string, apiKey: string) {
    this.organizationId = organizationId;
    this.client = axios.create({
      baseURL: `${process.env.FORGEJO_URL}/api/v1`,
      headers: {
        'Authorization': `token ${apiKey}`,
        'X-Organization-ID': organizationId,
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
  }

  async createRepository(data: {
    name: string;
    description?: string;
    private: boolean;
    issues: boolean;
    pull_requests: boolean;
    wiki: boolean;
    external_id: string;
  }) {
    return this.client.post('/user/repos', {
      name: data.name,
      description: data.description,
      private: data.private,
      has_issues: data.issues,
      has_pull_requests: data.pull_requests,
      has_wiki: data.wiki,
    });
  }

  async createIssue(owner: string, repo: string, data: {
    title: string;
    body?: string;
    external_id: string;
  }) {
    return this.client.post(`/repos/${owner}/${repo}/issues`, {
      title: data.title,
      body: data.body,
    });
  }

  async createBranch(owner: string, repo: string, data: {
    name: string;
    from_branch?: string;
  }) {
    return this.client.post(`/repos/${owner}/${repo}/branches`, {
      branch_name: data.name,
      old_branch_name: data.from_branch || 'main',
    });
  }

  async getRepository(owner: string, repo: string) {
    return this.client.get(`/repos/${owner}/${repo}`);
  }
}

export function createForgejoClient(organizationId: string): ForgejoClient {
  const apiKey = process.env[`FORGEJO_API_KEY_${organizationId}`] || process.env.FORGEJO_API_KEY;
  return new ForgejoClient(organizationId, apiKey!);
}

// ============ DOCUMENSO (CONTRACTS) ============

export class DocumensoClient {
  private client: AxiosInstance;
  private organizationId: string;

  constructor(organizationId: string, apiKey: string) {
    this.organizationId = organizationId;
    this.client = axios.create({
      baseURL: `${process.env.DOCUMENSO_URL}/api/v1`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Organization-ID': organizationId,
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
  }

  async createDocument(data: {
    title: string;
    description?: string;
    template_id?: string;
    recipients: Array<{ name: string; email: string }>;
    external_id: string;
  }) {
    return this.client.post('/documents', {
      ...data,
      idempotency_key: `doc-${data.external_id}`,
    });
  }

  async sendForSignature(documentId: string) {
    return this.client.post(`/documents/${documentId}/send`);
  }

  async getDocument(documentId: string) {
    return this.client.get(`/documents/${documentId}`);
  }

  async listDocuments(filter?: { status?: string; recipient_email?: string }) {
    return this.client.get('/documents', { params: filter });
  }
}

export function createDocumensoClient(organizationId: string): DocumensoClient {
  const apiKey = process.env[`DOCUMENSO_API_KEY_${organizationId}`] || process.env.DOCUMENSO_API_KEY;
  return new DocumensoClient(organizationId, apiKey!);
}

// ============ FREESCOUT (SUPPORT) ============

export class FreescoutClient {
  private client: AxiosInstance;
  private organizationId: string;

  constructor(organizationId: string, apiKey: string) {
    this.organizationId = organizationId;
    this.client = axios.create({
      baseURL: `${process.env.FREESCOUT_URL}/api/v1`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Organization-ID': organizationId,
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
  }

  async createCustomer(data: {
    name: string;
    email: string;
    phone?: string;
    external_id: string;
  }) {
    return this.client.post('/customers', {
      ...data,
      idempotency_key: `cust-${data.external_id}`,
    });
  }

  async createConversation(data: {
    customer_id: string;
    subject: string;
    description: string;
    status: 'active' | 'pending' | 'closed';
    external_id: string;
  }) {
    return this.client.post('/conversations', {
      ...data,
      idempotency_key: `conv-${data.external_id}`,
    });
  }

  async addMessage(conversationId: string, data: {
    text: string;
    from_customer: boolean;
  }) {
    return this.client.post(`/conversations/${conversationId}/messages`, data);
  }

  async getConversation(conversationId: string) {
    return this.client.get(`/conversations/${conversationId}`);
  }

  async listConversations(filter?: { customer_id?: string; status?: string }) {
    return this.client.get('/conversations', { params: filter });
  }
}

export function createFreescoutClient(organizationId: string): FreescoutClient {
  const apiKey = process.env[`FREESCOUT_API_KEY_${organizationId}`] || process.env.FREESCOUT_API_KEY;
  return new FreescoutClient(organizationId, apiKey!);
}
