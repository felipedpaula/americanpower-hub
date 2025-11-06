<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('atividade_tipos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo')->unique();
            $table->timestamps();
        });

        Schema::create('atividade', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tipo_id')->constrained('atividade_tipos');
            $table->foreignId('turma_id')->constrained('turmas');
            $table->string('titulo');
            $table->text('descricao')->nullable();
            $table->unsignedDecimal('nota_max', 8, 2);
            $table->date('data_entrega')->nullable();
            $table->timestamps();
        });

        Schema::create('atividade_aluno', function (Blueprint $table) {
            $table->id();
            $table->foreignId('atividade_id')->constrained('atividade')->onDelete('cascade');
            $table->foreignId('aluno_id')->constrained('users');
            $table->string('status')->default('pendente');
            $table->timestamp('data_submissao')->nullable();
            $table->timestamp('data_correcao')->nullable();
            $table->unsignedDecimal('nota_total', 8, 2)->default(0);
            $table->text('comentario_professor')->nullable();
            $table->timestamps();

            $table->unique(['atividade_id', 'aluno_id']);
        });

        Schema::create('questoes_atividade', function (Blueprint $table) {
            $table->id();
            $table->foreignId('atividade_id')->constrained('atividade')->onDelete('cascade');
            $table->text('enunciado');
            $table->text('resposta_esperada')->nullable();
            $table->string('status')->default('ativa');
            $table->unsignedDecimal('valor', 8, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('questoes_atividade_aluno', function (Blueprint $table) {
            $table->id();
            $table->foreignId('questao_id')->constrained('questoes_atividade')->onDelete('cascade');
            $table->foreignId('aluno_id')->constrained('users');
            $table->text('resposta')->nullable();
            $table->string('status')->default('respondida');
            $table->unsignedDecimal('nota_obtida', 8, 2)->default(0);
            $table->timestamps();

            $table->unique(['questao_id', 'aluno_id']);
        });

        DB::statement("ALTER TABLE atividade_aluno ADD CONSTRAINT atividade_aluno_status_check CHECK (status IN ('pendente','enviado','corrigido','ausente'))");
        DB::statement("ALTER TABLE questoes_atividade ADD CONSTRAINT questoes_atividade_status_check CHECK (status IN ('ativa','anulada'))");
        DB::statement("ALTER TABLE questoes_atividade_aluno ADD CONSTRAINT questoes_atividade_aluno_status_check CHECK (status IN ('respondida','em_branco','anulada'))");

        DB::unprepared(<<<SQL
            CREATE TRIGGER trg_questoes_atividade_before_insert
            BEFORE INSERT ON questoes_atividade
            FOR EACH ROW
            BEGIN
                DECLARE soma_valores DECIMAL(10,2);
                DECLARE nota_max DECIMAL(10,2);

                SET nota_max = (SELECT nota_max FROM atividade WHERE id = NEW.atividade_id);
                SET soma_valores = IFNULL((SELECT SUM(valor) FROM questoes_atividade WHERE atividade_id = NEW.atividade_id), 0);

                IF soma_valores + NEW.valor > nota_max THEN
                    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A soma dos valores das questões excede a nota máxima da atividade.';
                END IF;
            END;
        SQL);

        DB::unprepared(<<<SQL
            CREATE TRIGGER trg_questoes_atividade_before_update
            BEFORE UPDATE ON questoes_atividade
            FOR EACH ROW
            BEGIN
                DECLARE soma_valores DECIMAL(10,2);
                DECLARE nota_max DECIMAL(10,2);

                SET nota_max = (SELECT nota_max FROM atividade WHERE id = NEW.atividade_id);
                SET soma_valores = IFNULL((SELECT SUM(valor) FROM questoes_atividade WHERE atividade_id = NEW.atividade_id AND id <> NEW.id), 0);

                IF soma_valores + NEW.valor > nota_max THEN
                    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A soma dos valores das questões excede a nota máxima da atividade.';
                END IF;
            END;
        SQL);

        DB::unprepared(<<<SQL
            CREATE TRIGGER trg_questoes_atividade_aluno_after_insert
            AFTER INSERT ON questoes_atividade_aluno
            FOR EACH ROW
            BEGIN
                DECLARE atividade_relacionada BIGINT;
                DECLARE nota_total_calculada DECIMAL(10,2);

                SET atividade_relacionada = (SELECT atividade_id FROM questoes_atividade WHERE id = NEW.questao_id);

                IF atividade_relacionada IS NOT NULL THEN
                    SET nota_total_calculada = IFNULL((
                        SELECT SUM(qaa.nota_obtida)
                        FROM questoes_atividade_aluno qaa
                        INNER JOIN questoes_atividade qa ON qa.id = qaa.questao_id
                        WHERE qa.atividade_id = atividade_relacionada
                          AND qaa.aluno_id = NEW.aluno_id
                          AND qaa.status <> 'anulada'
                    ), 0);

                    UPDATE atividade_aluno
                    SET nota_total = nota_total_calculada
                    WHERE atividade_id = atividade_relacionada AND aluno_id = NEW.aluno_id;
                END IF;
            END;
        SQL);

        DB::unprepared(<<<SQL
            CREATE TRIGGER trg_questoes_atividade_aluno_after_update
            AFTER UPDATE ON questoes_atividade_aluno
            FOR EACH ROW
            BEGIN
                DECLARE atividade_relacionada BIGINT;
                DECLARE atividade_relacionada_antiga BIGINT;
                DECLARE nota_total_calculada DECIMAL(10,2);
                DECLARE alvo_aluno BIGINT;

                SET atividade_relacionada = (SELECT atividade_id FROM questoes_atividade WHERE id = NEW.questao_id);
                SET alvo_aluno = NEW.aluno_id;

                IF atividade_relacionada IS NOT NULL THEN
                    SET nota_total_calculada = IFNULL((
                        SELECT SUM(qaa.nota_obtida)
                        FROM questoes_atividade_aluno qaa
                        INNER JOIN questoes_atividade qa ON qa.id = qaa.questao_id
                        WHERE qa.atividade_id = atividade_relacionada
                          AND qaa.aluno_id = alvo_aluno
                          AND qaa.status <> 'anulada'
                    ), 0);

                    UPDATE atividade_aluno
                    SET nota_total = nota_total_calculada
                    WHERE atividade_id = atividade_relacionada AND aluno_id = alvo_aluno;
                END IF;

                IF NEW.questao_id <> OLD.questao_id OR NEW.aluno_id <> OLD.aluno_id THEN
                    SET atividade_relacionada_antiga = (SELECT atividade_id FROM questoes_atividade WHERE id = OLD.questao_id);

                    IF atividade_relacionada_antiga IS NOT NULL THEN
                        SET nota_total_calculada = IFNULL((
                            SELECT SUM(qaa.nota_obtida)
                            FROM questoes_atividade_aluno qaa
                            INNER JOIN questoes_atividade qa ON qa.id = qaa.questao_id
                            WHERE qa.atividade_id = atividade_relacionada_antiga
                              AND qaa.aluno_id = OLD.aluno_id
                              AND qaa.status <> 'anulada'
                        ), 0);

                        UPDATE atividade_aluno
                        SET nota_total = nota_total_calculada
                        WHERE atividade_id = atividade_relacionada_antiga AND aluno_id = OLD.aluno_id;
                    END IF;
                END IF;
            END;
        SQL);

        DB::unprepared(<<<SQL
            CREATE TRIGGER trg_questoes_atividade_aluno_after_delete
            AFTER DELETE ON questoes_atividade_aluno
            FOR EACH ROW
            BEGIN
                DECLARE atividade_relacionada BIGINT;
                DECLARE nota_total_calculada DECIMAL(10,2);

                SET atividade_relacionada = (SELECT atividade_id FROM questoes_atividade WHERE id = OLD.questao_id);

                IF atividade_relacionada IS NOT NULL THEN
                    SET nota_total_calculada = IFNULL((
                        SELECT SUM(qaa.nota_obtida)
                        FROM questoes_atividade_aluno qaa
                        INNER JOIN questoes_atividade qa ON qa.id = qaa.questao_id
                        WHERE qa.atividade_id = atividade_relacionada
                          AND qaa.aluno_id = OLD.aluno_id
                          AND qaa.status <> 'anulada'
                    ), 0);

                    UPDATE atividade_aluno
                    SET nota_total = nota_total_calculada
                    WHERE atividade_id = atividade_relacionada AND aluno_id = OLD.aluno_id;
                END IF;
            END;
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS trg_questoes_atividade_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_questoes_atividade_before_update');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_questoes_atividade_aluno_after_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_questoes_atividade_aluno_after_update');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_questoes_atividade_aluno_after_delete');

        Schema::dropIfExists('questoes_atividade_aluno');
        Schema::dropIfExists('questoes_atividade');
        Schema::dropIfExists('atividade_aluno');
        Schema::dropIfExists('atividade');
        Schema::dropIfExists('atividade_tipos');
    }
};
