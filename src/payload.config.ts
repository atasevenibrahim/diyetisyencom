import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Packages } from './collections/Packages'
import { Devices } from './collections/Devices'
import { BlogPosts } from './collections/BlogPosts'
import { Testimonials } from './collections/Testimonials'
import { Faqs } from './collections/Faqs'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { AppointmentTypes } from './collections/AppointmentTypes'
import { ScheduleExceptions } from './collections/ScheduleExceptions'
import { Appointments } from './collections/Appointments'
import { SiteSettings } from './globals/SiteSettings'
import { Availability } from './globals/Availability'
import { Notifications } from './globals/Notifications'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Services,
    Packages,
    Devices,
    BlogPosts,
    Testimonials,
    Faqs,
    ContactSubmissions,
    AppointmentTypes,
    ScheduleExceptions,
    Appointments,
  ],
  globals: [SiteSettings, Availability, Notifications],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Vercel Postgres adapter: uretimde Vercel Postgres'i (POSTGRES_URL) kullanir.
  // Yerelde connection string localhost icerirse adapter otomatik olarak `pg`
  // pooling'e gecer (bkz. docker-compose.yml ile yerel Postgres).
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
  sharp,
  plugins: [
    // Üretimde (Vercel) medya kalıcılığı için Blob. Token yoksa devre dışı →
    // yerel geliştirmede dosyalar diske yazılır.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
