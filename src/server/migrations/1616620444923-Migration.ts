import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1616620444923 implements MigrationInterface {
    name = "Migration1616620444923"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"question\" ADD \"closedTime\" TIMESTAMP WITH TIME ZONE");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"question\" DROP COLUMN \"closedTime\"");
    }

}
