const APEX_HOST = "daily-prompt.com";
const WWW_HOST = `www.${APEX_HOST}`;

export default {
  fetch(request, env) {
    const url = new URL(request.url);
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
