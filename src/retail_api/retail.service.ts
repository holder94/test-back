import { Injectable } from '@nestjs/common'
import { CrmType, Order, OrdersFilter, RetailPagination } from './types'
import axios, { AxiosInstance } from 'axios'
import { serialize } from '../tools'
import { plainToClass } from 'class-transformer'
import { OrdersResponse } from 'src/graphql'

const RETAIL_URL = 'https://example.retailcrm.ru'
const RETAIL_KEY = 'xYBZBsA1vUTKPYwXXJ1XAmbPXQt0ByTc'

@Injectable()
export class RetailService {
  private readonly axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${RETAIL_URL}/api/v5`,
      timeout: 10000,
      headers: {},
    })
  }

  async orders(filter?: OrdersFilter): Promise<OrdersResponse> {
    const params = serialize(filter, '')
    const resp = await this.axios.get(`/orders?apiKey=${RETAIL_KEY}&` + params)

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const orders = plainToClass(Order, resp.data.orders as Array<any>)
    const pagination: RetailPagination = resp.data.pagination

    return {
      pagination,
      orders,
    }
  }

  async findOrder(id: string): Promise<Order | null> {
    const filter: OrdersFilter = {
      filter: {
        ids: [Number(id)],
      },
    }

    const params = serialize(filter, '')
    const resp = await this.axios.get(`/orders?apiKey=${RETAIL_KEY}&` + params)

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    if (resp.data.orders.length === 0) return null

    return resp.data.orders[0]
  }

  async orderStatuses(): Promise<CrmType[]> {
    const resp = await this.axios.get(
      `/reference/statuses?apiKey=${RETAIL_KEY}`,
    )

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const statuses = Object.values(resp.data.statuses)

    return statuses as CrmType[]
  }

  async productStatuses(): Promise<CrmType[]> {
    const resp = await this.axios.get(
      `/reference/product-statuses?apiKey=${RETAIL_KEY}`,
    )

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const statuses = Object.values(resp.data.productStatuses)

    return statuses as CrmType[]
  }

  async deliveryTypes(): Promise<CrmType[]> {
    const resp = await this.axios.get(
      `/reference/delivery-types?apiKey=${RETAIL_KEY}`,
    )

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const types = Object.values(resp.data.deliveryTypes)

    return types as CrmType[]
  }
}
