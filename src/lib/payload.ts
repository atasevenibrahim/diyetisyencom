import { cache } from 'react'
import { getPayload, type Payload } from 'payload'

import config from '@payload-config'

// İstek başına tekilleştirilen Payload local API istemcisi (RSC içinde kullanılır).
export const getPayloadClient = cache(async (): Promise<Payload> => getPayload({ config }))

export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings' })
})

export const getServices = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    limit: 100,
    sort: 'order',
    depth: 1,
  })
  return docs
})

export const getPackages = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'packages',
    limit: 100,
    sort: 'order',
  })
  return docs
})

export const getDevices = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'devices',
    limit: 100,
    sort: 'order',
    depth: 1,
  })
  return docs
})

export const getTestimonials = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'testimonials',
    where: { consent: { equals: true } },
    limit: 12,
    sort: '-date',
  })
  return docs
})

export const getFaqs = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'faqs',
    limit: 100,
    sort: 'order',
  })
  return docs
})

export const getServiceBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

export const getDeviceBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'devices',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

export const getBlogPosts = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'blog-posts',
    limit: 100,
    sort: '-publishedAt',
    depth: 1,
  })
  return docs
})

export const getBlogPostBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

// --- Randevu ---

export const getActiveAppointmentTypes = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'appointment-types',
    where: { active: { equals: true } },
    sort: 'order',
    limit: 100,
  })
  return docs
})

export const getAvailability = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'availability' })
})

export const getScheduleExceptions = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'schedule-exceptions', limit: 500 })
  return docs
})

// Belirli bir gündeki aktif (slotu işgal eden) randevular. Cache'lenmez (sık değişir).
export async function getActiveAppointmentsForDate(date: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'appointments',
    where: {
      and: [
        { date: { equals: date } },
        { status: { in: ['pending', 'confirmed', 'completed'] } },
      ],
    },
    limit: 500,
    depth: 0,
  })
  return docs
}

export async function getAppointmentByToken(token: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'appointments',
    where: { cancelToken: { equals: token } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
}
