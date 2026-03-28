const fs = require('fs');

let content = fs.readFileSync('src/app/track-your-item/page.js', 'utf8');

const regex = /<div className="home-section" style={{ textAlign: "left", marginTop: "4rem", marginBottom: "2rem", backgroundColor: "var\(--card-bg\)" }}>[\s\S]*?(?=<\/div>\s*<p className="mt-5 text-muted">)/;

const newSection = `
        <div className="home-section mt-5">
          <div className="text-center mb-4">
            <h2 className="section-title">Understanding Tracking Statuses</h2>
            <p className="section-subtitle mx-auto" style={{ maxWidth: "800px", color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              Thank you for using our unified international parcel tracking tool. Because your package voyages across multiple global borders, its tracking statuses can be complex. Understanding the logistics lifecycle helps set clear expectations.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Information Received</h3>
              <p>
                When an order is first processed on our e-commerce platforms (such as Etsy, eBay, or direct sales), the tracking number is generated electronically. The carrier receives the shipment data before physical possession of the box. Please allow 1 to 3 business days for the parcel to be inducted into the physical sorting facility.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏭</div>
              <h3>Processing at Origin Hub</h3>
              <p>
                Once dropped off, the item enters the origin processing center where it is scanned, weighed, and subjected to primary export security screenings. It is then dispatched to the international mail exchange. Flight schedules depend on available cargo bandwidth. Do not be alarmed if it remains in this state for several days.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🛂</div>
              <h3>Customs Clearance Information</h3>
              <p>
                All cross-border items must clear your local country's customs agency. Our tool monitors transitions from import facility arrival to customs handovers. Border patrols will verify HS codes and ensure correct VAT or duties have been remitted (e.g., IOSS in the EU, VOEC in Norway). Monitor tracking specifically for "Held at Customs" warnings.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Last-Mile Delivery Network</h3>
              <p>
                Rhythm Nexus utilizes premium commercial networks. However, the exact moment it arrives in your country, custody transfers to the local domestic carrier (e.g., USPS, Royal Mail, DHL locally). Tracking prefixes change handling systems at this threshold, but our universal parcel tracker stitches these statuses together to give you uninterrupted visibility.
              </p>
            </div>
          </div>
        </div>
`;

content = content.replace(regex, newSection.trim() + '\n        ');

fs.writeFileSync('src/app/track-your-item/page.js', content, 'utf8');
console.log('patched track-your-item/page.js');
