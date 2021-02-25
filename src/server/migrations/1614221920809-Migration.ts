import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1614221920809 implements MigrationInterface {
    name = "Migration1614221920809";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "queue" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queue" DROP COLUMN "createdAt"`);
    }
}
