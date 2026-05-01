export interface N8NWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: N8NNode[];
  updatedAt: string;
  createdAt: string;
}

export interface N8NNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  parameters: any;
}

export interface WorkflowAssignment {
  id: string;
  name: string;
  value: string;
  type: string;
}

export interface WorkflowInterval {
  field: string;
  expression: string;
}
