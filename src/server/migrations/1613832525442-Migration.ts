import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1613832525442 implements MigrationInterface {
    name = "Migration1613832525442";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE \"queue\" ADD \"name\" character varying NOT NULL"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"queue\" DROP COLUMN \"name\"");
    }
}
