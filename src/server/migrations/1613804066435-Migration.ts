import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1613804066435 implements MigrationInterface {
    name = "Migration1613804066435";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "weekly_event" ADD "day" integer NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "weekly_event" ADD CONSTRAINT "CHK_fa4e975db77ca08618fd5c4adf" CHECK ("day" = 1 OR "day" = 2 OR "day" = 3 OR "day" = 4 OR "day" = 5 OR "day" = 6 OR "day" = 7)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "weekly_event" DROP CONSTRAINT "CHK_fa4e975db77ca08618fd5c4adf"`
        );
        await queryRunner.query(`ALTER TABLE "weekly_event" DROP COLUMN "day"`);
    }
}
