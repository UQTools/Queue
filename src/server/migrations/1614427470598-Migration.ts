import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1614427470598 implements MigrationInterface {
    name = "Migration1614427470598"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("COMMENT ON COLUMN \"queue\".\"examples\" IS NULL");
        await queryRunner.query("ALTER TABLE \"queue\" ALTER COLUMN \"examples\" SET DEFAULT array[]::varchar[]");
        await queryRunner.query("COMMENT ON COLUMN \"queue\".\"actions\" IS NULL");
        await queryRunner.query("ALTER TABLE \"queue\" ALTER COLUMN \"actions\" SET DEFAULT array[]::varchar[]");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"queue\" ALTER COLUMN \"actions\" SET DEFAULT ARRAY[]");
        await queryRunner.query("COMMENT ON COLUMN \"queue\".\"actions\" IS NULL");
        await queryRunner.query("ALTER TABLE \"queue\" ALTER COLUMN \"examples\" SET DEFAULT ARRAY[]");
        await queryRunner.query("COMMENT ON COLUMN \"queue\".\"examples\" IS NULL");
    }

}
