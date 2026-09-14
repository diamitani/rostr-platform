> Source: diamitani PAE repos (merged into Rostr 2026-09-14). Sample/template content is illustrative — replace placeholders with your own verified data before production use.

# Connector & Endpoint Registry

This document provides exact REST API specifications, endpoints, authentication schemes, and official documentation links for all supported platforms across the 5-Pillar Prospect Automation Engine.

---

## 1. CRM & Pipeline Platforms

### HubSpot CRM
- **Official Docs**: [https://developers.hubspot.com/docs/api/crm/contacts](https://developers.hubspot.com/docs/api/crm/contacts)
- **Search / Dedupe Endpoint**: `POST https://api.hubapi.com/crm/v3/objects/contacts/search`
- **Upsert Endpoint**: `POST https://api.hubapi.com/crm/v3/objects/contacts`
- **Auth Header**: `Authorization: Bearer {{ $env.HUBSPOT_API_KEY }}`
- **Required Env**: `HUBSPOT_API_KEY`
- **Search Payload**:
  ```json
  {
    "filterGroups": [
      {
        "filters": [
          { "propertyName": "email", "operator": "EQ", "value": "{{ $json.email }}" }
        ]
      }
    ],
    "properties": ["email", "firstname", "lastname", "company", "lifecyclestage", "deal_status"]
  }
  ```

### Salesforce REST API
- **Official Docs**: [https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/)
- **SOQL Query Endpoint**: `GET https://{{ $env.SALESFORCE_INSTANCE_URL }}/services/data/v59.0/query?q=SELECT+Id,Email,AccountId+FROM+Contact+WHERE+Email='{{ $json.email }}'`
- **Upsert Endpoint**: `POST https://{{ $env.SALESFORCE_INSTANCE_URL }}/services/data/v59.0/sobjects/Contact`
- **Auth Header**: `Authorization: Bearer {{ $env.SALESFORCE_ACCESS_TOKEN }}`
- **Required Env**: `SALESFORCE_ACCESS_TOKEN`, `SALESFORCE_INSTANCE_URL`

### Attio CRM
- **Official Docs**: [https://developers.attio.com/reference](https://developers.attio.com/reference)
- **Query Endpoint**: `POST https://api.attio.com/v2/objects/people/records/query`
- **Upsert Endpoint**: `PUT https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses`
- **Auth Header**: `Authorization: Bearer {{ $env.ATTIO_API_KEY }}`
- **Required Env**: `ATTIO_API_KEY`

### Pipedrive
- **Official Docs**: [https://developers.pipedrive.com/docs/api/v1](https://developers.pipedrive.com/docs/api/v1)
- **Search Endpoint**: `GET https://api.pipedrive.com/v1/persons/search?term={{ $json.email }}&api_token={{ $env.PIPEDRIVE_API_TOKEN }}`
- **Upsert Endpoint**: `POST https://api.pipedrive.com/v1/persons?api_token={{ $env.PIPEDRIVE_API_TOKEN }}`
- **Auth Scheme**: Query param or Bearer token
- **Required Env**: `PIPEDRIVE_API_TOKEN`

### Close CRM
- **Official Docs**: [https://developer.close.com/](https://developer.close.com/)
- **Query Endpoint**: `GET https://api.close.com/api/v1/contact/?query=email:{{ $json.email }}`
- **Upsert Endpoint**: `POST https://api.close.com/api/v1/contact/`
- **Auth Header**: `Authorization: Basic {{ $env.CLOSE_API_KEY_BASE64 }}`
- **Required Env**: `CLOSE_API_KEY_BASE64`

---

## 2. Lead Discovery & Contact Reveal Platforms

### Apollo.io
- **Official Docs**: [https://apolloio.github.io/apollo-api-docs/](https://apolloio.github.io/apollo-api-docs/)
- **Search & Reveal Endpoint**: `POST https://api.apollo.io/v1/mixed_people/search`
- **Auth Scheme**: Body Parameter `api_key: {{ $env.APOLLO_API_KEY }}` or Header `x-api-key`
- **Required Env**: `APOLLO_API_KEY`
- **Payload Schema**:
  ```json
  {
    "api_key": "{{ $env.APOLLO_API_KEY }}",
    "q_organization_domains": "{{ $json.domain }}",
    "person_titles": ["VP of Sales", "Head of RevOps", "Director of Sales"],
    "person_seniorities": ["senior", "director", "head", "manager", "c-level"],
    "page": 1,
    "per_page": 25,
    "reveal_personal_emails": true,
    "reveal_phone_number": true
  }
  ```

### Clay (Waterfall Enrichment)
- **Official Docs**: [https://docs.clay.com/](https://docs.clay.com/)
- **Endpoint**: `POST https://api.clay.com/v3/workspaces/{{ $env.CLAY_WORKSPACE_ID }}/tables/{{ $env.CLAY_TABLE_ID }}/rows`
- **Auth Header**: `Authorization: Bearer {{ $env.CLAY_API_KEY }}`
- **Required Env**: `CLAY_API_KEY`, `CLAY_WORKSPACE_ID`, `CLAY_TABLE_ID`

### ZoomInfo Enterprise
- **Official Docs**: [https://api-docs.zoominfo.com/](https://api-docs.zoominfo.com/)
- **Endpoint**: `POST https://api.zoominfo.com/lookup/people/search`
- **Auth Header**: `Authorization: Bearer {{ $env.ZOOMINFO_ACCESS_TOKEN }}`
- **Required Env**: `ZOOMINFO_ACCESS_TOKEN`

### Clearbit (HubSpot Breeze)
- **Official Docs**: [https://dashboard.clearbit.com/docs](https://dashboard.clearbit.com/docs)
- **Endpoint**: `GET https://person.clearbit.com/v2/people/find?domain={{ $json.domain }}&title={{ $json.target_title }}`
- **Auth Header**: `Authorization: Bearer {{ $env.CLEARBIT_API_KEY }}`
- **Required Env**: `CLEARBIT_API_KEY`

### Firecrawl Web Scraper
- **Official Docs**: [https://docs.firecrawl.dev/](https://docs.firecrawl.dev/)
- **Endpoint**: `POST https://api.firecrawl.dev/v1/scrape`
- **Auth Header**: `Authorization: Bearer {{ $env.FIRECRAWL_API_KEY }}`
- **Required Env**: `FIRECRAWL_API_KEY`

---

## 3. Outreach Engines & Email Sequencers

### Smartlead.ai
- **Official Docs**: [https://api.smartlead.ai/reference](https://api.smartlead.ai/reference)
- **Add Lead Endpoint**: `POST https://server.smartlead.ai/api/v1/campaigns/{{ $env.SMARTLEAD_CAMPAIGN_ID }}/leads`
- **Auth Header**: `Authorization: Bearer {{ $env.SMARTLEAD_API_KEY }}`
- **Required Env**: `SMARTLEAD_API_KEY`, `SMARTLEAD_CAMPAIGN_ID`
- **Payload Schema**:
  ```json
  {
    "lead_list": [
      {
        "email": "{{ $json.email }}",
        "first_name": "{{ $json.first_name }}",
        "last_name": "{{ $json.last_name }}",
        "company_name": "{{ $json.company_name }}",
        "custom_fields": {
          "email_subject": "{{ $json.email_subject }}",
          "email_body": "{{ $json.email_body }}",
          "pain_hypothesis": "{{ $json.pain_point_summary }}"
        }
      }
    ]
  }
  ```

### Instantly.ai
- **Official Docs**: [https://developer.instantly.ai/](https://developer.instantly.ai/)
- **Endpoint**: `POST https://api.instantly.ai/api/v1/lead/add`
- **Auth Header**: `Authorization: Bearer {{ $env.INSTANTLY_API_KEY }}`
- **Required Env**: `INSTANTLY_API_KEY`, `INSTANTLY_CAMPAIGN_ID`

### Amplemarket
- **Official Docs**: [https://developer.amplemarket.com/](https://developer.amplemarket.com/)
- **Endpoint**: `POST https://api.amplemarket.com/sequences/{{ $env.AMPLEMARKET_SEQUENCE_ID }}/enroll`
- **Auth Header**: `Authorization: Bearer {{ $env.AMPLEMARKET_API_KEY }}`
- **Required Env**: `AMPLEMARKET_API_KEY`, `AMPLEMARKET_SEQUENCE_ID`

### HubSpot Sales Sequences
- **Official Docs**: [https://developers.hubspot.com/docs/api/crm/sequences](https://developers.hubspot.com/docs/api/crm/sequences)
- **Endpoint**: `POST https://api.hubapi.com/automation/v4/sequences/enrollments`
- **Auth Header**: `Authorization: Bearer {{ $env.HUBSPOT_API_KEY }}`
- **Required Env**: `HUBSPOT_API_KEY`, `HUBSPOT_SEQUENCE_ID`, `HUBSPOT_SENDER_USER_ID`

---

## 4. LLM Providers & Reasoning Nodes

### Anthropic Claude 3.5 Sonnet
- **Endpoint**: `POST https://api.anthropic.com/v1/messages`
- **Auth Header**: `x-api-key: {{ $env.ANTHROPIC_API_KEY }}`, `anthropic-version: 2023-06-01`
- **Required Env**: `ANTHROPIC_API_KEY`
- **Model**: `claude-3-5-sonnet-20241022`

### OpenAI GPT-4o / DeepSeek V3
- **OpenAI Endpoint**: `POST https://api.openai.com/v1/chat/completions` (`OPENAI_API_KEY`)
- **DeepSeek Endpoint**: `POST https://api.deepseek.com/chat/completions` (`DEEPSEEK_API_KEY`)
- **Auth Header**: `Authorization: Bearer {{ $env.OPENAI_API_KEY }}`
