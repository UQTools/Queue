import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1614296848429 implements MigrationInterface {
    name = "Migration1614296848429"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"question\" DROP CONSTRAINT \"FK_83f26a5124fd7d091efeea8a8ac\"");
        await queryRunner.query("ALTER TABLE \"question\" ADD CONSTRAINT \"FK_83f26a5124fd7d091efeea8a8ac\" FOREIGN KEY (\"queueId\") REFERENCES \"queue\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"question\" DROP CONSTRAINT \"FK_83f26a5124fd7d091efeea8a8ac\"");
        await queryRunner.query("ALTER TABLE \"question\" ADD CONSTRAINT \"FK_83f26a5124fd7d091efeea8a8ac\" FOREIGN KEY (\"queueId\") REFERENCES \"queue\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
