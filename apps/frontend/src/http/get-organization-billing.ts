import { api } from './api-client'

interface GetOrganizationBillingResponse {
  billing: {
    seats: {
      amount: number
      price: number
      unit: number
    }
    projects: {
      amount: number
      price: number
      unit: number
    }
    total: number
  }
}

export async function getOrganizationBilling(orgSlug: string) {
  return api
    .get(`organizations/${orgSlug}/billing`)
    .json<GetOrganizationBillingResponse>()
}
