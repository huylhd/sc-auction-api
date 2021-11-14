# sc-auction-api
Api for Auction site

### How to run
1. Install packages:
```npm i```

2. Create an `.env` file (clone `.env.example`)

3. Start `Mongodb` and `redis` locally

4. Run the seeding command:
```npm run seed```

5. Start the server:
```npm run dev```

### Auto-bid implementation
- After a bid for an item, check for every auto-bid users for that same item, choose a user and place a higher bid (+1). Loop until no more users to find (delay 1000ms)
- Implement redlock to prevent concurrency race condition