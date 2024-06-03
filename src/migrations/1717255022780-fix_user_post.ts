import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUserPost1717255022780 implements MigrationInterface {
  name = 'FixUserPost1717255022780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62"`,
    );
  }
}
