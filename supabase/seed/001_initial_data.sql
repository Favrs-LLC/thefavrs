-- Seed data for TheFavrs website
-- Based on content from original thefavrs.com

-- Insert team members (founders)
INSERT INTO team_members (name, role, bio, display_order, is_active) VALUES
('Will Bridges', 'Co-Founder', 'is an engineering leader and entrepreneur with over 25 years of experience in software development, team management, and technology strategy. Known for delivering results across startups and established companies alike, Will has led agile transformations, managed global teams, and overseen the successful deployment of complex systems with a focus on reliability and efficiency. An advocate for AI-driven productivity and modern development practices, he combines deep technical expertise with strong business acumen—negotiating partnerships, optimizing processes, and launching ventures in both technology and entertainment spaces. Based in Nashville, he brings a collaborative, hands-on approach to solving real-world problems and building high-performing teams', 1, true),
('Joe Major', 'Co-Founder', 'is a Chicago-born, Nashville-based host, promoter, and radio personality with over 15 years of experience in the entertainment industry. Recognized as an expert nightlife strategist and creative consultant, he has produced and hosted branded events for leading venues, developed marketing campaigns, and collaborated with top-tier artists including Megan Thee Stallion, Cardi B, Migos, and 2 Chainz. Joe is known for his ability to craft immersive, community-driven experiences that strengthen audience engagement and deliver measurable results for partners and brands alike. Currently, he curates and hosts a roster of high-profile weekly events across Nashville, bringing a professional approach and unmistakable energy to every project he touches.', 2, true);

-- Insert service offerings
INSERT INTO service_offerings (title, description, icon, display_order, is_active) VALUES
('Custom Branded Events For Venues', 'We create unforgettable branded experiences that strengthen venue identity and build loyal audiences. From concept to execution, our team handles event planning, artist coordination, and marketing campaigns that deliver measurable results for entertainment venues.', 'calendar', 1, true),
('Software That Helps You Reach Your Customers', 'Custom software solutions designed to connect businesses with their target audiences. We build applications, platforms, and tools that streamline operations while enhancing customer engagement and driving growth.', 'code', 2, true),
('Build You a Beautiful & Professional Website', 'Modern, responsive websites that represent your brand professionally online. Our web development services focus on performance, user experience, and conversion optimization to help your business succeed in the digital space.', 'globe', 3, true),
('We Help You Make More Sales', 'Strategic sales and marketing consulting that drives revenue growth. We analyze your current processes, identify opportunities, and implement systems that increase conversion rates and customer lifetime value.', 'trending-up', 4, true);

-- Insert initial page content
INSERT INTO page_content (slug, title, content, metadata) VALUES
('privacy-policy', 'Privacy Policy', 'Effective: July 6, 2025

## About Us

"We", "us" or "our" means Favrs, LLC, with its principal place of business located at 4015 TRAVIS DRIVE STE 211 1976, NASHVILLE, TN US 37211.

## About This Privacy Policy

Your privacy is important to us, so we''ve developed this Privacy Policy, which explains how we collect, use, and disclose your personal information. We collect personal information when you use our website(s), mobile apps, and other online and offline products, services and experiences (collectively, the "Services"). Please take a moment to read through this Policy in its entirety.

If you have any questions, concerns or complaints regarding this Privacy Policy or how we use your personal information please contact us via e-mail at will@thefavrs.com.

## What Personal Information We Collect and How We Collect It?

"We collect personal information that you provide directly to us:"

Contact information. If you sign up to receive our newsletter, emails, or text messages from us, we will collect your name, email address, mailing address, phone number, and any other information needed to contact you about the Services.

Payment information. To order products or services through the Services, you will need to provide us with payment information (like your bank account or credit card information). Please note that your financial information is collected and stored by a third party payment processing company. Use and storage of that information is governed by the third party payment processor''s applicable privacy policy.

Survey information. You may provide us with other personal information when you fill in a form, respond to our surveys or questionnaires, provide us with feedback, participate in promotions, or use other features of the Services.

## How We Use Your Personal Information?

"We use the personal information we collect for the following reasons:"

• To send you our newsletter, or other information or marketing about our Services that you think may be of interest to you.
• To reply to your questions, inquiries, or customer service requests or to send you notices, updates, security alerts, or support and administrative messages.
• To provide you with information about the Services that you request from us or which we feel may interest you.
• To monitor and analyze trends, usage and activities in connection with our Services and to improve the Services.
• To facilitate contests, sweepstakes and promotions, and to process entries and provide prizes and rewards.
• To detect, investigate and prevent fraudulent transactions and other illegal activities on the Services and to protect the rights and property of us and our customers.
• To carry out our obligations arising from any contracts entered into between you and us, including for billing and collection.

## Contact Us

If you have questions or concerns about the information in this Privacy Policy, our handling of your personal information, or your choices and rights regarding such use, please do not hesitate to contact us at:

Favrs, LLC
4015 TRAVIS DRIVE STE 211 1976, NASHVILLE, TN US 37211
will@thefavrs.com', '{"description": "Privacy Policy for TheFavrs", "lastUpdated": "2025-07-06"}'),

('terms-conditions', 'Terms & Conditions', '# Favrs, LLC

4015 TRAVIS DRIVE STE 211 1976, NASHVILLE, TN 37211
will@thefavrs.com
6159448853

## Messaging Terms & Conditions

Favrs, LLC | 4015 TRAVIS DRIVE STE 211 1976, NASHVILLE, TN 37211

### General

When you opt-in to the service, we will send you a message to confirm your signup.

By opting into messages, you agree to receive recurring automated marketing and informational text messages from Favrs, LLC. Automated messages may be sent using an automatic telephone dialing system to the mobile telephone number you provided when signing up or any other number that you designate.

Message frequency varies, and additional mobile messages may be sent periodically based on your interaction with Favrs, LLC. Favrs, LLC reserves the right to alter the frequency of messages sent at any time to increase or decrease the total number of sent messages. Favrs, LLC also reserves the right to change the short code or phone number or alphanumeric sender where messages are sent

Your usual message and data rates may apply. If you have any questions about your text plan or data plan, it is best to contact your mobile provider. Your mobile provider is not liable for delayed or undelivered messages.

Your consent to receive marketing messages is not a condition of purchase.

### Cancellation

Messages will provide instructions to unsubscribe either by texting STOP or through an included link. After you unsubscribe, we will send you a message to confirm that you have been unsubscribed and no more messages will be sent. If you would like to receive messages from Favrs, LLC again, just sign up as you did the first time and Favrs, LLC will start sending messages to you again.

### Contact

For support regarding our services, email us at will@thefavrs.com or, if supported, text "HELP" to 6159448853 at any time and we will respond with instructions on how to unsubscribe. If we include a link in messages we send you from Favrs, LLC, you may also access instructions on how to unsubscribe and our company information by following that link.', '{"description": "Terms and Conditions for TheFavrs", "lastUpdated": "2025-01-14"}');