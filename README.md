# listerlyify-server
GraphQL server for interacting with the Twitter API

Create RSA Key Pair
---------------------

- Generate the private key

```sh
openssl genrsa -out private-key.pem 2048
```

- Create the public key from the private key

```sh
openssl rsa -in private-key.pem -pubout -out public-key.pem
```
