import { Customer } from '../../customer/customer.entity';
import { Offer } from '../../offer/offer.entity';
import { Voucher } from '../../voucher/voucher.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedVouchers1685956854018 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const customers = await this.seedCustomer(queryRunner);
    const offers = await this.seedOffers(queryRunner);

    const generatedVouchers = new Set<string>();
    await Promise.all(
      customers.map(async (customer) => {
        offers.map(async (offer) => {
          return queryRunner.manager.insert(Voucher, {
            customerId: customer.id,
            offerId: offer.id,
            code: this.generateUniqueString(generatedVouchers, 8),
            expiresAt: new Date('2023-12-12'),
          });
        });
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(_: QueryRunner): Promise<void> {
    //
  }

  private async seedCustomer(queryRunner: QueryRunner): Promise<Customer[]> {
    const customer = queryRunner.manager.create(Customer, [
      { email: 'test@test.com' },
      { email: 'test2@test.com' },
    ]);

    return queryRunner.manager.save(Customer, customer);
  }

  private async seedOffers(queryRunner: QueryRunner): Promise<Offer[]> {
    return await queryRunner.manager.save(
      Offer,
      [10, 20, 30, 40, 50].map((percentage) => ({
        percentage,
        name: `${percentage}%`,
      })),
    );
  }

  private generateUniqueString(memo: Set<string>, length): string {
    let randomString = this.generateRandomString(length);

    while (memo.has(randomString)) {
      randomString = this.generateRandomString(length);
    }

    memo.add(randomString);
    return randomString;
  }

  private generateRandomString(length: number): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return result;
  }
}
