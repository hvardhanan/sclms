import auth0 from '../../lib/auth0';

export default async function handle(req, res) {
    await auth0.handleAuth(req, res);

}
