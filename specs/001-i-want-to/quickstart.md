# Quickstart Test Scenarios

**Feature**: TheFavrs Website Recreation
**Date**: 2025-01-14
**Branch**: 001-i-want-to

## Prerequisites

1. **Environment Setup**
   ```bash
   # Clone repository
   git clone https://github.com/thefavrs/website.git
   cd website

   # Install dependencies
   npm install

   # Set up environment variables
   cp .env.example .env.local
   # Add Supabase and Resend keys to .env.local
   ```

2. **Database Setup**
   ```bash
   # Run Supabase migrations
   npx supabase db reset
   npx supabase db seed
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

## Test Scenario 1: Homepage Visitor Journey

**Objective**: Verify visitor can view company information and services

### Steps:
1. Navigate to http://localhost:3000
2. Verify page loads with TheFavrs logo and navigation
3. Scroll to view hero section with tagline
4. Verify four service offerings are displayed:
   - Custom Branded Events For Venues
   - Software That Helps You Reach Your Customers
   - Build You a Beautiful & Professional Website
   - We Help You Make More Sales
5. Scroll to "Who We Are" section
6. Verify founder profiles are displayed:
   - Will Bridges - Co-Founder
   - Joe Major - Co-Founder

### Expected Results:
- [ ] Page loads in <3 seconds
- [ ] All content sections visible
- [ ] Images load properly
- [ ] Mobile responsive design works
- [ ] No console errors

## Test Scenario 2: Contact Form Submission

**Objective**: Verify contact form submission flow

### Steps:
1. Click "Book a Consultation" button in header
2. Scroll to contact form section
3. Fill in form with test data:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Phone: (615) 555-0123
   - Message: I need help with a custom event
4. Click Submit button
5. Wait for submission confirmation

### Expected Results:
- [ ] Form validates required fields
- [ ] Phone number format accepted
- [ ] Email validation works
- [ ] Success message displayed
- [ ] Data saved to database
- [ ] Admin notification email sent

### Error Cases:
1. Submit with empty required fields
   - [ ] Error messages shown for each field
2. Submit with invalid email
   - [ ] Email validation error shown
3. Submit with invalid phone
   - [ ] Phone validation error shown
4. Submit spam (fill honeypot field via console)
   - [ ] Submission rejected silently

## Test Scenario 3: Newsletter Signup

**Objective**: Verify newsletter subscription flow

### Steps:
1. Scroll to footer newsletter section
2. Enter email: newsletter@example.com
3. Click "Sign Up" button
4. Check for confirmation message
5. Check email for confirmation link
6. Click confirmation link
7. Verify confirmation page loads

### Expected Results:
- [ ] Email field validates format
- [ ] Success message after submission
- [ ] Confirmation email received
- [ ] Confirmation link works
- [ ] Subscriber status updated in database

### Error Cases:
1. Submit invalid email format
   - [ ] Validation error shown
2. Submit existing email
   - [ ] Appropriate message shown
3. Use expired confirmation token
   - [ ] Error message displayed

## Test Scenario 4: Legal Pages Navigation

**Objective**: Verify legal pages are accessible

### Steps:
1. Click "Privacy Policy" link in footer
2. Verify privacy policy page loads
3. Check content is complete
4. Navigate back to homepage
5. Click "Terms & Conditions" link
6. Verify terms page loads
7. Check content is complete

### Expected Results:
- [ ] Privacy policy page loads
- [ ] Terms & conditions page loads
- [ ] Content matches legal requirements
- [ ] Navigation works correctly
- [ ] Page layout consistent

## Test Scenario 5: Mobile Responsiveness

**Objective**: Verify mobile experience

### Steps:
1. Open site on mobile device (or responsive mode)
2. Verify mobile menu toggle works
3. Test navigation menu functionality
4. Scroll through all sections
5. Test contact form on mobile
6. Test newsletter signup on mobile

### Expected Results:
- [ ] Mobile menu toggles correctly
- [ ] Content readable without zooming
- [ ] Forms usable on mobile
- [ ] Images scale properly
- [ ] Touch targets adequate size

## Test Scenario 6: Performance & SEO

**Objective**: Verify performance metrics and SEO

### Steps:
1. Run Lighthouse audit
2. Check Core Web Vitals:
   - LCP (Largest Contentful Paint) < 2.5s
   - FID (First Input Delay) < 100ms
   - CLS (Cumulative Layout Shift) < 0.1
3. Verify meta tags present
4. Check sitemap.xml exists
5. Verify robots.txt configured

### Expected Results:
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Meta tags present on all pages
- [ ] Sitemap accessible
- [ ] Robots.txt properly configured

## Test Scenario 7: Accessibility

**Objective**: Verify WCAG 2.1 AA compliance

### Steps:
1. Run axe DevTools scan
2. Test keyboard navigation
3. Test with screen reader
4. Verify color contrast ratios
5. Check alt text on images

### Expected Results:
- [ ] No critical accessibility issues
- [ ] All interactive elements keyboard accessible
- [ ] Screen reader announces content properly
- [ ] Color contrast meets WCAG AA
- [ ] All images have alt text

## Test Scenario 8: Cross-Browser Compatibility

**Objective**: Verify functionality across browsers

### Browsers to Test:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Expected Results:
- [ ] Layout consistent across browsers
- [ ] Forms work in all browsers
- [ ] No JavaScript errors
- [ ] CSS renders correctly

## Test Scenario 9: Error Handling

**Objective**: Verify graceful error handling

### Steps:
1. Disconnect internet and try form submission
2. Submit form with rate limiting (multiple rapid submissions)
3. Navigate to non-existent page (/random-404)
4. Test with JavaScript disabled

### Expected Results:
- [ ] Offline message shown appropriately
- [ ] Rate limiting message displayed
- [ ] 404 page displayed for invalid routes
- [ ] Basic functionality works without JS

## Test Scenario 10: Admin Preview (Future)

**Objective**: Verify CMS functionality (Phase 2)

### Steps:
1. Log in as admin
2. Navigate to content management
3. Edit homepage content
4. Preview changes
5. Publish changes
6. Verify live site updated

### Expected Results:
- [ ] Admin authentication works
- [ ] Content editable
- [ ] Preview functionality works
- [ ] Published changes appear live
- [ ] Audit trail maintained

## Automated Test Commands

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all

# Run specific test scenario
npm run test:e2e -- --grep "Homepage Visitor Journey"
```

## Performance Benchmarks

| Metric | Target | Acceptable | Current |
|--------|--------|------------|---------|
| Page Load Time | < 2s | < 3s | TBD |
| Time to Interactive | < 3s | < 5s | TBD |
| Lighthouse Score | > 95 | > 90 | TBD |
| Bundle Size | < 200KB | < 300KB | TBD |

## Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificate active
- [ ] DNS configured
- [ ] Monitoring setup
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Backup strategy in place
- [ ] Rollback plan documented

## Support Contacts

- **Technical Issues**: will@thefavrs.com
- **Content Updates**: admin@thefavrs.com
- **Emergency**: (615) 944-8853

---

This quickstart guide provides comprehensive test scenarios to validate the TheFavrs website functionality before and after deployment.