import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1727768594886 implements MigrationInterface {
  name = ' $npmConfigName1727768594886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_64cd97487c5c42806458ab5520c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_976c0fe23c870f914acd2378e4e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "waiting_list" DROP CONSTRAINT "FK_9a211a46f0408aa6da79a82dddc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "waiting_list" DROP CONSTRAINT "FK_658048af7c5ebe77215fc40e7fc"`,
    );
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "event_id"`);
    await queryRunner.query(`ALTER TABLE "waiting_list" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "waiting_list" DROP COLUMN "event_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD "version" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "bookings" ADD "userId" uuid`);
    await queryRunner.query(`ALTER TABLE "bookings" ADD "eventId" uuid`);
    await queryRunner.query(`ALTER TABLE "waiting_list" ADD "userId" uuid`);
    await queryRunner.query(`ALTER TABLE "waiting_list" ADD "eventId" uuid`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."bookings_status_enum" AS ENUM('booked', 'cancelled')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'booked'`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_38a69a58a323647f2e75eb994de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_f95d476ef16fad91a50544b60c3" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "waiting_list" ADD CONSTRAINT "FK_0ca5aa2acd5790ccddca86d5b78" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "waiting_list" ADD CONSTRAINT "FK_5dcada0fc053130bd5b399fffb4" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "waiting_list" DROP CONSTRAINT "FK_5dcada0fc053130bd5b399fffb4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "waiting_list" DROP CONSTRAINT "FK_0ca5aa2acd5790ccddca86d5b78"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_f95d476ef16fad91a50544b60c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_38a69a58a323647f2e75eb994de"`,
    );
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD "status" character varying NOT NULL DEFAULT 'booked'`,
    );
    await queryRunner.query(`ALTER TABLE "waiting_list" DROP COLUMN "eventId"`);
    await queryRunner.query(`ALTER TABLE "waiting_list" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "eventId"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "version"`);
    await queryRunner.query(
      `ALTER TABLE "waiting_list" ADD "event_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "waiting_list" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD "event_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "waiting_list" ADD CONSTRAINT "FK_658048af7c5ebe77215fc40e7fc" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "waiting_list" ADD CONSTRAINT "FK_9a211a46f0408aa6da79a82dddc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_976c0fe23c870f914acd2378e4e" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_64cd97487c5c42806458ab5520c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
