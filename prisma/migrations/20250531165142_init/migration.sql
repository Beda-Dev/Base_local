-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hierarchical_id" INTEGER,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email_verified_at" DATETIME,
    "avatar" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "users_hierarchical_id_fkey" FOREIGN KEY ("hierarchical_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "guard_name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "guard_name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "model_type" TEXT NOT NULL DEFAULT 'App\Models\User',
    "model_id" INTEGER NOT NULL,

    PRIMARY KEY ("user_id", "role_id"),
    CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    PRIMARY KEY ("role_id", "permission_id"),
    CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "user_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    PRIMARY KEY ("user_id", "permission_id"),
    CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "academic_years" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT 1,
    "isCurrent" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "levels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT 1,
    "class_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "classes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "level_id" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "student_number" TEXT NOT NULL DEFAULT '0',
    "max_student_number" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "classes_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assignment_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "students" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assignment_type_id" INTEGER NOT NULL,
    "registration_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "tutor_name" TEXT NOT NULL,
    "tutor_first_name" TEXT NOT NULL,
    "tutor_number" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "photo" TEXT,
    "sexe" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "students_assignment_type_id_fkey" FOREIGN KEY ("assignment_type_id") REFERENCES "assignment_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tutors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "sexe" TEXT NOT NULL,
    "type_tutor" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "student_tutors" (
    "tutor_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "is_tutor_legal" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,

    PRIMARY KEY ("tutor_id", "student_id"),
    CONSTRAINT "student_tutors_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "student_tutors_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "registrations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "class_id" INTEGER NOT NULL,
    "academic_year_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "registration_date" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "registrations_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "registrations_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "registrations_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "document_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "document_type_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "path" TEXT,
    "active" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "documents_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "document_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "documents_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fee_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pricings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assignment_type_id" INTEGER NOT NULL,
    "academic_years_id" INTEGER NOT NULL,
    "level_id" INTEGER NOT NULL,
    "fee_type_id" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "pricings_assignment_type_id_fkey" FOREIGN KEY ("assignment_type_id") REFERENCES "assignment_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pricings_academic_years_id_fkey" FOREIGN KEY ("academic_years_id") REFERENCES "academic_years" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pricings_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pricings_fee_type_id_fkey" FOREIGN KEY ("fee_type_id") REFERENCES "fee_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "installments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pricing_id" INTEGER NOT NULL,
    "amount_due" TEXT NOT NULL,
    "due_date" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "installments_pricing_id_fkey" FOREIGN KEY ("pricing_id") REFERENCES "pricings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "cash_registers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cash_register_number" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "payments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "student_id" INTEGER NOT NULL,
    "installment_id" INTEGER NOT NULL,
    "cash_register_id" INTEGER NOT NULL,
    "cashier_id" INTEGER NOT NULL,
    "transaction_id" INTEGER,
    "amount" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "payments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payments_installment_id_fkey" FOREIGN KEY ("installment_id") REFERENCES "installments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payments_cash_register_id_fkey" FOREIGN KEY ("cash_register_id") REFERENCES "cash_registers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payments_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payments_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payment_method_payments" (
    "payment_id" INTEGER NOT NULL,
    "payment_method_id" INTEGER NOT NULL,

    PRIMARY KEY ("payment_id", "payment_method_id"),
    CONSTRAINT "payment_method_payments_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "payment_method_payments_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "expense_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expense_type_id" INTEGER NOT NULL,
    "cash_register_id" INTEGER NOT NULL,
    "transaction_id" INTEGER,
    "label" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "expense_date" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "expenses_expense_type_id_fkey" FOREIGN KEY ("expense_type_id") REFERENCES "expense_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "expenses_cash_register_id_fkey" FOREIGN KEY ("cash_register_id") REFERENCES "cash_registers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "expenses_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "validation_expenses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "expense_id" INTEGER NOT NULL,
    "validation_date" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "validation_order" INTEGER NOT NULL,
    "validation_status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "validation_expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "validation_expenses_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "expenses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cash_register_sessions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "cash_register_id" INTEGER NOT NULL,
    "opening_date" TEXT NOT NULL,
    "closing_date" TEXT,
    "opening_amount" TEXT NOT NULL,
    "closing_amount" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "cash_register_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cash_register_sessions_cash_register_id_fkey" FOREIGN KEY ("cash_register_id") REFERENCES "cash_registers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "cash_register_session_id" INTEGER NOT NULL,
    "transaction_date" TEXT NOT NULL,
    "total_amount" TEXT NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_cash_register_session_id_fkey" FOREIGN KEY ("cash_register_session_id") REFERENCES "cash_register_sessions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "registration_number_format" TEXT NOT NULL,
    "establishment_phone_1" TEXT NOT NULL,
    "establishment_phone_2" TEXT,
    "establishment_logo" TEXT,
    "establishment_name" TEXT NOT NULL,
    "approval_number" TEXT,
    "status" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT,
    "longitude" TEXT,
    "latitude" TEXT,
    "expense_approval_level" INTEGER NOT NULL DEFAULT 1,
    "primary_validator" TEXT,
    "currency" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "matters" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "coefficient" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "type_evaluations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "otps" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "otp" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "levels_slug_key" ON "levels"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "assignment_types_slug_key" ON "assignment_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "students_registration_number_key" ON "students"("registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_student_id_academic_year_id_key" ON "registrations"("student_id", "academic_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_types_slug_key" ON "document_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "fee_types_slug_key" ON "fee_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cash_registers_cash_register_number_key" ON "cash_registers"("cash_register_number");

-- CreateIndex
CREATE UNIQUE INDEX "expense_types_slug_key" ON "expense_types"("slug");
