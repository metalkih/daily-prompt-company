const APEX_HOST = "daily-prompt.com";
const WWW_HOST = `www.${APEX_HOST}`;
const GOOGLE_SITE_VERIFICATION_PATH = "/google9728e014727cab5b.html";
const GOOGLE_SITE_VERIFICATION_BODY =
  "google-site-verification: google9728e014727cab5b.html";

export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === GOOGLE_SITE_VERIFICATION_PATH) {
      return new Response(GOOGLE_SITE_VERIFICATION_BODY, {
        headers: {
          "cache-control": "public, max-age=3600",
          "content-type": "text/html; charset=utf-8",
        },
      });
    }

    const shouldNormalizeHost = url.hostname === WWW_HOST;
    const shouldNormalizeProtocol =
      url.hostname === APEX_HOST && url.protocol !== "https:";

    if (shouldNormalizeHost || shouldNormalizeProtocol) {
      url.hostname = APEX_HOST;
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
