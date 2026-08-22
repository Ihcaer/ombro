-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "audit";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "blog";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "files";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "team";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "url_manager";

-- CreateEnum
CREATE TYPE "audit"."LogLevel" AS ENUM ('INFO', 'WARN', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "audit"."Modules" AS ENUM ('URL_MANAGER', 'AUTH', 'AUDIT', 'TEAM', 'FILES', 'BLOG');

-- CreateEnum
CREATE TYPE "auth"."Verification" AS ENUM ('VERIFIED', 'WAITING', 'NON_VERIFIED');

-- CreateEnum
CREATE TYPE "auth"."TokenType" AS ENUM ('REGISTER', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "blog"."PostStatus" AS ENUM ('PUBLISHED', 'WAITING', 'SKETCH', 'DELETED');

-- CreateEnum
CREATE TYPE "files"."AccessType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "files"."RelatableType" AS ENUM ('POST');

-- CreateEnum
CREATE TYPE "team"."RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "url_manager"."RedirectCode" AS ENUM ('MOVED_PERMANENTLY_301', 'FOUND_302', 'TEMPORARY_REDIRECT_307', 'PERMANENT_REDIRECT_308');

-- CreateTable
CREATE TABLE "audit"."system_logs" (
    "id" SERIAL NOT NULL,
    "level" "audit"."LogLevel" NOT NULL DEFAULT 'INFO',
    "source" "audit"."Modules" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit"."admin_logs" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER,
    "action" TEXT NOT NULL,
    "module" "audit"."Modules" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER,
    "description" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."admins" (
    "id" SERIAL NOT NULL,
    "displayName" TEXT NOT NULL,
    "handleName" TEXT,
    "avatarFileId" INTEGER,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "privileges" INTEGER NOT NULL,
    "lastLogged" TIMESTAMPTZ(3),
    "verification" "auth"."Verification" NOT NULL DEFAULT 'NON_VERIFIED',
    "isActivated" BOOLEAN NOT NULL DEFAULT true,
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."one_time_tokens" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "type" "auth"."TokenType" NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."refresh_tokens" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog"."posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "heroImageId" INTEGER,
    "modifications" JSONB NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "originalAuthorId" INTEGER,
    "publicAuthorId" INTEGER,
    "editedById" INTEGER,
    "status" "blog"."PostStatus" NOT NULL DEFAULT 'SKETCH',
    "slug" TEXT NOT NULL,
    "publicationDate" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog"."categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdById" INTEGER,
    "editedById" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog"."tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdById" INTEGER,
    "editedById" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files"."files" (
    "id" SERIAL NOT NULL,
    "bucketName" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBites" BIGINT NOT NULL,
    "folderId" INTEGER NOT NULL,
    "authorId" INTEGER,
    "editedById" INTEGER,
    "accessType" "files"."AccessType" NOT NULL,
    "isListed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files"."folders" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "parentId" INTEGER,
    "authorId" INTEGER,
    "editedById" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files"."file_usage" (
    "id" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "relatableType" "files"."RelatableType" NOT NULL,
    "relatableId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team"."approval_requests" (
    "id" SERIAL NOT NULL,
    "requesterId" INTEGER NOT NULL,
    "actionType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER,
    "payload" JSONB NOT NULL,
    "status" "team"."RequestStatus" NOT NULL,
    "requiredApprovals" SMALLINT NOT NULL DEFAULT 3,
    "receivedApprovals" SMALLINT NOT NULL DEFAULT 0,
    "expiredAt" TIMESTAMPTZ(3) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "approval_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team"."approval_responses" (
    "id" SERIAL NOT NULL,
    "approvalRequestId" INTEGER NOT NULL,
    "approverId" INTEGER,
    "decision" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approval_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "url_manager"."redirects" (
    "id" SERIAL NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "redirectType" "url_manager"."RedirectCode" NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redirects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog"."_BlogPostToBlogTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BlogPostToBlogTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "admin_logs_adminId_idx" ON "audit"."admin_logs"("adminId");

-- CreateIndex
CREATE INDEX "admin_logs_action_idx" ON "audit"."admin_logs"("action");

-- CreateIndex
CREATE UNIQUE INDEX "admins_handleName_key" ON "auth"."admins"("handleName");

-- CreateIndex
CREATE UNIQUE INDEX "admins_avatarFileId_key" ON "auth"."admins"("avatarFileId");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "auth"."admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "one_time_tokens_hashedToken_key" ON "auth"."one_time_tokens"("hashedToken");

-- CreateIndex
CREATE INDEX "one_time_tokens_expiresAt_idx" ON "auth"."one_time_tokens"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "one_time_tokens_adminId_type_key" ON "auth"."one_time_tokens"("adminId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_refreshTokenHash_key" ON "auth"."refresh_tokens"("refreshTokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "auth"."refresh_tokens"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "posts_categoryId_slug_key" ON "blog"."posts"("categoryId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "blog"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "blog"."categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "blog"."tags"("name");

-- CreateIndex
CREATE INDEX "files_folderId_idx" ON "files"."files"("folderId");

-- CreateIndex
CREATE UNIQUE INDEX "files_bucketName_objectKey_filename_key" ON "files"."files"("bucketName", "objectKey", "filename");

-- CreateIndex
CREATE INDEX "folders_parentId_idx" ON "files"."folders"("parentId");

-- CreateIndex
CREATE INDEX "file_usage_fileId_relatableId_idx" ON "files"."file_usage"("fileId", "relatableId");

-- CreateIndex
CREATE UNIQUE INDEX "file_usage_fileId_relatableType_relatableId_key" ON "files"."file_usage"("fileId", "relatableType", "relatableId");

-- CreateIndex
CREATE INDEX "approval_requests_requesterId_idx" ON "team"."approval_requests"("requesterId");

-- CreateIndex
CREATE INDEX "approval_requests_status_idx" ON "team"."approval_requests"("status");

-- CreateIndex
CREATE INDEX "approval_responses_approvalRequestId_idx" ON "team"."approval_responses"("approvalRequestId");

-- CreateIndex
CREATE INDEX "approval_responses_approverId_idx" ON "team"."approval_responses"("approverId");

-- CreateIndex
CREATE UNIQUE INDEX "redirects_sourceUrl_key" ON "url_manager"."redirects"("sourceUrl");

-- CreateIndex
CREATE INDEX "_BlogPostToBlogTag_B_index" ON "blog"."_BlogPostToBlogTag"("B");

-- AddForeignKey
ALTER TABLE "audit"."admin_logs" ADD CONSTRAINT "admin_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "auth"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."admins" ADD CONSTRAINT "admins_avatarFileId_fkey" FOREIGN KEY ("avatarFileId") REFERENCES "files"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."one_time_tokens" ADD CONSTRAINT "one_time_tokens_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "auth"."admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "auth"."admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."posts" ADD CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "blog"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."posts" ADD CONSTRAINT "posts_originalAuthorId_fkey" FOREIGN KEY ("originalAuthorId") REFERENCES "auth"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."posts" ADD CONSTRAINT "posts_publicAuthorId_fkey" FOREIGN KEY ("publicAuthorId") REFERENCES "auth"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."posts" ADD CONSTRAINT "posts_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "auth"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."posts" ADD CONSTRAINT "posts_heroImageId_fkey" FOREIGN KEY ("heroImageId") REFERENCES "files"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."categories" ADD CONSTRAINT "categories_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "auth"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."categories" ADD CONSTRAINT "categories_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "auth"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."tags" ADD CONSTRAINT "tags_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "auth"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."tags" ADD CONSTRAINT "tags_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "auth"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files"."files" ADD CONSTRAINT "files_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "files"."folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files"."files" ADD CONSTRAINT "files_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "auth"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files"."files" ADD CONSTRAINT "files_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "auth"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files"."folders" ADD CONSTRAINT "folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "files"."folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files"."folders" ADD CONSTRAINT "folders_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "auth"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files"."folders" ADD CONSTRAINT "folders_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "auth"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files"."file_usage" ADD CONSTRAINT "file_usage_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"."files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team"."approval_requests" ADD CONSTRAINT "approval_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "auth"."admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team"."approval_responses" ADD CONSTRAINT "approval_responses_approvalRequestId_fkey" FOREIGN KEY ("approvalRequestId") REFERENCES "team"."approval_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team"."approval_responses" ADD CONSTRAINT "approval_responses_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "auth"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."_BlogPostToBlogTag" ADD CONSTRAINT "_BlogPostToBlogTag_A_fkey" FOREIGN KEY ("A") REFERENCES "blog"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."_BlogPostToBlogTag" ADD CONSTRAINT "_BlogPostToBlogTag_B_fkey" FOREIGN KEY ("B") REFERENCES "blog"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
