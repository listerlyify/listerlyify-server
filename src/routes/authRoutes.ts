import express from 'express';
import Twitter from 'twitter-lite';
import config from 'config';

// This Twitter client only contains the consumerKey and consumer secret so it
// can only be used for API requests to initialize auth
const authClient = new Twitter({
  consumer_key: config.get<string>('auth.twitter.consumerKey'),
  consumer_secret: config.get<string>('auth.twitter.consumerSecret'),
});

async function getAuthTwitter(_req: express.Request, res: express.Response) {
  const callbackBaseUrl = config.get<string>('auth.twitter.callbackBaseUrl');
  try {
    // The typing for the twitter-lite library is incorrect and doesn't think
    // the oauth_token value exists on the getRequestToken response
    // Created https://github.com/draftbit/twitter-lite/pull/105 to resolve this
    // typing issue in the twitter-lite library
    // @ts-ignore TS2339
    const { oauth_token: oauthToken } = await authClient.getRequestToken(
      `${callbackBaseUrl}/auth/callback/twitter`,
    );

    return res.redirect(
      `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`,
    );
  } catch (error) {
    const errorCode = error.errors[0].code;

    res.status(errorCode);
    return res.json(error);
  }
}

async function getAuthCallbackTwitter(
  req: express.Request,
  res: express.Response,
) {
  try {
    const accessInfo = await authClient.getAccessToken({
      oauth_token: req?.query?.oauth_token as string,
      oauth_verifier: req?.query?.oauth_verifier as string,
    });

    const {
      oauth_token: oauthToken,
      oauth_token_secret: oauthTokenSecret,
      user_id: userId,
      screen_name: screenName,
    } = accessInfo;

    res.json({
      oauthToken,
      oauthTokenSecret,
      userId,
      screenName,
    });
  } catch {
    // The authClient doesn't return a useful error here, so call it a
    // 500, but send a message that says they may not have authorized
    // this app for Twitter
    res.status(500);
    res.json({
      errors: [
        {
          code: 500,
          message:
            'Unknown error failing to retrieve request token. The user may not have authorized this app for Twitter.',
        },
      ],
    });
  }
}

export { getAuthTwitter, getAuthCallbackTwitter };
