export type NotificationEvent =
  | 'requested'
  | 'confirmed'
  | 'cancelled'
  | 'rescheduled'
  | 'reminder'
  | 'admin_new'

export type NotificationData = {
  event: NotificationEvent
  clientName: string
  clientEmail?: string | null
  clientPhone?: string | null
  typeName: string
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  durationMin: number
  channel: 'online' | 'in_person'
  manageUrl?: string | null
  adminUrl?: string | null
}

export type ChannelKey = 'email' | 'sms' | 'whatsapp'

export type NotificationConfig = {
  senderName: string
  senderEmail: string
  adminEmail?: string | null
  smsHeader?: string | null
  siteName: string
  // olay × kanal aç/kapa
  toggles: Record<NotificationEvent, Record<ChannelKey, boolean>>
}
