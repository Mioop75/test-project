import { MigrationInterface, QueryRunner } from 'typeorm';

export class RelationsBetweenUserPost1717253310593
  implements MigrationInterface
{
  name = 'RelationsBetweenUserPost1717253310593';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" ADD "author_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "author_id"`);
  }
}
