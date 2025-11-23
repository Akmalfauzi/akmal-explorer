import { sql } from 'drizzle-orm';
import { files, folders } from '@/infrastructure/db/schema';
import { db } from '@/infrastructure/db';

const generateId = () => crypto.randomUUID();

const CONFIG = {
  ROOT_FOLDERS: 200,
  SUBFOLDERS_PER_ROOT: 5,
  FILES_PER_FOLDER: 2,
  BATCH_SIZE: 1000
};

const FILE_TYPES = [
  { extension: 'pdf', mimeType: 'application/pdf' },
  { extension: 'jpg', mimeType: 'image/jpeg' },
  { extension: 'png', mimeType: 'image/png' },
  { extension: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { extension: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { extension: 'txt', mimeType: 'text/plain' },
  { extension: 'mp4', mimeType: 'video/mp4' },
  { extension: 'mp3', mimeType: 'audio/mpeg' }
];

const getRandomFileType = () => FILE_TYPES[Math.floor(Math.random() * FILE_TYPES.length)]!;

async function main() {
  const startTime = performance.now();
  console.log(`🚀 Starting database seeding...`);

  try {
    console.log("🧹 Cleaning old data...");
    await db.execute(sql`TRUNCATE TABLE ${files}, ${folders} RESTART IDENTITY CASCADE`);

    console.log(`📁 Creating ${CONFIG.ROOT_FOLDERS} root folders...`);
    
    const rootFolderIds: string[] = [];
    let folderBuffer: any[] = [];
    let fileBuffer: any[] = [];
    
    let totalFoldersCreated = 0;
    let totalFilesCreated = 0;

    for (let i = 0; i < CONFIG.ROOT_FOLDERS; i++) {
      const rootId = generateId();
      rootFolderIds.push(rootId);
      
      folderBuffer.push({
        id: rootId,
        name: `Root Folder ${String(i + 1).padStart(3, '0')}`,
        path: '/',
        depth: 0
      });
      totalFoldersCreated++;

      for (let j = 0; j < CONFIG.FILES_PER_FOLDER; j++) {
        const fileType = getRandomFileType();
        fileBuffer.push({
          id: generateId(),
          name: `file_${j + 1}.${fileType.extension}`,
          folderId: rootId,
          size: Math.floor(Math.random() * 5000000),
          extension: fileType.extension,
          mimeType: fileType.mimeType
        });
        totalFilesCreated++;
      }

      if (folderBuffer.length >= CONFIG.BATCH_SIZE) {
        await insertInBatches(folders, folderBuffer);
        folderBuffer = [];
      }

      if (fileBuffer.length >= CONFIG.BATCH_SIZE) {
        await insertInBatches(files, fileBuffer);
        fileBuffer = [];
      }
    }

    if (folderBuffer.length > 0) await insertInBatches(folders, folderBuffer);
    if (fileBuffer.length > 0) await insertInBatches(files, fileBuffer);

    console.log(`✅ Created ${CONFIG.ROOT_FOLDERS} root folders with files`);

    console.log(`📂 Creating subfolders...`);
    
    folderBuffer = [];
    fileBuffer = [];

    for (const rootId of rootFolderIds) {
      for (let i = 0; i < CONFIG.SUBFOLDERS_PER_ROOT; i++) {
        const subfolderId = generateId();
        
        folderBuffer.push({
          id: subfolderId,
          name: `Subfolder ${String(i + 1).padStart(2, '0')}`,
          parentId: rootId,
          path: `/${rootId}/`,
          depth: 1
        });
        totalFoldersCreated++;

        for (let j = 0; j < CONFIG.FILES_PER_FOLDER; j++) {
          const fileType = getRandomFileType();
          fileBuffer.push({
            id: generateId(),
            name: `document_${j + 1}.${fileType.extension}`,
            folderId: subfolderId,
            size: Math.floor(Math.random() * 5000000),
            extension: fileType.extension,
            mimeType: fileType.mimeType
          });
          totalFilesCreated++;
        }

        if (folderBuffer.length >= CONFIG.BATCH_SIZE) {
          await insertInBatches(folders, folderBuffer);
          folderBuffer = [];
          
          if (fileBuffer.length > 0) {
            await insertInBatches(files, fileBuffer);
            fileBuffer = [];
          }
          
          process.stdout.write(`\rCreating folders... ${totalFoldersCreated}`);
        }
      }
    }

    if (folderBuffer.length > 0) await insertInBatches(folders, folderBuffer);
    if (fileBuffer.length > 0) await insertInBatches(files, fileBuffer);

    console.log("\n-------------------------------------------");
    console.log(`✅ Seeding complete!`);
    console.log(`📁 Total folders: ${totalFoldersCreated.toLocaleString()}`);
    console.log(`📄 Total files: ${totalFilesCreated.toLocaleString()}`);
    console.log(`📊 Total records: ${(totalFoldersCreated + totalFilesCreated).toLocaleString()}`);
    const duration = (performance.now() - startTime) / 1000;
    console.log(`⏱️  Duration: ${duration.toFixed(2)}s`);

    process.exit(0);

  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

async function insertInBatches(table: any, data: any[]) {
  if (data.length === 0) return;
  await db.insert(table).values(data);
}

main();