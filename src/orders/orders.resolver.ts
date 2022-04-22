import { Args, Query, Resolver } from '@nestjs/graphql'
import { RetailService } from '../retail_api/retail.service'
import { OrdersResponse, Order } from '../graphql'

@Resolver('Orders')
export class OrdersResolver {
  constructor(private retailService: RetailService) {}

  @Query('order')
  async order(@Args('number') id: string): Promise<Order | null> {
    return this.retailService.findOrder(id)
  }

  @Query('getOrders')
  async orders(@Args('page') page = 1): Promise<OrdersResponse> {
    const filter = {
      page
    }

    return this.retailService.orders(filter)
  }
}
