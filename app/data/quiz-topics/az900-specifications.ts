// 🎯 COMPLETE AZ-900 TOPIC SPECIFICATIONS (Aligned with Official Study Guide)
export const AZ900_TOPIC_SPECIFICATIONS = {
  // Module 1: Cloud Concepts (25-30%)
  "Describe cloud computing": {
    focus: "Cloud computing definition, shared responsibility, cloud models, consumption model, pricing, serverless",
    keyTerms: ["cloud computing", "shared responsibility model", "public cloud", "private cloud", "hybrid cloud", "consumption-based model", "pay-as-you-go", "serverless", "CapEx", "OpEx"],
    scenarios: ["Cloud model selection", "Pricing model comparison", "Shared responsibility scenarios", "Serverless architecture decisions"],
    examStyle: "Definition-based, responsibility matrix, and pricing model questions"
  },
  "Describe the benefits of using cloud services": {
    focus: "High availability, scalability, reliability, predictability, security, governance, manageability benefits",
    keyTerms: ["high availability", "scalability", "elasticity", "reliability", "predictability", "security", "governance", "manageability", "SLA", "disaster recovery"],
    scenarios: ["Availability requirements", "Scaling decisions", "Disaster recovery planning", "SLA compliance"],
    examStyle: "Benefit identification and scenario-based application questions"
  },
  "Describe cloud service types": {
    focus: "IaaS, PaaS, SaaS characteristics, use cases, and appropriate service selection",
    keyTerms: ["Infrastructure as a Service", "Platform as a Service", "Software as a Service", "IaaS", "PaaS", "SaaS", "shared responsibility", "use cases"],
    scenarios: ["Service type selection", "Migration strategies", "Application hosting decisions", "Development platform choices"],
    examStyle: "Service type identification and use case matching questions"
  },

  // Module 2: Azure Architecture and Services (35-40%)
  "Describe the core architectural components of Azure": {
    focus: "Regions, availability zones, datacenters, resources, resource groups, subscriptions, management groups, hierarchy",
    keyTerms: ["Azure regions", "region pairs", "sovereign regions", "availability zones", "datacenters", "Azure resources", "resource groups", "subscriptions", "management groups", "hierarchy"],
    scenarios: ["Regional planning", "High availability design", "Organizational structure", "Governance hierarchy"],
    examStyle: "Architecture design and organizational hierarchy questions"
  },
  "Describe Azure compute and networking services": {
    focus: "Compute types, VMs, containers, functions, networking, VPN, ExpressRoute, endpoints",
    keyTerms: ["virtual machines", "containers", "Azure Functions", "VM Scale Sets", "Azure Virtual Desktop", "Virtual Network", "VPN Gateway", "ExpressRoute", "public endpoints", "private endpoints"],
    scenarios: ["Compute selection", "Networking design", "Hybrid connectivity", "Application hosting"],
    examStyle: "Service selection and networking architecture questions"
  },
  "Describe Azure storage services": {
    focus: "Storage types, tiers, redundancy, migration options, file movement tools",
    keyTerms: ["Blob storage", "Azure Files", "Queue storage", "Table storage", "storage tiers", "Hot", "Cool", "Archive", "LRS", "ZRS", "GRS", "AzCopy", "Azure Storage Explorer", "Azure Migrate", "Azure Data Box"],
    scenarios: ["Storage solution design", "Data migration", "Cost optimization", "Access pattern analysis"],
    examStyle: "Storage selection and migration strategy questions"
  },
  "Describe Azure identity, access, and security": {
    focus: "Directory services, authentication, external identities, access control, Zero Trust, defense-in-depth, security tools",
    keyTerms: ["Microsoft Entra ID", "Entra Domain Services", "single sign-on", "multi-factor authentication", "passwordless", "B2B", "B2C", "Conditional Access", "Azure RBAC", "Zero Trust", "defense-in-depth", "Microsoft Defender for Cloud"],
    scenarios: ["Identity management", "Access control design", "Security implementation", "External user access"],
    examStyle: "Security architecture and identity management questions"
  },

  // Module 3: Management and Governance (30-35%)
  "Describe cost management in Azure": {
    focus: "Cost factors, pricing calculator, TCO calculator, cost management tools, tags",
    keyTerms: ["cost factors", "pricing calculator", "TCO calculator", "Cost Management", "budgets", "alerts", "tags", "reserved instances", "spot instances", "Azure Advisor"],
    scenarios: ["Cost estimation", "Budget planning", "Cost optimization", "Chargeback implementation"],
    examStyle: "Cost calculation and optimization strategy questions"
  },
  "Describe features and tools in Azure for governance and compliance": {
    focus: "Microsoft Purview, Azure Policy, resource locks, compliance offerings",
    keyTerms: ["Microsoft Purview", "Azure Policy", "resource locks", "Azure Blueprints", "Service Trust Portal", "compliance offerings", "ISO", "SOC", "FedRAMP", "GDPR", "HIPAA"],
    scenarios: ["Governance implementation", "Compliance requirements", "Policy enforcement", "Resource protection"],
    examStyle: "Governance design and compliance questions"
  },
  "Describe features and tools for managing and deploying Azure resources": {
    focus: "Azure portal, Cloud Shell, CLI, PowerShell, Azure Arc, IaC, ARM templates",
    keyTerms: ["Azure portal", "Azure Cloud Shell", "Azure CLI", "Azure PowerShell", "Azure Arc", "Infrastructure as Code", "IaC", "Azure Resource Manager", "ARM templates"],
    scenarios: ["Management tool selection", "Automation implementation", "Hybrid management", "Deployment strategies"],
    examStyle: "Tool selection and automation scenario questions"
  },
  "Describe monitoring tools in Azure": {
    focus: "Azure Advisor, Service Health, Azure Monitor, Log Analytics, alerts, Application Insights",
    keyTerms: ["Azure Advisor", "Azure Service Health", "Azure Monitor", "Log Analytics", "Azure Monitor alerts", "Application Insights", "metrics", "logs", "dashboards"],
    scenarios: ["Monitoring strategy", "Performance optimization", "Alerting configuration", "Application insights"],
    examStyle: "Monitoring solution design and troubleshooting questions"
  }
}
