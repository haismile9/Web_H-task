<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('projects', function (Blueprint $table) {
        $table->string('background_url')->nullable()->after('description');
    });
}

public function down()
{
    Schema::table('projects', function (Blueprint $table) {
        $table->dropColumn('background_url');
    });
}

};
