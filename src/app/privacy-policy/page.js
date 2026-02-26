'use client';

import { Navigation } from '../../components/Navigation';
import { useLanguage } from '../../LanguageContext';
import { policyText } from '../../lib/policyI18n';
import { getLocalizedPolicyDate, getPrivacyUiLabels } from '../../lib/policyUiI18n';

const normalizeLang = (language) => {
  const code = (language || 'en').toLowerCase();
  if (code === 'iw') return 'he';
  if (code === 'fil') return 'tl';
  if (code === 'zh-cn' || code === 'zh-hans') return 'zh';
  if (code === 'zh-tw' || code === 'zh-hk' || code === 'zh-hant') return 'zh-hant';
  if (code.startsWith('nb') || code.startsWith('nn')) return 'no';
  return code;
};

export default function PrivacyPolicyPage() {
  const { t, language } = useLanguage();
  const p = policyText(language);
  const isEnglish = normalizeLang(language) === 'en';
  const ui = getPrivacyUiLabels(language);
  const localizedDate = getLocalizedPolicyDate(language);
  const parseSections = (value = '') => {
    if (value.includes('|||')) {
      return value.split('|||').map((s) => s.trim()).filter(Boolean);
    }
    return value.split(/(?<=[.!?])\s+/).filter(Boolean);
  };

  const privacySentences = parseSections(p.privacyText);
  const supplementSentences = parseSections(p.privacySupplement);

  const sectionText = (index, fallback = '') => privacySentences[index] || fallback;
  const supplementText = (index, fallback = '') => supplementSentences[index] || fallback;
  const privacyHeading = isEnglish ? 'PRIVACY POLICY' : p.privacyTitle;

  return (
    <>
      <Navigation />
      <div className="container mt-5">
        <div className="blog-content-card rates-card">
          {isEnglish ? (
            <>
              <h1>PRIVACY POLICY</h1>
              <p><strong>{ui.effectiveDate}:</strong> {localizedDate}</p>
              <p><strong>{ui.lastUpdated}:</strong> {localizedDate}</p>

              <p>Rhythm Nexus (“we”, “us”, or “our”) respects your privacy and is committed to protecting your personal data.</p>

              <p>This Privacy Policy explains:</p>
              <ul>
                <li>What personal data we collect</li>
                <li>How it is used</li>
                <li>Who we share it with</li>
                <li>Your rights</li>
              </ul>

              <p>This policy applies to users from the EU, EEA, Switzerland, and the USA.</p>

              <h2>1. {ui.sectionTitles[0]}</h2>
              <h3>1.1 {ui.subsectionTitles.personalDataProvided}</h3>
              <p>We collect the personal information you voluntarily provide, including:</p>
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Billing &amp; shipping address</li>
                <li>Phone number</li>
                <li>Payment information (handled by third-party processors)</li>
              </ul>

              <h3>1.2 {ui.subsectionTitles.automaticData}</h3>
              <p>We automatically collect:</p>
              <ul>
                <li>IP address</li>
                <li>Browser type</li>
                <li>Device data</li>
                <li>Usage data</li>
                <li>Cookies and tracking technologies</li>
              </ul>

              <h2>2. {ui.sectionTitles[1]}</h2>
              <p>If you are in the EU/EEA/Switzerland, we process your data based on:</p>
              <ul>
                <li>Contract performance (order fulfillment)</li>
                <li>Legal obligation</li>
                <li>Legitimate interests</li>
                <li>Consent (where required)</li>
              </ul>

              <h2>3. {ui.sectionTitles[2]}</h2>
              <p>We use your data to:</p>
              <ul>
                <li>Process orders</li>
                <li>Ship products</li>
                <li>Communicate with you</li>
                <li>Provide customer support</li>
                <li>Comply with legal obligations</li>
                <li>Improve our Website</li>
                <li>Send marketing communications (with consent)</li>
              </ul>

              <h2>4. {ui.sectionTitles[3]}</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul>
                <li>Operate the Website</li>
                <li>Analyze usage</li>
                <li>Personalize content</li>
              </ul>
              <p>EU/EEA/Swiss visitors will be shown a cookie consent banner.</p>
              <p>You can manage cookie preferences in your browser settings.</p>

              <h2>5. {ui.sectionTitles[4]}</h2>
              <p>We may share your data with:</p>
              <ul>
                <li>Payment processors</li>
                <li>Shipping partners</li>
                <li>Analytics providers</li>
                <li>Marketing service providers</li>
                <li>Legal authorities when required</li>
              </ul>
              <p>We do not sell personal data.</p>

              <h2>6. {ui.sectionTitles[5]}</h2>
              <h3>6.1 {ui.subsectionTitles.euRights}</h3>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Erase your data</li>
                <li>Restrict processing</li>
                <li>Object to processing</li>
                <li>Port your data</li>
                <li>Withdraw consent</li>
              </ul>
              <p>To exercise these rights, contact us at: rhythmnexusco@gmail.com</p>

              <h3>6.2 {ui.subsectionTitles.usaRights}</h3>
              <p>If you are a California resident, you have the rights to:</p>
              <ul>
                <li>Know what personal data is collected</li>
                <li>Request deletion</li>
                <li>Opt-out of data sharing</li>
                <li>Non-discrimination for exercising rights</li>
              </ul>
              <p>To submit requests, email: rhythmnexusco@gmail.com</p>

              <h2>7. {ui.sectionTitles[6]}</h2>
              <p>We retain personal data:</p>
              <ul>
                <li>As long as necessary to fulfill orders</li>
                <li>To comply with legal requirements</li>
                <li>To resolve disputes</li>
              </ul>

              <h2>8. {ui.sectionTitles[7]}</h2>
              <p>We may transfer data outside of your region. When transferring from the EU/EEA/Switzerland, we use:</p>
              <ul>
                <li>Standard Contractual Clauses (SCCs)</li>
                <li>Other lawful safeguards</li>
              </ul>

              <h2>9. {ui.sectionTitles[8]}</h2>
              <p>We implement reasonable technical and organizational safeguards including:</p>
              <ul>
                <li>SSL encryption</li>
                <li>Secure payment systems</li>
                <li>Access control measures</li>
              </ul>
              <p>However, no system is 100% secure.</p>

              <h2>10. {ui.sectionTitles[9]}</h2>
              <p>We do not knowingly collect personal data from children under:</p>
              <ul>
                <li>13 in the USA</li>
                <li>16 in the EU/EEA</li>
              </ul>
              <p>If we learn that we have collected such data, we will delete it.</p>

              <h2>11. {ui.sectionTitles[10]}</h2>
              <p>Our Website may contain links to third-party sites. We are not responsible for their privacy practices.</p>

              <h2>12. {ui.sectionTitles[11]}</h2>
              <p>We may update this policy. The new version will be posted at this URL with a revised effective date.</p>

              <h2>13. {ui.sectionTitles[12]}</h2>
              <p>Rhythm Nexus</p>
              <p>
                <a href="https://rhythmnexus.org" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                  https://rhythmnexus.org
                </a>
              </p>
              <p>Email: rhythmnexusco@gmail.com</p>
            </>
          ) : (
            <>
              <h1>{privacyHeading}</h1>
              <p><strong>{ui.effectiveDate}:</strong> {localizedDate}</p>
              <p><strong>{ui.lastUpdated}:</strong> {localizedDate}</p>

              <p>{sectionText(0, p.privacyText)}</p>

              <h2>1. {ui.sectionTitles[0]}</h2>
              <h3>1.1 {ui.subsectionTitles.personalDataProvided}</h3>
              <p>{sectionText(1, p.privacyText)}</p>

              <h3>1.2 {ui.subsectionTitles.automaticData}</h3>
              <p>{sectionText(2, p.privacyText)}</p>

              <h2>2. {ui.sectionTitles[1]}</h2>
              <p>{sectionText(3, p.privacyText)}</p>

              <h2>3. {ui.sectionTitles[2]}</h2>
              <p>{sectionText(4, p.privacyText)}</p>

              <h2>4. {ui.sectionTitles[3]}</h2>
              <p>{supplementText(0, p.privacySupplement)}</p>

              <h2>5. {ui.sectionTitles[4]}</h2>
              <p>{sectionText(5, p.privacyText)}</p>

              <h2>6. {ui.sectionTitles[5]}</h2>
              <h3>6.1 {ui.subsectionTitles.euRights}</h3>
              <p>{sectionText(6, p.privacyText)}</p>

              <h3>6.2 {ui.subsectionTitles.usaRights}</h3>
              <p>{sectionText(7, p.privacyText)}</p>

              <h2>7. {ui.sectionTitles[6]}</h2>
              <p>{sectionText(8, p.privacyText)}</p>

              <h2>8. {ui.sectionTitles[7]}</h2>
              <p>{sectionText(9, p.privacyText)}</p>

              <h2>9. {ui.sectionTitles[8]}</h2>
              <p>{sectionText(10, p.privacyText)}</p>

              <h2>10. {ui.sectionTitles[9]}</h2>
              <p>{supplementText(1, p.privacySupplement)}</p>

              <h2>11. {ui.sectionTitles[10]}</h2>
              <p>{supplementText(2, p.privacySupplement)}</p>

              <h2>12. {ui.sectionTitles[11]}</h2>
              <p>{supplementText(3, p.privacySupplement)}</p>

              <h2>13. {ui.sectionTitles[12]}</h2>
              <p>Rhythm Nexus</p>
              <p>
                <a href="https://rhythmnexus.org" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                  https://rhythmnexus.org
                </a>
              </p>
              <p>Email: rhythmnexusco@gmail.com</p>
            </>
          )}
        </div>
        <p className="text-muted">© {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}</p>
      </div>
    </>
  );
}
