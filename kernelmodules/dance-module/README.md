# dance-module

dance-module is a skynet kernel module that will handle storing data for callerkit and connecting it to the feed dac.

## Building

Use `npm run build` to build and deploy the developer version of the module.
This creates a unique seed for each machine that allows you to run tests
against a full skynet module without having to push unfinished code to prod.

Use `npm run deploy` to build and deploy the production code. A password will
be requested which is required to deploy to prod. If you know the password, you
can update the production verison of this module.

We currently use a password scheme because it is more decentralized. We do not
want a central server that controls the deployment process in the Skynet
ecosystem. Over time, we will be able to add more sophisticated tooling such as
a decentralized 2FA scheme and a decentralized code approval process which
ensures code cannot be shipped to users without some process and oversight.
