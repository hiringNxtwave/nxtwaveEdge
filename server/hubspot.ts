// HubSpot CRM integration — @hubspot/api-client SDK with rate limiting & retries

import { Client, AssociationTypes } from "@hubspot/api-client";

const hubspotClient = new Client({
  accessToken: process.env.HUBSPOT_API_KEY!,
  numberOfApiCallRetries: 3,
});

// All custom deal properties we want to fetch from HubSpot
const DEAL_PROPERTIES = [
  "dealname","pipeline","dealstage","amount","closedate","createdate",
  "job_title","job_id","role_name","company_name","company_domain","jd_link",
  "ctc_range","location","work_mode","number_of_openings","required_skills",
  "batch","min_cgp","type_of_role","type_of_requirement","technologies_required",
  "stream","stipend_range","work_timings","internship_duration","internship_ctc",
  "bond_service_agreement","passout_year","highest_degree","online_interview_rounds",
  "offline_interview_rounds","no_of_working_days","nurturing_team_remarks",
  "profiling_shortlisting_remarks","interview_done_probability","other_benefits",
  "timeline_for_requirement","expected_hiring_start_date","is_official_crp",
  "job_application_deadline","jd_count","profiling_poc","education_criteria",
  "education_department_tags","mode_of_interview_process","min_internship_stipend_per_month",
  "max_internship_stipend_per_month","cv_sheet_link","user_opt_in_form_preference",
  "min_ctc_lpa","max_ctc_lpa","availability_form","status_form","job_track","job_type",
  "10th_percentage","intermediate_percentage","optional_technologies_required",
];

const COMPANY_PROPERTIES = [
  "name","domain","website","industry","linkedin_company_page",
  "numberofemployees","city","state","country","lifecyclestage",
  "description","phone","hubspot_owner_id",
];

export async function getDealFromHubSpot(dealId: string) {
  const deal = await hubspotClient.crm.deals.basicApi.getById(
    dealId,
    DEAL_PROPERTIES,
    undefined,
    undefined,
    undefined,
    true, // Associations
  );

  // Fetch associated company
  let company = null;
  const companyAssociations = await hubspotClient.crm.associations.v4.basicApi.getPage(
    "deals",
    dealId,
    "companies",
    undefined,
    undefined,
  );

  if (companyAssociations.results.length > 0) {
    const companyId = companyAssociations.results[0].id;
    company = await hubspotClient.crm.companies.basicApi.getById(
      companyId,
      COMPANY_PROPERTIES,
    );
  }

  return { deal, company };
}

// Pipeline stage labels for display
const PIPELINE_STAGES: Record<string, Record<string, string>> = {
  "95243701": {
    "175041084": "Open to Apply",
    "175041085": "Applications Closed",
    "175246708": "Job Hiring Completed",
    "175246709": "Job Requirement Closed",
  },
};

export function getPipelineStageLabel(pipelineId: string, stageId: string): string {
  return PIPELINE_STAGES[pipelineId]?.[stageId] || stageId;
}

export async function upsertContact(
  email: string,
  firstName: string,
  lastName: string,
  phone?: string
): Promise<string> {
  const properties: Record<string, string> = {
    email,
    firstname: firstName,
    lastname: lastName,
  };
  if (phone) properties.phone = phone;

  const result = await hubspotClient.crm.contacts.batchApi.upsert({
    inputs: [{ id: email, properties }],
  } as any);
  return result.results[0].id;
}

export async function upsertCompany(
  domain: string,
  name: string
): Promise<string> {
  const result = await hubspotClient.crm.companies.batchApi.upsert({
    inputs: [{ id: domain, properties: { domain, name } }],
  } as any);
  return result.results[0].id;
}

export async function associateContactWithCompany(
  contactId: string,
  companyId: string
): Promise<void> {
  await hubspotClient.crm.associations.v4.basicApi.create(
    "contacts",
    contactId,
    "companies",
    companyId,
    [
      {
        associationCategory: "HUBSPOT_DEFINED" as const,
        associationTypeId: AssociationTypes.contactToCompany,
      },
    ]
  );
}

export async function createDeal(
  dealName: string,
  contactId: string,
  companyId: string
): Promise<string> {
  const result = await hubspotClient.crm.deals.basicApi.create({
    properties: {
      dealname: dealName,
      dealstage: "appointmentscheduled",
      pipeline: "default",
    },
    associations: [
      {
        to: { id: contactId },
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED" as const,
            associationTypeId: AssociationTypes.dealToContact,
          },
        ],
      },
      {
        to: { id: companyId },
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED" as const,
            associationTypeId: AssociationTypes.dealToCompany,
          },
        ],
      },
    ],
  } as any);
  return result.id;
}
