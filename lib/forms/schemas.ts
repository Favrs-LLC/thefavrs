import { z } from 'zod'

// Contact form validation schema
export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(100, 'First name must be less than 100 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'First name can only contain letters, spaces, and hyphens'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(100, 'Last name must be less than 100 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'Last name can only contain letters, spaces, and hyphens'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),
  message: z
    .string()
    .max(5000, 'Message must be less than 5000 characters')
    .optional(),
  honeypot: z
    .string()
    .max(0, 'Please leave this field empty')
    .optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  honeypot: z
    .string()
    .max(0, 'Please leave this field empty')
    .optional(),
})

export type NewsletterFormData = z.infer<typeof newsletterSchema>

// Newsletter unsubscribe schema
export const unsubscribeSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
})

export type UnsubscribeFormData = z.infer<typeof unsubscribeSchema>