# WIC task

## Deployment
Deploy via docker-compose

```bash
docker-compose build
docker-compose up
```

#### open localhost:5000

### Available URLs 
```
localhost:5000/get_data
localhost:5000/get_data/[searchStr]
localhost:5000/users_tasks
localhost:5000/by_post_count
```

```
There is a cashing mechanism for /get_data URL. It stores data in Redis by search query as a key and result as a value if the key doesn't exist.
And returns the data from Redis if it is available there.
```
   
```
Another solution for tasks 5-8 could be store all data in MongoDB and use the aggregation framework.
```
