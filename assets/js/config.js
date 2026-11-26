/* Joust Revival site settings: the only file to edit when a link or service is ready.
   An empty string means "not ready yet": the button or link shows as "coming" and does nothing.
   No third-party scripts are loaded by this site. The newsletter form only sends data once `newsletter.endpoint` is set. */
window.SITE_CONFIG = {
  // The free browser game (live).
  gameUrl: 'https://historic-pictures.github.io/tilt/',

  // The Steam page for the PC version. Empty until the Unreal version exists and the Steam page is up.
  wishlistUrl: '',

  // Donations: e.g. a Ko-fi page ("https://ko-fi.com/<name>"). Empty = "coming".
  donateUrl: '',

  // Newsletter sign-up. Any service that accepts a plain form POST with an `email` field works
  // (Buttondown, ConvertKit/Kit, Mailchimp's form action URL, a Formspree form, or your own Cloudflare Worker).
  newsletter: {
    endpoint: '',            // e.g. 'https://buttondown.com/api/emails/embed-subscribe/<list>'
    field: 'email',          // the name of the e-mail field the service expects
    method: 'POST',
    // 'no-cors' lets a plain HTML form endpoint accept the post without CORS headers (the page then cannot read the reply,
    // so it shows the success message once the request is sent). Use 'cors' for an endpoint you control.
    mode: 'no-cors',
  },

  // Social accounts. Empty = shown greyed out as "coming".
  social: {
    discord: '',
    youtube: '',
    tiktok: '',
    x: '',
  },

  // Press and business contact. Empty = "contact address coming".
  contactEmail: '',
};
