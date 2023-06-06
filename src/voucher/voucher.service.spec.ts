import { Test, TestingModule } from '@nestjs/testing';
import { VoucherService } from './voucher.service';
import { CustomerService } from '../customer/customer.service';
import { Customer } from '../customer/customer.entity';
import { Voucher } from './voucher.entity';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

describe('VoucherService', () => {
  // Data
  const tomorrow = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  };
  const customer: Customer = { id: 1, email: 'test@test.com' };
  let voucher: Voucher;
  // Mocks
  let queryBuilderMock: {
    useTransaction: jest.Mock<any, any>;
    setLock: jest.Mock<any, any>;
    where: jest.Mock<any, any>;
    getOne: jest.Mock<any, any>;
  };
  let queryRunnerMock: {
    connect: any;
    startTransaction: any;
    manager?: {
      createQueryBuilder: jest.Mock<any, any>;
      update: jest.Mock<any, any>;
    };
    commitTransaction: any;
    rollbackTransaction: any;
    release: any;
  };
  let dataSourceMock: { createQueryRunner: jest.Mock<any, any> };
  const customerServiceMock = {
    findCustomer: jest.fn().mockResolvedValue(customer),
  };
  const voucherRepoMock = {
    findOne: jest.fn().mockResolvedValue(voucher),
  };

  let service: VoucherService;

  beforeEach(async () => {
    voucher = {
      id: 1,
      code: '12345678',
      customerId: customer.id,
      offerId: 1,
      customer,
      expiresAt: tomorrow(),
    };
    queryBuilderMock = {
      useTransaction: jest.fn().mockReturnThis(),
      setLock: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };
    queryRunnerMock = {
      manager: {
        createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
        update: jest.fn(),
      },
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    };
    dataSourceMock = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoucherService],
    })
      .useMocker((token) => {
        switch (token) {
          case CustomerService:
            return customerServiceMock;

          case DataSource:
            return dataSourceMock;

          case getRepositoryToken(Voucher):
            return voucherRepoMock;

          default:
            break;
        }
      })
      .compile();

    service = module.get<VoucherService>(VoucherService);
  });

  it('should redeem voucher when given correct email and code ', async () => {
    // Arrange
    const expectedResult: Voucher = { ...voucher, usedAt: new Date() };
    voucherRepoMock.findOne = jest.fn().mockResolvedValue(expectedResult);
    queryBuilderMock.getOne = jest.fn().mockResolvedValue(voucher);

    // Act
    const result = await service.redeemVoucher(voucher.code, customer.email);

    // Assert
    expect(result).toMatchObject(expectedResult);
    expect(queryRunnerMock.startTransaction).toHaveBeenCalled();
    expect(queryRunnerMock.manager.update).toHaveBeenCalledWith(
      Voucher,
      { id: voucher.id },
      { usedAt: expect.any(Date) },
    );
    expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
    expect(queryRunnerMock.release).toHaveBeenCalled();
  });

  it('should not redeem voucher when expires', async () => {
    // Arrange
    voucher.expiresAt = new Date('1999-10-10');
    queryBuilderMock.getOne = jest.fn().mockResolvedValue(voucher);

    // Act, Assert
    expect(
      async () => await service.redeemVoucher(voucher.code, customer.email),
    ).rejects.toThrow(new BadRequestException('Voucher expired'));
  });

  it('should not redeem voucher when already used', async () => {
    // Arrange
    voucher.usedAt = new Date();
    queryBuilderMock.getOne = jest.fn().mockResolvedValue(voucher);

    // Act, Assert
    await expect(
      async () => await service.redeemVoucher(voucher.code, customer.email),
    ).rejects.toThrow(
      new BadRequestException('Voucher has already been redeemed'),
    );
    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunnerMock.release).toHaveBeenCalled();
  });
  it('should not redeem voucher when expires', async () => {
    // Arrange
    voucher.expiresAt = new Date('1999-10-10');
    queryBuilderMock.getOne = jest.fn().mockResolvedValue(voucher);

    // Act, Assert
    await expect(
      async () => await service.redeemVoucher(voucher.code, customer.email),
    ).rejects.toThrow(new BadRequestException('Voucher expired'));
    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunnerMock.release).toHaveBeenCalled();
  });
});
