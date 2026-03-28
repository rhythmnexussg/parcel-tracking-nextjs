import fs from 'fs';
let content = fs.readFileSync('src/app/track-your-item/page.js', 'utf8');

const descriptionBlock = `
        {/* SEO Content Block */}
        <div className="home-section" style={{ textAlign: "left", marginTop: "4rem", marginBottom: "2rem", backgroundColor: "var(--card-bg)" }}>
          <h2>Understanding Your International Parcel Tracking Statuses</h2>
          <p>
            Thank you for using our unified international parcel tracking tool. Because your package voyages across multiple global borders, its tracking statuses can be complex. Understanding the logistics lifecycle helps set clear expectations for when your shipment will cross customs checkpoints and reach the final delivery agency. Below is a comprehensive guide to tracking phases.
          </p>
          <h3>What Does 'Information Received' Mean?</h3>
          <p>
            When an order is first processed on our e-commerce platforms (such as Etsy, eBay, or direct sales), the tracking number is generated electronically. The carrier (SingPost, DHL eCommerce, or postal partners) receives the shipment data before physical possession of the box. This initial state simply indicates that a shipping label exists. Please allow 1 to 3 business days for the parcel to be inducted into the physical sorting facility.
          </p>
          <h3>Acceptance and Processing at Origin Hub</h3>
          <p>
            Once your item is dropped off, it enters the origin processing center. Items are scanned, weighed, and subjected to primary export security screenings. It is then dispatched to the international mail exchange. During this period, flight schedules depend heavily on available cargo bandwidth. Do not be alarmed if a parcel remains in 'Processing at Origin' for several days, especially during peak holiday periods or severe weather events.
          </p>
          <h3>Customs Clearance Information</h3>
          <p>
            All cross-border items must clear your local country's customs agency. Our tool monitors transitions from import facility arrival to customs handovers. During the inspection phase, your local border patrols will verify the Harmonized System (HS) codes, ensure correct VAT or duties have been remitted (e.g., IOSS in the EU, VOEC in Norway), and approve the parcel for domestic movement. If physical inspections occur, extra delays are unavoidable. We highly recommend monitoring tracking specifically for "Held at Customs" warnings, which may require you to pay duties.
          </p>
          <h3>Last-Mile Delivery Network</h3>
          <p>
            Rhythm Nexus utilizes premium commercial networks like SpeedPost Priority and SpeedPost Express. However, the exact moment it arrives in your country, custody transfers to the local domestic carrier. For example, USPS in the United States, Royal Mail in the United Kingdom, or DHL Courier delivery for express shipments. Tracking prefixes change handling systems at this threshold, but our universal parcel tracker correctly stitches these disparate carrier statuses together to give you uninterrupted visibility.
          </p>
        </div>
`;

content = content.replace("<p className=\"mt-5 text-muted\">", descriptionBlock + "\n        <p className=\"mt-5 text-muted\">");

fs.writeFileSync('src/app/track-your-item/page.js', content);
