import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1613834425762 implements MigrationInterface {
    name = "Migration1613834425762";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "queue" DROP COLUMN "lastAccessed"'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "queue" ADD "lastAccessed" TIMESTAMP NOT NULL'
        );
    }
}
