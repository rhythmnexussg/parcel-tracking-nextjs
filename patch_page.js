import fs from 'fs';
let content = fs.readFileSync('src/app/page.js', 'utf8');

const descriptionBlock = `
        <div className="home-section" style={{ textAlign: "left", marginTop: "3rem" }}>
          <h2>About Our International Parcel Services</h2>
          <p>
            Welcome to the official <strong>Rhythm Nexus Hub</strong>. We are a dedicated logistics and e-commerce partner ensuring seamless international deliveries to our global customers. With operations spanning across multiple continents, our platform allows you to access tracking details, review customs processes, and monitor the health of cross-border shipments using major couriers like SingPost and DHL Express.
          </p>
          <h3>Why Use Our Service?</h3>
          <p>
            International shipping can often be a complex landscape involving varying regulations, customs duties, import restrictions, and extended transit times. At Rhythm Nexus, we abstract away the complexity. Our specialized parcel tracking tool correlates information between regional post offices, commercial couriers, and international transport hubs so that you have clear visibility on your items.
            Whether a package is entering the European Union under the IOSS framework or arriving in the United States subject to Section 122 regulations, our advanced routing network ensures data transparency.
          </p>
          <h3>Navigating Customs and Duties</h3>
          <p>
            For many international parcels, import duties may apply. We provide comprehensive guides and blog posts about regional requirements such as Norway's VOEC scheme, Swiss VAT collection, and the UK HMRC threshold processes. Staying informed is the best way to prevent your parcels from being seized by local border agencies, ensuring they reach your doorstep without unexpected fees.
          </p>
          <h3>Our Marketplace Presences</h3>
          <p>
            As a robust multi-channel merchant, Rhythm Nexus operates licensed digital storefronts on prominent marketplaces including Etsy, eBay, Shopee, and Payhip. Our dedicated shipping infrastructure means that whether you order digital media, physical collectibles, or logistics services, your fulfillment is handled methodically. You don't have to worry about missing tracking prefixes or ambiguous final-mile delivery agents. We work directly with primary postal operators internationally.
          </p>
        </div>
`;

content = content.replace(/<div className="mt-4">\s*<\/div>/, '<div className="mt-4">\n</div>\n' + descriptionBlock);
fs.writeFileSync('src/app/page.js', content);
