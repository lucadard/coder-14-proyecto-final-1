## Project

Build the project:

    npm run build

You can run it in Fork mode (default):

    npm start

Or in cluster mode:

    npm start -- --mode=cluster

## Options

You can specify:

<details>
<summary>
--port
</summary>
8080 by default.
</details>
<details>

<summary>
--mode
</summary>
- To run it in cluster of fork mode, fork is the default.
</details>

<details>
<summary>
--i
</summary>
- To select how many instances will run. One instance will run in the specified port and the others in the following skipping the first one. For example if 3000 is the default port, the second server will listen in 3002, the minimum is 2 and the default is 5.
</details>
