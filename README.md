

## Bugs 

Since I feel like the point of this is to see how I find and fix bugs, I purposefully did not use AI to find and fix them.

Below you will see the issues, in the order that i found them. Some of them might not be the ones that were put here on purpose.



* Can't create user
Actually a local database connectivity user, discovered that by adding console.logs on the backend to see pgsql error and then fixed my local pgsql config to allow md5 authentication instead of ident.


* User relation doesnt exist
Even after running migration. After examining db, the mgiration was run on the main scheme, not on created db. Turns out the silly $DATABASE_URL was not doing its thing on npm run. Temporarly changed it to put the connection string inline so it ran properly. And dropped the incorrectly created table. Longterm solution involves using something like dotenv-cli or defining the env variable in the shell/env instead of/besides the .env file.


* secretOrPrivateKey must have a value
When logging in. There was a type on JWT_SECERT env variable when signing the jwt. The error stack gave the line of code that threw the error, also said that was on jwt lib. Reading that "it must have a value" it makes sense that the env variable was not loaded.


* "Something went wrong"
When trying to access the profile route. After adding a console log on the catch block, turns out the userId in the query was user_id, not id as it was supposed to be. (The error said column "user_id" does not exist)

* Could login with wrong password
After testing with wrong password, it would still return a token. After reading the code that was supposed to check that, I saw bcrypt.compare returned a promise that was not beeing awaited before checking for its value. Fixed by awaiting it.