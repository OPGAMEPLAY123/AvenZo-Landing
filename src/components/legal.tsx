import type { ReactNode } from 'react';
import type { LegalId } from '../lib/ui';

interface Doc {
  title: string;
  updated: string;
  body: ReactNode;
}

const H = ({ children }: { children: ReactNode }) => (
  <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-gold">{children}</h3>
);
const P = ({ children }: { children: ReactNode }) => <p className="mt-3 leading-relaxed text-white/75">{children}</p>;

/**
 * Starter legal copy. It is written to match the product's intent (no guaranteed
 * cashback, no fabricated tracking) but it is NOT legal advice — have counsel
 * review and adapt it before launch.
 */
export const LEGAL: Record<LegalId, Doc> = {
  terms: {
    title: 'Terms and Conditions',
    updated: 'Last updated: 1 November 2026',
    body: (
      <>
        <P>
          These Terms govern your use of the AvenZo website and any offers or links shown on it. AvenZo is a
          product of OPG Studios. By using the website you agree to these Terms.
        </P>
        <H>What AvenZo is</H>
        <P>
          AvenZo is a shopping discovery and cashback platform. It shows offers and links to third-party shopping
          platforms. AvenZo is not the seller of products on those platforms and is not responsible for their
          products, prices, delivery, returns or customer service.
        </P>
        <H>Eligibility and accounts</H>
        <P>
          You must be legally able to enter a binding agreement to use AvenZo. Where accounts are offered, you are
          responsible for the accuracy of the information you provide and for keeping your credentials secure.
        </P>
        <H>Offers and cashback</H>
        <P>
          Any cashback is governed by the Cashback Terms and by the conditions stated on each individual offer.
          Cashback is not guaranteed. Offers may change, be paused or be withdrawn at any time.
        </P>
        <H>Acceptable use</H>
        <P>
          You agree not to misuse the website, attempt to gain unauthorised access, interfere with its operation,
          or use it for fraudulent activity, including attempts to claim cashback you are not entitled to.
        </P>
        <H>Third-party websites</H>
        <P>
          Links lead to services we do not control. Their terms and privacy practices apply once you leave AvenZo.
        </P>
        <H>Limitation of liability</H>
        <P>
          To the maximum extent permitted by law, AvenZo and OPG Studios are not liable for indirect or
          consequential loss arising from your use of the website or from third-party platforms.
        </P>
        <H>Changes</H>
        <P>
          We may update these Terms from time to time. Continued use of the website after an update means you accept
          the revised Terms.
        </P>
      </>
    ),
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: 1 November 2026',
    body: (
      <>
        <P>
          This policy explains how AvenZo, a product of OPG Studios, treats personal information in connection with
          this website.
        </P>
        <H>Information we may handle</H>
        <P>
          Information you provide directly (for example when you create an account or contact us), and technical
          information such as device type, browser and pages viewed, which helps us keep the website working and
          improve it.
        </P>
        <H>How we use it</H>
        <P>
          To operate and secure the website, provide and improve our services, respond to enquiries, and meet legal
          obligations. Where a purchase on a third-party platform is relevant to a cashback offer, the information
          needed to assess eligibility may be used for that purpose only.
        </P>
        <H>Sharing</H>
        <P>
          We do not sell personal information. We may share it with service providers who help us run the website, and
          where required by law. Third-party shopping platforms have their own privacy practices.
        </P>
        <H>Cookies and storage</H>
        <P>
          The website may use cookies or similar technologies for essential functionality and analytics. You can
          control cookies through your browser settings.
        </P>
        <H>Your choices</H>
        <P>
          Depending on where you live, you may have rights to access, correct or delete your information. Contact us
          using the details published on the AvenZo website or app to make a request.
        </P>
        <H>Security and retention</H>
        <P>
          We use reasonable safeguards and keep information only as long as needed for the purposes above or as the law
          requires.
        </P>
      </>
    ),
  },
  cashback: {
    title: 'Cashback Terms',
    updated: 'Last updated: 1 November 2026',
    body: (
      <>
        <P>
          Cashback is a reward that may be available on eligible purchases. It is never guaranteed. Whether you
          receive cashback, and how much, depends on the conditions of the specific offer.
        </P>
        <H>First purchase offer</H>
        <P>
          The promotional offer of ₹100 cashback applies to a first eligible purchase only, and only where the offer
          conditions are met. Eligibility, minimum order values, excluded categories, validity period and any
          per-user limits are stated on the offer.
        </P>
        <H>What makes a purchase eligible</H>
        <P>
          You generally need to reach the shopping platform through an eligible AvenZo link and complete the purchase
          in the same session, without using methods that interfere with tracking. Purchases that are cancelled,
          returned, refunded or not confirmed by the platform may not qualify.
        </P>
        <H>Confirmation and timing</H>
        <P>
          Cashback depends on the shopping platform confirming your purchase. Confirmation can take time, and the
          timing and method of any payout are described on the offer.
        </P>
        <H>Fair use</H>
        <P>
          Duplicate accounts, fraudulent or abusive activity, or attempts to circumvent offer conditions may lead to
          cashback being withheld or reversed.
        </P>
        <H>Changes to offers</H>
        <P>
          Offers can be changed, paused or withdrawn. If a condition on an offer conflicts with this summary, the
          condition on the offer applies.
        </P>
      </>
    ),
  },
};
