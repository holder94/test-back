import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { OrdersModule } from './orders/orders.module'
import { ReferenceModule } from './reference/reference.module'
const { join } = require('path')

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }),
    OrdersModule,
    ReferenceModule,
  ],
})
export class AppModule {}
