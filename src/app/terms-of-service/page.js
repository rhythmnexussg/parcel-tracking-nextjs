'use client';

import { Navigation } from '../../components/Navigation';
import { useLanguage } from '../../LanguageContext';
import { policyText } from '../../lib/policyI18n';
import { getLocalizedPolicyDate, getTermsUiLabels } from '../../lib/policyUiI18n';

const normalizeLang = (language) => {
  const code = (language || 'en').toLowerCase();
  if (code === 'iw') return 'he';
  if (code === 'fil') return 'tl';
  if (code === 'zh-cn' || code === 'zh-hans') return 'zh';
  if (code === 'zh-tw' || code === 'zh-hant') return 'zh-hant';
  if (code === 'zh-hk' || code === 'yue') return 'zh-hant';
  if (code.startsWith('nb') || code.startsWith('nn')) return 'no';
  return code;
};

export default function TermsOfServicePage() {
  const { t, language } = useLanguage();
  const p = policyText(language);
  const isEnglish = normalizeLang(language) === 'en';
  const ui = getTermsUiLabels(language);
  const localizedDate = getLocalizedPolicyDate(language);
  const parseSections = (value = '') => {
    if (value.includes('|||')) {
      return value.split('|||').map((s) => s.trim()).filter(Boolean);
    }
    return value.split(/(?<=[.!?])\s+/).filter(Boolean);
  };

  const termSentences = parseSections(p.termsText);
  const supplementSentences = parseSections(p.termsSupplement);

  const sectionText = (index, fallback = '') => termSentences[index] || fallback;
  const supplementText = (index, fallback = '') => supplementSentences[index] || fallback;

  const termsHeading = isEnglish ? 'TERMS OF SERVICE' : p.termsTitle;

  return (
    <>
      <Navigation />
      <div className="container mt-5">
        <div className="blog-content-card rates-card">
          {isEnglish ? (
            <>
              <h1>TERMS OF SERVICE</h1>

              <p><strong>{ui.effectiveDate}:</strong> {localizedDate}</p>

              <p><strong>{ui.lastUpdated}:</strong> {localizedDate}</p>

              <p>
                These Terms of Service (“Terms”) govern your access to and use of the e-commerce services offered through
                {' '}
                <a href="https://rhythmnexus.org" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                  https://rhythmnexus.org
                </a>
                {' '}
                (“Website”) operated by Rhythm Nexus (“we”, “us”, or “our”).
              </p>

              <p>
                By accessing, browsing, or purchasing from the Website, you agree to be bound by these Terms. If you do not agree,
                you may not use the Website or place an order.
              </p>

              <h2>1. {ui.sectionTitles[0]}</h2>
              <p>
                You must be at least 18 years old or the age of majority in your jurisdiction to purchase products from this Website.
                By placing an order, you represent and warrant that you meet this requirement.
              </p>

              <h2>2. {ui.sectionTitles[1]}</h2>
              <p>You may be asked to create an account to make a purchase.</p>
              <p>You agree to provide accurate, current, and complete information.</p>
              <p>You are responsible for safeguarding your account credentials.</p>
              <p>You must notify us immediately of any unauthorized use.</p>
              <p>We may terminate or suspend your account at any time for violations of these Terms.</p>

              <h2>3. {ui.sectionTitles[2]}</h2>
              <h3>3.1 {ui.subsectionTitles.productInformation}</h3>
              <p>
                We strive to display product information accurately, but we do not warrant that product descriptions or other content
                are error-free.
              </p>

              <h3>3.2 {ui.subsectionTitles.pricing}</h3>
              <p>Prices are shown in United States Dollar (USD) and include applicable taxes where required by law.</p>
              <p>We may change prices at any time before you place an order.</p>

              <h3>3.3 {ui.subsectionTitles.orderAcceptance}</h3>
              <p>
                Your order is an offer to buy. Acceptance occurs when we confirm your order by email, or when we ship the products,
                whichever happens first.
              </p>
              <p>We may decline or cancel orders for reasons including:</p>
              <ul>
                <li>Incorrect pricing</li>
                <li>Out-of-stock products</li>
                <li>Suspected fraud</li>
              </ul>

              <h2>4. {ui.sectionTitles[3]}</h2>
              <p>We accept the payment methods shown during checkout.</p>
              <p>By submitting payment details, you:</p>
              <ul>
                <li>Authorize us to charge the amount due</li>
                <li>Confirm you are the rightful account holder</li>
              </ul>
              <p>We use third-party payment processors to securely handle payment information.</p>

              <h2>5. {ui.sectionTitles[4]}</h2>
              <p>Shipping estimates are provided for convenience and do not guarantee delivery dates.</p>
              <p>Once products are transferred to a carrier, risk of loss passes to you.</p>
              <p>You are responsible for:</p>
              <ul>
                <li>Customs duties and import taxes</li>
                <li>Delivery errors caused by incorrect address information</li>
              </ul>

              <h2>6. {ui.sectionTitles[5]}</h2>
              <h3>6.1 {ui.subsectionTitles.euWithdrawal}</h3>
              <p>
                If you reside in the EU, EEA, or Switzerland, you have the legal right to return products within 14 days of receipt
                for a full refund.
              </p>
              <p>Conditions:</p>
              <ul>
                <li>Products must be returned in original condition</li>
                <li>Return shipping may be at your cost as allowed by law</li>
                <li>
                  Digital products may be excluded if:
                  <ul>
                    <li>The download begins with your consent, and</li>
                    <li>You acknowledge loss of right of withdrawal</li>
                  </ul>
                </li>
              </ul>

              <h3>6.2 {ui.subsectionTitles.usaCustomers}</h3>
              <p>
                Return eligibility for US customers is outlined in our separate Return &amp; Refund Policy posted on the Website.
                Some items (e.g., digital downloads, personalized items) may be non-refundable.
              </p>

              <h2>7. {ui.sectionTitles[6]}</h2>
              <p>If you purchase digital items:</p>
              <ul>
                <li>Delivery is electronic</li>
                <li>You are granted a personal, non-exclusive license to use the content</li>
                <li>You may not redistribute, resell, or share downloads without permission</li>
              </ul>

              <h2>8. {ui.sectionTitles[7]}</h2>
              <p>
                All Website content (text, designs, software, graphics, images) is owned by or licensed to Rhythm Nexus and protected
                by copyright and intellectual property laws.
              </p>
              <p>You may not:</p>
              <ul>
                <li>Reproduce</li>
                <li>Modify</li>
                <li>Distribute</li>
                <li>Create derivative works</li>
              </ul>
              <p>without written permission.</p>

              <h2>9. {ui.sectionTitles[8]}</h2>
              <p>To the maximum extent permitted by applicable law:</p>
              <p>We are not liable for:</p>
              <ul>
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of data</li>
                <li>Lost profits</li>
                <li>Business interruption</li>
              </ul>
              <p>Our total liability shall not exceed the amount you paid for the product(s) purchased.</p>

              <p>For consumers in the EU/EEA/Switzerland, mandatory statutory rights are unaffected.</p>

              <h2>10. {ui.sectionTitles[9]}</h2>
              <p>These Terms are governed by the laws of [Your Jurisdiction] without regard to conflict of law principles.</p>

              <p>EU/EEA/Swiss users may have additional protections under local law that cannot be waived.</p>

              <h2>11. {ui.sectionTitles[10]}</h2>
              <h3>11.1 {ui.subsectionTitles.euUsers}</h3>
              <p>
                You may access the EU Online Dispute Resolution platform:
                {' '}
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>

              <h3>11.2 {ui.subsectionTitles.usaUsers}</h3>
              <p>Disputes may be resolved through:</p>
              <ul>
                <li>Negotiation</li>
                <li>Arbitration (if agreed)</li>
                <li>Court action in your jurisdiction</li>
              </ul>

              <h2>12. {ui.sectionTitles[11]}</h2>
              <p>We may update these Terms. The revised version will be posted at this URL with a new effective date.</p>
            </>
          ) : (
            <>
              <h1>{termsHeading}</h1>

              <p><strong>{ui.effectiveDate}:</strong> {localizedDate}</p>
              <p><strong>{ui.lastUpdated}:</strong> {localizedDate}</p>

              <p>{sectionText(0, p.termsText)}</p>

              <h2>1. {ui.sectionTitles[0]}</h2>
              <p>{sectionText(1, p.termsText)}</p>

              <h2>2. {ui.sectionTitles[1]}</h2>
              <p>{sectionText(2, p.termsText)}</p>

              <h2>3. {ui.sectionTitles[2]}</h2>
              <h3>3.1 {ui.subsectionTitles.productInformation}</h3>
              <p>{sectionText(3, p.termsText)}</p>
              <h3>3.2 {ui.subsectionTitles.pricing}</h3>
              <p>{sectionText(4, p.termsText)}</p>
              <h3>3.3 {ui.subsectionTitles.orderAcceptance}</h3>
              <p>{sectionText(5, p.termsText)}</p>

              <h2>4. {ui.sectionTitles[3]}</h2>
              <p>{sectionText(6, p.termsText)}</p>

              <h2>5. {ui.sectionTitles[4]}</h2>
              <p>{sectionText(7, p.termsText)}</p>

              <h2>6. {ui.sectionTitles[5]}</h2>
              <h3>6.1 {ui.subsectionTitles.euWithdrawal}</h3>
              <p>{sectionText(8, p.termsText)}</p>
              <h3>6.2 {ui.subsectionTitles.usaCustomers}</h3>
              <p>{sectionText(9, p.termsText)}</p>

              <h2>7. {ui.sectionTitles[6]}</h2>
              <p>{sectionText(10, p.termsText)}</p>

              <h2>8. {ui.sectionTitles[7]}</h2>
              <p>{sectionText(11, p.termsText)}</p>

              <h2>9. {ui.sectionTitles[8]}</h2>
              <p>{supplementText(0, p.termsSupplement)}</p>

              <h2>10. {ui.sectionTitles[9]}</h2>
              <p>{supplementText(1, p.termsSupplement)}</p>

              <h2>11. {ui.sectionTitles[10]}</h2>
              <h3>11.1 {ui.subsectionTitles.euUsers}</h3>
              <p>{supplementText(2, p.termsSupplement)}</p>

              <h3>11.2 {ui.subsectionTitles.usaUsers}</h3>
              <p>{supplementText(3, p.termsSupplement)}</p>

              <h2>12. {ui.sectionTitles[11]}</h2>
              <p>{supplementText(4, p.termsSupplement)}</p>

              <p>
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
            </>
          )}
        </div>
        <p className="text-muted">© {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}</p>
      </div>
    </>
  );
}
