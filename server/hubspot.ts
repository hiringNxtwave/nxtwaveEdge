import { ReplitConnectors } from "@replit/connectors-sdk";

const connectors = new ReplitConnectors();

async function hubspotRequest(
  path: string,
  method: string = "GET",
  body?: unknown
): Promise<any> {
  const options: RequestInit = { method };
  if (body) {
    options.body = JSON.stringify(body);
    options.headers = { "Content-Type": "application/json" };
  }
  const response = await connectors.proxy("hubspot", path, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HubSpot API error ${response.status}: ${text}`);
  }
  return response.json();
}

export async function upsertContact(
  email: string,
  firstName: string,
  lastName: string,
  phone?: string
): Promise<string> {
  const searchBody = {
    filterGroups: [
      {
        filters: [
          { propertyName: "email", operator: "EQ", value: email },
        ],
      },
    ],
    properties: ["email", "firstname", "lastname", "phone"],
    limit: 1,
  };

  const searchResult = await hubspotRequest(
    "/crm/v3/objects/contacts/search",
    "POST",
    searchBody
  );

  const properties: Record<string, string> = {
    email,
    firstname: firstName,
    lastname: lastName,
  };
  if (phone) properties.phone = phone;

  if (searchResult.results && searchResult.results.length > 0) {
    const contactId = searchResult.results[0].id;
    await hubspotRequest(`/crm/v3/objects/contacts/${contactId}`, "PATCH", {
      properties,
    });
    return contactId;
  } else {
    const created = await hubspotRequest("/crm/v3/objects/contacts", "POST", {
      properties,
    });
    return created.id;
  }
}

export async function upsertCompany(
  domain: string,
  name: string
): Promise<string> {
  const searchBody = {
    filterGroups: [
      {
        filters: [
          { propertyName: "domain", operator: "EQ", value: domain },
        ],
      },
    ],
    properties: ["domain", "name"],
    limit: 1,
  };

  const searchResult = await hubspotRequest(
    "/crm/v3/objects/companies/search",
    "POST",
    searchBody
  );

  const properties: Record<string, string> = { domain, name };

  if (searchResult.results && searchResult.results.length > 0) {
    const companyId = searchResult.results[0].id;
    await hubspotRequest(`/crm/v3/objects/companies/${companyId}`, "PATCH", {
      properties,
    });
    return companyId;
  } else {
    const created = await hubspotRequest("/crm/v3/objects/companies", "POST", {
      properties,
    });
    return created.id;
  }
}

export async function associateContactWithCompany(
  contactId: string,
  companyId: string
): Promise<void> {
  await hubspotRequest(
    `/crm/v4/objects/contacts/${contactId}/associations/companies/${companyId}`,
    "PUT",
    [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 279 }]
  );
}

export async function createDeal(
  dealName: string,
  contactId: string,
  companyId: string
): Promise<string> {
  const created = await hubspotRequest("/crm/v3/objects/deals", "POST", {
    properties: {
      dealname: dealName,
      dealstage: "appointmentscheduled",
      pipeline: "default",
    },
  });

  const dealId = created.id;

  await Promise.all([
    hubspotRequest(
      `/crm/v4/objects/deals/${dealId}/associations/contacts/${contactId}`,
      "PUT",
      [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 }]
    ),
    hubspotRequest(
      `/crm/v4/objects/deals/${dealId}/associations/companies/${companyId}`,
      "PUT",
      [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 5 }]
    ),
  ]);

  return dealId;
}
