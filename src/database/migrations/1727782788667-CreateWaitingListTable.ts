import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWaitingListTable1727782788667 implements MigrationInterface {
  name = 'CreateWaitingListTable1727782788667';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "waiting_list" ADD "position" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "waiting_list" DROP COLUMN "position"`,
    );
  }
}
