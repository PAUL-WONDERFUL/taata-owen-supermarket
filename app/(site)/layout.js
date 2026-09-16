import SiteHeader from '../../components/SiteHeader.js';
import SiteFooter from '../../components/SiteFooter.js';
import FindUsButton from '../../components/FindUsButton.js';

export default function SiteLayout({ children }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <FindUsButton floating />
    </>
  );
}
