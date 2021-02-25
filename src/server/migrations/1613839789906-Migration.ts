import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1613839789906 implements MigrationInterface {
    name = "Migration1613839789906";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE \"queue\" ADD \"shortDescription\" character varying NOT NULL"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE \"queue\" DROP COLUMN \"shortDescription\""
        );
    }
}
